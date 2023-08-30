import express from "express";

import * as streamController from "./controllers/streamController"; // Importing the streaming controller functions.
import checkUserBalance from "../../../middlewares/checkBalance";
import { authenticate } from "../../../middlewares/auth";
import { validateStream } from "../../../middlewares/validation"; // Assuming you have a validation middleware for streams

// Initialize the router for streaming-related routes.
const streamingRouter = express.Router();

// Route to create a new stream.
// The controller handles the logic of creating the stream.
// Added authenticate middleware for authentication
streamingRouter.post(
  "/", // Changed from "/create" to RESTful naming
  authenticate,
  validateStream, // Middleware for validating the request body
  streamController.createStream
);

// Route to join a stream.
// First, the middleware checks the user's balance.
// If the user has sufficient funds, the controller logic is executed.
streamingRouter.post(
  "/join/:id",
  authenticate,
  checkUserBalance,
  streamController.joinStream
);

// TODO: Add more routes as needed, e.g., fetching all streams, getting details of a specific stream, updating or deleting a stream, etc.

// Export the streamingRouter so it can be used in the main app.
export default streamingRouter;
