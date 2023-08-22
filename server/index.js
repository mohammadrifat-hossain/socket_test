const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);
  
  socket.on("join_room", (data)=>{
    socket.join(data)
  })

  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("receive_message", data.message);
    socket.emit('my_message', data.message)
  });
});

server.listen(3001, () => {
  console.log("server is running");
});
