//backend>server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import morgan from "morgan"; // Added for logging
import { rateLimiter } from "./src/middlewares/rateLimiter";
import { Server } from "socket.io";

import connectDB from "./config/database";
import initializeSocket from "./src/config/socketIO"; // Separate file for Socket.io logic

import { notFound } from "./src/middlewares/errorMiddleware";
import errorHandlingMiddleware from "./src/middlewares/errorHandlingMiddleware";

//Routes
import userRouter from "./src/features/user/routes/userRoutes";
import locationRouter from "./src/features/location/routes/locationRoutes";
import streamingRouter from "./src/features/streaming/routes/streamingRoutes";

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
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(
  morgan("tiny", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
); // Added for logging

// Connect to MongoDB
connectDB();

// Route Configuration
app.use("/stream", streamingRouter);
app.use("/location", locationRouter);
app.use("/user", userRouter);

// Catch 404 and forward to error handler
app.use(notFound);
// Error handling
app.use(errorHandlingMiddleware);

// Initialize Socket.io
initializeSocket(io); // Moved to a separate file

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

export default app;
