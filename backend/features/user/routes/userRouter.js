// Required Modules
import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userSchema";
import nodemailer from "nodemailer";

// Initialize Express Router
const userRouter = express.Router();

// User Registration Route
userRouter.post("/register", async (req, res) => {
  try {
    const { username, password, email, profilePicture } = req.body;

    // Check if username or email is already taken
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already in use" });
    }
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Create a new user instance
    const user = new User({ username, password, email, profilePicture });

    // Generate a unique email verification token
    user.emailVerificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to database
    await user.save();

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      // TODO: Add your email transport configuration here
    });

    // Email content
    const mailOptions = {
      to: user.email,
      from: "no-reply@yourapp.com",
      subject: "Email Verification",
      text: `Please verify your email by clicking on the following link, or by copying and pasting it into your browser:\n\nhttp://your-app-url.com/verify-email/${user.emailVerificationToken}\n\n`,
    };

    // Send the verification email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User created successfully. Verification email sent.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User Login Route
userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user in the database
    const user = await User.findOne({ username });

    // If user not found or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Successful login response
    res.json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Password Reset Request Route
userRouter.post("/password-reset", async (req, res) => {
  try {
    const { email } = req.body;

    // Check for user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "No account with that email address exists" });
    }

    // Generate a unique password reset token and set its expiration
    user.passwordResetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour

    await user.save();

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      // TODO: Add your email transport configuration here
    });

    // Email content for password reset
    const mailOptions = {
      to: user.email,
      from: "password-reset@yourapp.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\nhttp://your-app-url.com/reset/${user.passwordResetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // Send the password reset email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset token sent to email" });
  } catch (error) {
    res.status(500).json({ error: "Error on password reset" });
  }
});

// Password Reset Token Verification and Update Route
userRouter.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Check for user with the provided reset token and if token is not expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    // Update the user's password and clear reset token and expiration
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ error: "Error on password reset" });
  }
});

// Email Verification Route
userRouter.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Check for user with the provided email verification token
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Email verification token is invalid" });
    }

    // Mark the user's email as verified and clear the verification token
    user.emailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    res.json({ message: "Email verified" });
  } catch (error) {
    res.status(500).json({ error: "Error on email verification" });
  }
});

// User Profile Update Route
userRouter.put("/profile", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "profilePicture"];

    // Check if provided updates are allowed
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    // Apply the updates to the user
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Fetch Users Near a Location Route
userRouter.get("/users/near", async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    // Use MongoDB's geospatial querying to fetch users near the provided location
    const nearbyUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // 5 km radius
        },
      },
    }).limit(50); // Limit to 50 users for performance

    res.json(nearbyUsers);
  } catch (err) {
    res.status(400).json({ error: "Failed to get nearby users" });
  }
});

export default userRouter;
