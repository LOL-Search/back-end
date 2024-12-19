var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
/**
 *  @swagger
 *    paths:
 *      /users:
 *        get:
 *          summary: "유저 조회"
 *          tags:
 *              - 유저 API
 *          parameters:
 *            - in: query
 *              name: userName
 *              description: "User name"
 *              required: false
 *              schema:
 *                type: string
 *            - in: query
 *              name: page
 *              description: "Current page (default: 1 page)"
 *              required: false
 *              schema:
 *                type: integer
 *            - in: query
 *              name: pageSize
 *              description: "Number of posts per page (default: 10)"
 *              required: false
 *              schema:
 *                type: integer
 *          responses:
 *            200:
 *              description: "게시판 조회 성공"
 *              content:
 *                application/json:
 *                  example: [
 *                    {
 *                      id: 1,
 *                      uuid: "1234567",
 *                      puuid: "12344567",
 *                      email: "test@test.com",
 *                      password: "password",
 *                      userName: "알리스타",
 *                      socketId: "huTAXrETlOXiqMcgAAC9",
 *                    },
 *                    {
 *                      id: 2,
 *                      uuid: "1234436346cg567",
 *                      puuid: "12344234cwer567",
 *                      email: "admin@admin.com",
 *                      password: "password",
 *                      userName: "가렌",
 *                      socketId: "huTAXdfslOXiqMcgAAC9",
 *                    },
 *                    {
 *                      id: 3,
 *                      uuid: "66345fgd",
 *                      puuid: "123445dfsaf67",
 *                      email: "test@test.com",
 *                      password: "password",
 *                      userName: "조이",
 *                      socketId: "huTAXrETlOXiqMcgAAC9",
 *                    },
 *                  ]
 *            404:
 *              description: "유저 정보 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "해당 내용이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.get('/', authController.getPuuid);
/**
 *  @swagger
 *  paths:
 *    /users/login:
 *      post:
 *        summary: "구글 로그인"
 *        tags:
 *          - 유저 API
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
 *                        uuid:
 *                          type: string
 *                          description: "구글에서 받은 고유 ID (UUID)"
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
router.get('/my', userController.getMyProfile);
module.exports = router;
