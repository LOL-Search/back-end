const { createServer } = require("http");
const app = require("./app");
const { Server } = require("socket.io");
require("dotenv").config();
const db = require("./config/db"); 

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:9999",
  },
});

// socket.io 설정
require("./utils/io")(io);

// MySQL 연결 테스트
db.query("SELECT 1")
  .then(() => {
    console.log("MySQL 연결 성공!");
  })
  .catch((err) => {
    console.error("MySQL 연결 실패: ", err);
  });

// 서버 실행
httpServer.listen(process.env.PORT, () => {
  console.log("server listening on port", process.env.PORT);
});
