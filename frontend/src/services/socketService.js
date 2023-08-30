// src/services/socketService.js

import io from "socket.io-client";
import { SOCKET_SERVER_URL } from "../config/socketConfig";

export const socket = io(SOCKET_SERVER_URL);

export const initializeSocket = (onReceiveInstruction) => {
  socket.on("receive-instruction", onReceiveInstruction);
};

export const sendInstruction = (instruction, userId) => {
  socket.emit("send-instruction", { instruction, userId });
};
