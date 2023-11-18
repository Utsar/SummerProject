// backend>src>features/user/controllers/userController.js
import Joi from "@hapi/joi";
import User from "../models/userSchema";
import AppError from "../../../../utils/AppError";

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
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -emailVerificationToken -passwordResetToken -passwordResetExpires"
    );
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.json(user);
  } catch (error) {
    next(new AppError("Failed to retrieve user profile", 500));
  }
};

// Update the user's profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { error } = validateUserUpdates(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Loop through and update fields
    for (const [key, value] of Object.entries(req.body)) {
      user[key] = value;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    next(new AppError("Failed to update user profile", 500));
  }
};

// Delete the user's profile
export const deleteUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(new AppError("Failed to delete user profile", 500));
  }
};

// Fetch users near a given location with pagination
export const getUsersNearLocation = async (req, res, next) => {
  try {
    const { longitude, latitude, page = 1, limit = 10 } = req.query;

    // Page number and limit
    const skip = (page - 1) * limit;

    // Validate longitude and latitude
    if (!longitude || !latitude) {
      return next(new AppError("Longitude and latitude are required", 400));
    }

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
    })
      .skip(skip)
      .limit(parseInt(limit));

    // Count total number of nearby users
    const totalNearbyUsers = await User.countDocuments({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // 5 km radius
        },
      },
    });

    res.json({
      nearbyUsers,
      totalPages: Math.ceil(totalNearbyUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    next(new AppError("Failed to retrieve nearby users", 500));
  }
};

// Add other user-related controllers as needed...
