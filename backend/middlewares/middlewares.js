import jwt from "jsonwebtoken";
import User from "./models/userSchema";

// Authentication Middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

// Authorization Middleware
export const authorize = (role) => {
  return (req, res, next) => {
    const user = req.user;

    if (user.role !== role) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};

// Check User's Balance Middleware
export const checkBalance = async (req, res, next) => {
  try {
    const streamId = req.params.id;
    const stream = await Stream.findById(streamId); // Assuming Stream model is imported
    const user = req.user;

    if (stream.fee > 0 && user.balance < stream.fee) {
      return res
        .status(400)
        .json({ error: "Insufficient funds to join this stream" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Error checking user balance" });
  }
};

// Rate Limiting Middleware (simplified example)
let requestCounter = {};
const RATE_LIMIT_COUNT = 100;
const RATE_LIMIT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;

  if (!requestCounter[ip]) {
    requestCounter[ip] = { count: 1, timestamp: Date.now() };
  } else if (Date.now() - requestCounter[ip].timestamp < RATE_LIMIT_TIME) {
    if (requestCounter[ip].count < RATE_LIMIT_COUNT) {
      requestCounter[ip].count++;
    } else {
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }
  } else {
    requestCounter[ip] = { count: 1, timestamp: Date.now() };
  }

  next();
};

// Add more middlewares as needed...
