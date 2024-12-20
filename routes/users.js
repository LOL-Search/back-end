var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');
const riotStatusController=require('../controllers/riotStatusController')

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
/**
 *  @swagger
 *  paths:
 *    /users/status:
 *      post:
 *        summary: "소환사 상태 조회"
 *        tags:
 *          - 유저 API
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userName:
 *                    type: string
 *                    description: "리그 오브 레전드 소환사 이름"
 *                    example: "캉 주"
 *                  tag:
 *                    type: string
 *                    description: "리그 오브 레전드 소환사 태그"
 *                    example: "kr1"
 *        responses:
 *          200:
 *            description: "소환사 상태 정보 조회 성공"
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    matchInfo:
 *                      type: array
 *                      description: "최근 20개 매치 정보"
 *                      items:
 *                        type: object
 *                        properties:
 *                          kills:
 *                            type: integer
 *                            description: "킬 수"
 *                            example: 10
 *                          assists:
 *                            type: integer
 *                            description: "어시스트 수"
 *                            example: 5
 *                          deaths:
 *                            type: integer
 *                            description: "죽은 횟수"
 *                            example: 2
 *                          kda:
 *                            type: number
 *                            format: float
 *                            description: "킬/데스/어시스트 비율"
 *                            example: 5.0
 *                          win:
 *                            type: boolean
 *                            description: "승리 여부"
 *                            example: true
 *                          championName:
 *                            type: string
 *                            description: "선택한 챔피언 이름"
 *                            example: "Zed"
 *                          killParticipation:
 *                            type: number
 *                            format: float
 *                            description: "킬 참여율"
 *                            example: 0.5
 *                          gameLength:
 *                            type: number
 *                            format: float
 *                            description: "게임 길이 (초 단위)"
 *                            example: 1800.0
 *                    summonRank:
 *                      type: array
 *                      description: "소환사의 랭크 정보"
 *                      items:
 *                        type: object
 *                        properties:
 *                          queueType:
 *                            type: string
 *                            description: "게임 모드"
 *                            example: "RANKED_SOLO_5x5"
 *                          tier:
 *                            type: string
 *                            description: "티어"
 *                            example: "GOLD"
 *                          rank:
 *                            type: string
 *                            description: "랭크"
 *                            example: "IV"
 *                          leaguePoints:
 *                            type: integer
 *                            description: "리그 포인트"
 *                            example: 40
 *                          wins:
 *                            type: integer
 *                            description: "승리 수"
 *                            example: 100
 *                          losses:
 *                            type: integer
 *                            description: "패배 수"
 *                            example: 50
 *          400:
 *            description: "잘못된 요청: 사용자 이름 또는 태그 누락"
 *            content:
 *              application/json:
 *                example: {
 *                  "message": "userName and tag are required."
 *                }
 *          500:
 *            description: "서버 오류"
 *            content:
 *              application/json:
 *                example: {
 *                  "message": "get riot status failed.",
 *                  "error": "Error details here"
 *                }
 */
router.post('/status', riotStatusController.getStatus);
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

module.exports = router;
