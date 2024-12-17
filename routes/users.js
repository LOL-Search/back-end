var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.googleLogin);
router.get('/test', (req, res) => {
    // 테스트용 JSON 응답
    const testData = {
        message: "This is a test response",
        status: "success",
        data: {
            user: "John Doe",
            age: 30
        }
    };

    res.json(testData);  // JSON 형식으로 응답
});
module.exports = router;
