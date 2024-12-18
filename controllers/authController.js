const userStore = require('../store/userStore');
const errorMessage = require('../utils/errorMessage');
const authService = require('../services/authService');

exports.googleLogin = async (req, res) => {
    try {
        const { code } = req.body; // 인가 코드 받기
        if (!code) {
            return res.status(400).json({ message: 'Authorization code is required.' });
        }

        const { token, user } = await authService.handleGoogleLogin(code);
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Google login failed.', error: error.message });
    }
};

exports.getPuuid = async (req, res) => {
    try {
        const { userName, page, pageSize } = req.query;

        const results = await userStore.findByUserName(userName, page, pageSize);

        if (results.length) {
            return res.status(200).json(results);
        } else {
            return errorMessage(res, 404);
        }
    } catch (error) {
        console.error(error);
        return errorMessage(res, 500);
    }
};