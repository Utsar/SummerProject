// backend/src/config/socketIO.js
import { Server } from "socket.io";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer); // Initialize here
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send-instruction", (data) => {
      socket.broadcast.emit("receive-instruction", data);
    });
  });
};

export default initializeSocket;
