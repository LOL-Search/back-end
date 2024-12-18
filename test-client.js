const { io } = require("socket.io-client");

const socket = io("http://localhost:9999");

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    // 로그인 이벤트
    socket.emit("login", "TestUser", (response) => {
        console.log("Login response:", response);

        // 로그인 성공 시, 채팅방에 참여
        if (response.ok) {
            const roomId = 1; // 채팅방 ID 지정
            socket.emit("joinRoom", { roomId }, () => {
                console.log(`Joined room: ${roomId}`);

                // 채팅방 참여 후 메시지 보내기
                console.log("Sending message to server...");
                socket.emit("sendMessage", { content: "Hello, Room!", roomId }, (sendResponse) => {
                    console.log("Send message response:", sendResponse);
                });
            });
        } else {
            console.error("Login failed:", response.error);
        }
    });

    socket.on("message", (message) => {
        console.log("New message:", message);
    });
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});