//backend>src>middlewares>auth.js

import jwt from "jsonwebtoken";
import User from "../features/user/models/userSchema";

// Role Enumeration
const Roles = {
  ADMIN: "admin",
  USER: "user",
  // Add more roles as needed
};

export const authenticate = async (req, res, next) => {
  try {
    // Set HTTP header for content type
    res.setHeader("Content-Type", "application/json");

    // Get and verify the token
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and ensure the token is not revoked
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    // Attach user and token to request object
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    // Enhanced error message
    res
      .status(401)
      .send({
        error:
          error.message ||
          "Authentication failed. Please check your credentials.",
      });
  }
};

export const authorize = (role) => {
  return (req, res, next) => {
    const user = req.user;

    // Use role enumeration
    if (user.role !== Roles[role.toUpperCase()]) {
      res
        .status(403)
        .json({ error: "Access Denied: Insufficient permissions." });
      return;
    }
    next();
  };
};
