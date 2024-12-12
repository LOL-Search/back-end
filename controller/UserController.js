const conn = require("../mariadb"); 
const axios = require("axios");
const { StatusCodes } = require("http-status-codes"); //status code 모듈
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); //crypto 모듈 : 암호화
const dotenv = require('dotenv');
dotenv.config();

// 회원가입
const join = (req, res) => {
    const { nickname, email, password } = req.body;

    // 중복 이메일 확인
    const findUserSql = "SELECT * FROM users WHERE email = ?";
    conn.query(findUserSql, [email], (err, results) => {
      if (err) {
          console.log(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
      if (results.length > 0) {
          return res.status(StatusCodes.CONFLICT).json({ message: "Email already exists" });
      }
    })

    let sql = `INSERT INTO users (nickname, email, password, salt) VALUES (?, ?, ?, ?)`;
  
    //암호화된 비밀번호와 salt 값을 같이 DB에 저장
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    
    let values = [nickname, email, hashPassword, salt];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end(); 
      }
      if (results.affectedRows)    
        return res.status(StatusCodes.CREATED).json({ message: "User created successfully" });
      else
        return res.status(StatusCodes.BAD_REQUEST).end(); 
    });
  };

// Google 로그인 시작
const googleLogin = (req, res) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
  console.log("Redirect URI:", GOOGLE_REDIRECT_URI);
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";

  res.redirect(url);
};

// Google OAuth 로그인처리 (콜백 URI)
const login = async (req, res) => {
  const { email, password } = req.body; // 일반 로그인 시 email, password 받아 처리
  const { code } = req.query; // code는 리디렉션 url에 포함된 authorization code

  if(code){
    try {
      // 1. Google 토큰 요청
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const { id_token, access_token } = tokenResponse.data;

      // 2. Google 사용자 정보 요청
      const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { email, name } = userResponse.data;

      // 3. 사용자 정보 DB 처리
      const findUserSql = "SELECT * FROM user_table WHERE email = ?";
      conn.query(findUserSql, [email], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        }

        let user;
        if (results.length === 0) {
          // 신규 사용자 저장
          const createUserSql = `INSERT INTO user_table (name, email) VALUES (?, ?)`;
          conn.query(createUserSql, [name, email], (err, results) => {
            if (err) {
              console.error(err);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            user = { id: results.insertId, email, name };
            issueToken(res, user); // JWT 발급
          });
        } else {
          // 기존 사용자 처리
          user = results[0];
          issueToken(res, user); // JWT 발급
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Google login failed" });
    }
} else if (email && password) {
  const findUserSql = "SELECT * FROM user_table WHERE email = ?";
  conn.query(findUserSql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
    if (results.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email or password is incorrect" });
    }
    const user = results[0];
    const hashPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 10, 'sha512').toString('base64');

            if (hashPassword !== user.password) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email or password is incorrect" });
            }

            issueToken(res, user);
        });
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "No credentials provided" });
    }
};

// JWT 발급 함수
const issueToken = (res, user) => {
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.PRIVATE_KEY, {
    expiresIn: "1h",
  });

  res.status(StatusCodes.OK).json({
    message: "Login successful",
    token,
    user,
  });
};

module.exports = {
  join,
  googleLogin,
  login,
};