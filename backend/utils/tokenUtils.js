//backend/src/utils/tokenutils.js
import jwt from "jsonwebtoken";

export const generateJwtToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = () => {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
