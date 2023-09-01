//backend/src/middleware/errorMiddleware.js
import logger from "../utils/logger"; // Import the logger

// Handle not found routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.errorType = "ClientError"; // Custom field
  res.status(404);
  next(error);
};

// Handle all other errors (be it 404 or any other)
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Log the error using Winston
  logger.error(
    `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Handle specific error types (e.g., validation errors)
  if (err.name === "ValidationError") {
    err.message = "Validation failed";
  }

  res.json({
    message: err.message,
    errorType: err.errorType || "ServerError", // Custom field
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
