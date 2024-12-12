const express = require("express");
const router = express.Router();
const {join, login, googleLogin} = require('../controller/UserController');
router.use(express.json());


/**
* @swagger
*   /users:
*     get:
*       description: "users API"
*       responses:
*         200:
*           description: "success"
*           content:
*             application/json:
*               schema:
*                 type: string
*                 example: "Hello world"
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello world');
});

// 회원가입 API
router.post("/join", join); // 회원가입

// 구글 OAuth 로그인 시작
router.get("/login/google", googleLogin);

// 구글 로그인 처리 (콜백 URI)
router.get("/login/redirect", login);

// 일반 로그인 (이메일, 비밀번호)
router.post("/login", login); // 일반 로그인

module.exports = router;
