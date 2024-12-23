const io = require("socket.io-client");
const socket1 = io(`` , {auth : {token : ""}});

socket1.on("connect", () => {
  console.log("Connected to server with id:", socket1.id);
});
socket1.emit("joinRoom", { roomId: 11 }, (response) => {
  console.log("Join room response:", response);
});

socket1.emit("sendMessage", { content: "다른 소켓 안녕안녕!", roomId: 11}, (response) => {
  console.log("Send message response:", response);
});


socket1.on("message", (response)=>{
  console.log(response);
})

