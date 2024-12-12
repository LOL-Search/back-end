const axios = require('axios');
const jwtUtil = require('../utils/jwt');
const userRepository = require('../repositories/userRepository');
require('dotenv').config();

class AuthService {
    async handleGoogleLogin(authCode) {
        // 1. 구글로부터 Access Token 요청
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code: authCode,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenResponse.data;

        // 2. 구글로부터 사용자 정보 요청
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id: google_id, email, name } = userInfoResponse.data;
        console.log(google_id+" "+email+" "+name)
        // 3. 사용자 확인 및 DB 저장
        let user = await userRepository.findByGoogleId(google_id);
        if (!user) {
            user = await userRepository.createUser({ google_id, email, name });
        }

        // 4. JWT 토큰 생성
        const token = jwtUtil.generateToken({ id: user.id, email: user.email });
        return { token, user };
    }
}

module.exports = new AuthService();
