// features/user/routes/userRoutes.js

import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordResetRequest,
  validateResetPassword,
  validateUpdateUserProfile,
} from "../middleware/validation";

const userRouter = express.Router();

// Authentication routes
userRouter.post(
  "/register",
  validateUserRegistration,
  authController.registerUser
);
userRouter.post("/login", validateUserLogin, authController.loginUser);
userRouter.post("/refresh-token", authController.refreshTokenEndpoint); // New endpoint for refreshing JWT token
userRouter.post("/logout", authController.logoutUser); // New endpoint for logging out the user and invalidating the refresh token
userRouter.post(
  "/password-reset",
  validatePasswordResetRequest,
  authController.resetPasswordRequest
);
userRouter.post(
  "/reset/:token",
  validateResetPassword,
  authController.resetPassword
);
userRouter.get("/verify-email/:token", authController.verifyEmail); // No validation needed as it just uses a token

// User specific routes
userRouter.put(
  "/profile",
  validateUpdateUserProfile,
  userController.updateUserProfile
);
userRouter.get("/users/near", userController.getUsersNearLocation); // Depending on the specifics, you might want to validate query parameters as well

export default userRouter;
