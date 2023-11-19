//backend/src/middleware/errorMiddleware.js

// Handle not found routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.errorType = "ClientError"; // Custom field
  res.status(404);
  next(error);
};
