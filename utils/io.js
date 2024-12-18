const userController = require("../controller/userController");
const chatController = require("../controller/chatController");
const db = require("../config/db");
console.log("DB object:", db);

module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log("Client is connected", socket.id);

        socket.on("login", async (nickname, cb) => {
            try {
                const user = await userController.saveUser(nickname, socket.id);
                const welcomeMessage = {
                    chat: `${user.nickname} has joined the room`,
                    user: {
                         id: null, nickname: user.nickname },
                };
                io.emit("message", welcomeMessage);

                cb({ ok: true, data: user });
            } catch (error) {
                console.error("Login failed with error:", error); 
                cb({ ok: false, error: error.message });
            }
        });

        socket.on("joinRoom", async (data, cb) => {
            const { roomId } = data;
            console.log(`User ${socket.id} is joining room: ${roomId}`);
        
            try {
                // 방이 존재하는지 확인
                const [room] = await db.query("SELECT * FROM chating_rooms WHERE id = ?", [roomId]);
        
                if (room.length === 0) {
                    // 방이 없으면 방을 생성
                    await db.query("INSERT INTO chating_rooms (id) VALUES (?)", [roomId]);
                    console.log(`Room ${roomId} created.`);
                }
        
                socket.join(roomId);
                console.log(`User ${socket.id} has joined room ${roomId}`);
                cb();
                io.to(roomId).emit("message", { chat: `User ${socket.id} has joined the room`, roomId });
            } catch (error) {
                console.error("Error joining room:", error);
                cb({ ok: false, error: error.message });
            }
        });

        socket.on("sendMessage", async (data, cb) => {
            try {
                const { content, roomId } = data;
                console.log("Received message content:", content);  // 메시지 내용 확인
                
                // 방이 존재하는지 확인
                const [room] = await db.query("SELECT * FROM chating_rooms WHERE id = ?", [roomId]);
                if (room.length === 0) {
                    throw new Error(`Room with ID ${roomId} does not exist.`);
                }

                const user = await userController.checkUser(socket.id);
                console.log("User found:", user);

                const newMessage = await chatController.saveChat(content, user, roomId);
                console.log("New message saved:", newMessage); // 새로 저장된 메시지 확인
                io.to(roomId).emit("message", newMessage);
                console.log("Message broadcasted to room:", roomId);

                cb({ ok: true });
            } catch (error) {
                console.error("Error in sendMessage:", error);  // 오류 처리 로그
                cb({ ok: false, error: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};
