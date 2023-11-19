// middlewares/errorHandlingMiddleware.js
import logger from "../utils/logger";

const errorHandlingMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log the error
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack, // Optional: Include stack trace for debugging
  });

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandlingMiddleware;
