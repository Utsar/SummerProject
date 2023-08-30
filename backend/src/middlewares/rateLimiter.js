// backend>src>middlewares>rateLimiter.js

import client from "../config/redisClient";
import logger from "../utils/logger"; // Assuming you have a logger setup

const RATE_LIMIT_COUNT = 100;
const RATE_LIMIT_TIME = 60 * 60; // 1 hour in seconds

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;

  // Use Redis to keep track of request counts
  client.get(ip, (err, record) => {
    if (err) throw err;

    if (record === null) {
      // No record in Redis for this IP
      client.set(ip, 1);
      client.expire(ip, RATE_LIMIT_TIME);
    } else if (record < RATE_LIMIT_COUNT) {
      client.incr(ip);
    } else {
      // Log the rate-limited IP
      logger.warn(`Rate limit reached for IP: ${ip}`);

      // Set Headers
      res.setHeader("X-RateLimit-Limit", RATE_LIMIT_COUNT);
      res.setHeader("X-RateLimit-Remaining", 0);
      res.setHeader("X-RateLimit-Reset", client.ttl(ip));

      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }

    // If everything is fine, move to next middleware
    next();
  });
};
