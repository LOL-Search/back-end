const io = require("socket.io-client");
const socket1 = io(`${process.env.PORT}` , {extraHeaders : {token : ""}});
const socket2 = io(`${process.env.PORT}`, {extraHeaders :  {token : ""}});

socket1.on("connect", () => {
  console.log("Connected to server with id:", socket1.id);
});

socket1.on("message", (data) => {
  console.log("Received message:", data);
});

socket2.on("connect", () => {
  console.log("Connected to server with id:", socket2.id);

  socket2.emit("joinRoom", { roomId: 11 }, (response) => {
    console.log("Join room response:", response);
  });

  socket2.emit("sendMessage", { content: "다른 소켓 안녕안녕!", roomId: 11 }, (response) => {
    console.log("Send message response:", response);
  });
  socket2.emit("leaveRoom", {roomId : 11} , (response) => {
    console.log("Leaved room response", response);
  })
  socket1.emit("sendMessage", {content: "방을 나가고 난뒤!", roomId : 11}, (response)=>{
    console.log("Send message response:", response);
  })
  

});

socket2.on("message", (data) => {
  console.log("Received message:", data);
});

socket1.emit("joinRoom", { roomId: 11 }, (response) => {
  console.log("Join room response:", response);
});

socket1.emit("sendMessage", { content: "다른 소켓 안녕안녕!", roomId: 11}, (response) => {
  console.log("Send message response:", response);
});




