import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the user schema for MongoDB
const userSchema = new mongoose.Schema({
  // Basic user information
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: "" },

  // Email verification details
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,

  // Password reset details
  passwordResetToken: String,
  passwordResetExpires: Date,

  // Geospatial data for user location
  location: {
    type: {
      type: String,
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  isStreaming: { type: Boolean, default: false }, // New field to track streaming status
  createdAt: { type: Date, default: Date.now },
  //Balance field for user
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
});

// Add geospatial index for efficient location-based queries
userSchema.index({ location: "2dsphere" });

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  // Check if password was modified
  if (user.isModified("password")) {
    // Hash the password using bcrypt with a salt of 10 rounds
    user.password = await bcrypt.hash(user.password, 10);
  }

  // Continue to save the model instance
  next();
});

// Export the User model
export default mongoose.model("User", userSchema);
