var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

/**
 *  @swagger
 *  paths:
 *    /login:
 *      post:
 *        summary: "구글 로그인"
 *        tags:
 *          - 인증 API
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  authCode:
 *                    type: string
 *                    description: "구글 인가 코드"
 *                    example: "4/0AY0e-g6jF5YrcQ2Z_1wN9uFw0L4Qx8HMI_J_JZaDffqDgFsGPlR3KH0z5I_tlhvxqXiRR9BqgVZyhw4bkj8HzT0N5c7t40FQFUz"
 *        responses:
 *          200:
 *            description: "구글 로그인 성공"
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: "인증된 JWT 토큰"
 *                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                    user:
 *                      type: object
 *                      description: "로그인한 사용자 정보"
 *                      properties:
 *                        id:
 *                          type: integer
 *                          description: "사용자 ID"
 *                          example: 1
 *                        userName:
 *                          type: string
 *                          description: "사용자 이름"
 *                          example: "홍길동"
 *                        email:
 *                          type: string
 *                          description: "사용자 이메일"
 *                          example: "hong@domain.com"
 *                        google_id:
 *                          type: string
 *                          description: "구글 ID"
 *                          example: "1234567890"
 *          400:
 *            description: "잘못된 요청: 인가 코드가 없음"
 *            content:
 *              application/json:
 *                example: {
 *                  "message": "Authorization code is required."
 *                }
 *          500:
 *            description: "서버 에러"
 *            content:
 *              application/json:
 *                example: {
 *                  "message": "Google login failed.",
 *                  "error": "Some error message"
 *                }
 */

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
