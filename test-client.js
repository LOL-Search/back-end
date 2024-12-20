const io = require("socket.io-client");
const socket = io("http://localhost:9999");

socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);

  socket.emit("joinRoom", { roomId: 11 }, (response) => {
    console.log("Join room response:", response);
  });

  socket.emit("sendMessage", { content: "테스트입니다!", user: 1, roomId: 11 }, (response) => {
    console.log("Send message response:", response);
  });
});

socket.on("message", (data) => {
  console.log("Received message:", data);
});