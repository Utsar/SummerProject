//backend>server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import morgan from "morgan"; // Added for logging
import { Server } from "socket.io";

import connectDB from "./config/database";
import initializeSocket from "./src/config/socketIO"; // Separate file for Socket.io logic

import locationRouter from "./features/location/routes/location";
import liveStreamRouter from "./features/streaming/routes/liveStream";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware"; // NEED ATTENTION
import errorHandlingMiddleware from "./src/middlewares/errorHandlingMiddleware";

// Load environment variables and check for required ones
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI must be set");
  process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Middleware Configuration
app.use(cors());
app.use(express.json());
app.use(morgan("tiny")); // Added for logging

// Connect to MongoDB
connectDB();

// Route Configuration
app.use("/stream", liveStreamRouter);
app.use("/location", locationRouter);

// 404 and Error Handling Middleware
app.use(notFound);
app.use(errorHandler); // NEED ATTENTION
app.use(errorHandlingMiddleware);

// Initialize Socket.io
initializeSocket(io); // Moved to a separate file

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

export default app;
