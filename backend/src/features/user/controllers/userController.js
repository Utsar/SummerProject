// features/user/controllers/userController.js
import Joi from "@hapi/joi";
import User from "../models/userSchema";
import { customErrorHandler } from "../../../middlewares/customErrorHandler"; // Assuming you have a custom error handler

// Validate User Updates
const validateUserUpdates = (updates) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    profilePicture: Joi.string().uri(),
  });
  return schema.validate(updates);
};

// Fetch a user's profile by their ID
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -emailVerificationToken -passwordResetToken -passwordResetExpires"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    customErrorHandler(error, req, res); // Log and handle errors
  }
};

// Update the user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const { error } = validateUserUpdates(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Loop through and update fields
    for (const [key, value] of Object.entries(req.body)) {
      user[key] = value;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    customErrorHandler(error, req, res); // Log and handle errors
  }
};

// Delete the user's profile
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user profile" });
  }
};

// Fetch users near a given location
export const getUsersNearLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

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
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve nearby users" });
  }
};

// Add other user-related controllers as needed...
