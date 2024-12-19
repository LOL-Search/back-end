const chatController = require("../controllers/chatController");
const errorMessage = require("../utils/errorMessage");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Client is connected", socket.id);

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

    socket.on("sendMessage", async (data, cb) => {
      try {
        const { content, user, roomId } = data;
        console.log(`Message received: ${content} in room ${roomId}`);

        const newMessage = await chatController.saveChat(content, user, roomId);
        console.log("New message saved:", newMessage);

        io.to(roomId).emit("message", newMessage);

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