// backend>src>features/user/models/userSchema.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator"; // Added for validation

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"], // Email validation
  },
  profilePicture: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshTokens: [String],
  location: {
    coordinates: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        validate: [coordsValidator, "{VALUE} are not valid coordinates"], // New validation
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  isStreaming: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: {
    // New field
    type: Date,
    default: Date.now,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
    min: 0, // No negative balance
  },
  reservedFunds: {
    type: Number,
    default: 0,
    min: 0, // No negative funds
  },
});
// Function to validate coordinates
function coordsValidator(coords) {
  if (Array.isArray(coords) && coords.length === 2) {
    return (
      coords[0] >= -180 &&
      coords[0] <= 180 &&
      coords[1] >= -90 &&
      coords[1] <= 90
    );
  }
  return false;
}
// 2dsphere index for location queries
userSchema.index({ location: "2dsphere" });
// Pre-save hook for hashing password
userSchema.pre("save", async function (next) {
  const user = this;
  // Update the updatedAt field
  user.updatedAt = Date.now();

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

export default mongoose.model("User", userSchema);
