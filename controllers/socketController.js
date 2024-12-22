const chatStore = require("../store/chatStore");
const errorMessage = require("../utils/errorMessage");
const jwtUtil = require("../utils/jwt");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Client is connected", socket.id);
    let token = socket.handshake.headers.token;
    console.log(token);
    if(!token) socket.disconnect();

    let authorization = jwtUtil.verifyToken(token);
    console.log(token);
    let userId = authorization.id;
    console.log(userId);
    socket.on("joinRoom", async (data, cb) => {
      const { roomId } = data;
      console.log(`User ${socket.id} is joining room: ${roomId}`);

      try {
        socket.join(roomId);
        console.log(`User ${socket.id} has joined room ${roomId}`);

        cb({ ok: true });

        io.to(roomId).emit("message", {
          chat: `User ${socket.id} has joined the room`,
          roomId,
        });
      } catch (error) {
        console.error("Error joining room:", error);

        const errorResponse = errorMessage(null, 500);
        cb({ ok: false, error: errorResponse.message });
      }
    });

    socket.on("leaveRoom", async (data, cb) => {
      const { roomId } = data;
      console.log(`User ${socket.id} is leaving room: ${roomId}`);

      try {
        socket.leave(roomId);
        console.log(`User ${socket.id} has leaved room ${roomId}`);
        cb({ ok: true });
      } catch (error) {
        console.error("Error leaving room:", error);

        const errorResponse = errorMessage(null, 500);
        cb({ ok: false, error: errorResponse.message });
      }
    });

    socket.on("sendMessage", async (data, cb) => {
      try {
        const { content, roomId } = data;
        console.log(`Message received: ${content} in room ${roomId}`);

        await chatStore.createMessage(userId, content, roomId);
        const message = {content : content, roomId : roomId, userId : userId};
        console.log("New message saved:", message);

        io.to(roomId).emit("message", message);

        cb({ ok: true });
      } catch (error) {
        console.error("Error in sendMessage:", error);
        const errorResponse = errorMessage(null, 500);
        cb({ ok: false, error: errorResponse.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  
  });
};