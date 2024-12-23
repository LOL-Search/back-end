## 🔍 lol-search back-end

### 🚩 기술 스택
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
### 📁 프로젝트 구조
```
back-end
  ├── .github      
  │     └── workflows/main.yml       # AWS EC2 배포 설정
  ├── config
  │     ├── db.js                    # DB 설정
  │     └── swagger.js               # swagger 설정
  ├── controllers
  │     ├── authController.js        # 구글 소셜 로그인 통신 요청 처리
  │     ├── chatingController.js     # 채팅 목록 API
  │     ├── commentController.js     # 댓글 API
  │     ├── postController.js        # 게시물 API
  │     ├── riotStatusController.js  # RIOT 유저 정보 API
  │     ├── socketController.js      # 소캣 통신 요청 처리
  │     └── userController.js        # 회원 정보 API
  ├── routes
  │     ├── chatingRouter.js        # 채팅 목록 API 엔드 포인트 정의 & 명세
  │     ├── posts.js                # 게시물, 댓글 API 엔드 포인트 정의 & 명세
  │     └── users.js                # 회원 로그인 및 유저 정보 API 엔드 포인트 정의 & 명세
  ├── services
  │     ├── authService.js          # Google API 연결
  │     └── riotStatusService.js    # RIOT API 연결
  ├── store
  │     ├── chatStore.js            # 채팅 DB 로직
  │     ├── commentStore.js         # 댓글 DB 로직
  │     ├── postStore.js            # 게시물 DB 로직
  │     └── userStore.js            # 회원 정보 DB 로직
  ├── utils
  │     ├── errorMessage.js         # 응답 시 에러 메시지
  │     └── jwt.js                  # JWT 토큰 처리 로직
  └── app.js
```
### 🛠 프로젝트 클론
##### .env 추가
```
back-end
  └── .env
```
##### 의존성 패키지 설치
```
npm install
```
##### 실행
```
npm start
```
