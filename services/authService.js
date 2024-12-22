const axios = require('axios');
const jwtUtil = require('../utils/jwt');
const userStore = require('../store/userStore');
require('dotenv').config();

class AuthService {
    async handleGoogleLogin(authCode) {
        try {
            // 1. 구글로부터 Access Token 요청
            console.log('authCode:', authCode);
            console.log('client_id:', process.env.GOOGLE_CLIENT_ID);
            console.log('client_secret:', process.env.GOOGLE_CLIENT_SECRET);
            console.log('redirect_uri:', process.env.REDIRECT_URI);
            let tokenResponse;
            try {
                tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
                    code: authCode,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.REDIRECT_URI,
                    grant_type: 'authorization_code',
                });
            } catch (error) {
                console.error('Error requesting access token:', error.response?.data || error.message);
                throw new Error('Failed to fetch access token from Google.');
            }

            const { access_token } = tokenResponse.data;

            // 2. 구글로부터 사용자 정보 요청
            let userInfoResponse;
            try {
                userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
            } catch (error) {
                console.error('Error fetching user info:', error.response?.data || error.message);
                throw new Error('Failed to fetch user information from Google.');
            }

            const { id: google_id, email, name } = userInfoResponse.data;
            console.log(`Google User Info: ID=${google_id}, Email=${email}, Name=${name}`);

            // 3. 사용자 확인 및 DB 저장
            let user;
            try {
                user = await userStore.findByGoogleId(google_id);
                if (!user) {
                    user = await userStore.createUser({ google_id, email, name });
                }
            } catch (error) {
                console.error('Error interacting with user store:', error.message);
                throw new Error('Failed to process user information in the database.');
            }

            // 4. JWT 토큰 생성
            let token;
            try {
                token = jwtUtil.generateToken({ id: user.id, email: user.email });
            } catch (error) {
                console.error('Error generating JWT token:', error.message);
                throw new Error('Failed to generate authentication token.');
            }

            return { token, user };
        } catch (error) {
            console.error('Error in handleGoogleLogin:', error.message);
            // 에러를 던져 호출자(controller)에서 처리하도록 위임
            throw error;
        }
    }
}

module.exports = new AuthService();
