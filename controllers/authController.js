const authService = require('../services/authService');

exports.googleLogin = async (req, res) => {
    try {
        // 인가 코드 받기
        const { code } = req.body;
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