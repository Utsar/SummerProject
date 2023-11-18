// backend/src/features/user/controllers/authController.js

import User from "../models/userSchema"; // Importing the User model
import bcrypt from "bcrypt"; // For hashing the password
import jwt from "jsonwebtoken"; // To generate JWT tokens
import crypto from "crypto"; // For generating random tokens
import nodemailer from "nodemailer"; // To send emails
import { OAuth2Client } from "google-auth-library"; // For OAuth2 in nodemailer
import AppError from "../../../../utils/AppError";

// Utility function to generate a JWT token
const generateJwtToken = (payload, expiry) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
};

// Utility function to generate a JWT refresh token
const generateRefreshToken = () => {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Utility function to send email using OAuth2
const sendEmail = async (to, from, subject, text) => {
  const oauth2Client = new OAuth2Client(
    process.env.OAUTH2_CLIENT_ID,
    process.env.OAUTH2_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH2_REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: from,
      clientId: process.env.OAUTH2_CLIENT_ID,
      clientSecret: process.env.OAUTH2_CLIENT_SECRET,
      refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const mailOptions = { to, from, subject, text };
  await transporter.sendMail(mailOptions);
};

// Register a new user, send a verification email, and issue JWT and refresh tokens
export const registerUser = async (req, res, next) => {
  try {
    const { username, password, email, profilePicture } = req.body;

    // Validation here (can be further expanded)
    if (!username || !password || !email) {
      return next(new AppError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      next(new AppError("Username is already in use", 400));
    }
    if (existingEmail) {
      next(new AppError("Email is already in use", 400));
    }
    // Adding salt and hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      profilePicture,
    });
    user.emailVerificationToken = crypto.randomBytes(20).toString("hex");

    const refreshToken = generateRefreshToken();
    user.refreshTokens = [refreshToken];

    await user.save();

    await sendEmail(
      user.email,
      "no-reply@yourapp.com",
      "Email Verification",
      `Please verify your email by clicking on the following link: http://your-app-url.com/verify-email/${user.emailVerificationToken}`
    );

    res.status(201).json({
      message: "User created successfully. Verification email sent.",
      refreshToken,
    });
  } catch (error) {
    next(new AppError("Failed to register user", 500));
  }
};

// Authenticate a user, issue JWT and refresh tokens
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation here (can be further expanded)
    if (!username || !password) {
      return next(new AppError("Both fields are required", 400));
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(new AppError("Invalid Usernam or Password", 400));
    }

    const token = generateJwtToken({ _id: user._id.toString() }, "15m");

    const refreshToken = generateRefreshToken();
    user.refreshTokens = user.refreshTokens.concat(refreshToken);
    await user.save();

    res.json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token,
      refreshToken,
    });
  } catch (error) {
    next(new AppError("Failed to log in", 500));
  }
};

// Send a password reset token to the user's email
export const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res;
      return next(
        new AppError("No account with that email address exists", 400)
      );
    }

    user.passwordResetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // TODO: Set up your nodemailer transport configuration
    const transporter = nodemailer.createTransport({
      // Your transport configuration
    });

    const mailOptions = {
      to: user.email,
      from: "password-reset@yourapp.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\nhttp://your-app-url.com/reset/${user.passwordResetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset token sent to email" });
  } catch (error) {
    next(new AppError("Error on password reset request", 500));
  }
};

// Reset user's password using the provided token
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError("Password reset token is invalid or has expired", 400)
      );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (error) {
    next(new AppError("Error on password reset", 500));
  }
};

// Verify user's email using the provided token
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return next(new AppError("Email verification token is invalid", 400));
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    res.json({ message: "Email verified" });
  } catch (error) {
    next(new AppError("Error on email verification", 500));
  }
};

/**
 * Refresh an expired JWT token using a valid refresh token.
 */
export const refreshTokenEndpoint = async (req, res, next) => {
  const providedRefreshToken = req.body.token;

  if (!providedRefreshToken) {
    return next(new AppError("Refresh token is required", 403));
  }

  const user = await User.findOne({ refreshTokens: providedRefreshToken });

  if (!user) {
    return next(new AppError("Refresh token is not valid", 403));
  }

  jwt.verify(
    providedRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return next(new AppError("Invalid refresh token", 403));

      const newToken = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Short lifespan for the access token
      );

      res.json({
        token: newToken,
      });
    }
  );
};

/**
 * Logout a user and invalidate the provided refresh token.
 */

export const logoutUser = async (req, res, next) => {
  try {
    const providedRefreshToken = req.body.token;
    const user = req.user; // Assuming you have authentication middleware in place

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== providedRefreshToken
    );
    await user.save();

    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    next(new AppError("Failed to log out", 500));
  }
};
