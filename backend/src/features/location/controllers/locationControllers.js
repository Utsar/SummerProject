// backend>src/features/location/controllers/locationController.js

import Location from "../models/locationSchema";
import User from "../../user/models/userSchema";
import { adjustLocationPrecision } from "../utils/adjustPrecision"; // Import the utility function
import AppError from "../../../../utils/AppError";

// Default values for pagination
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export const createLocation = async (req, res, next) => {
  try {
    const { userId, coordinates } = req.body;

    // Create a new location instance and save it to the database
    const location = new Location({ user: userId, coordinates });
    await location.save();

    // Respond with the saved location data
    res.status(201).json(location);
  } catch (err) {
    next(new AppError("Failed to create location", 400));
  }
};

export const getNearbyStreamingUsers = async (req, res, next) => {
  try {
    const {
      longitude,
      latitude,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
    } = req.query;

    const skipValue = (page - 1) * limit;

    // Fetch users within a certain radius (e.g., 5 km) who are actively streaming
    const nearbyStreamingUsers = await User.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // 5 km
        },
      },
      isStreaming: true,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .limit(parseInt(limit))
      .skip(skipValue);

    const totalNearbyStreamingUsers = await User.countDocuments({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // 5 km
        },
      },
      isStreaming: true,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    res.json({
      users: nearbyStreamingUsers,
      totalPages: Math.ceil(totalNearbyStreamingUsers / limit),
      currentPage: page,
    });
  } catch (err) {
    next(new AppError("Failed to get nearby streaming users", 400));
  }
};

export const updateLocationWithPrecision = async (req, res, next) => {
  try {
    const { latitude, longitude, precision } = req.body;

    // Use the utility function to adjust precision
    const [adjustedLat, adjustedLong] = adjustLocationPrecision(
      latitude,
      longitude,
      precision
    );

    const user = req.user;

    user.location = {
      type: "Point",
      coordinates: [adjustedLong, adjustedLat],
    };

    await user.save();

    res.json({ message: "Location updated with desired precision" });
  } catch (error) {
    next(new AppError("Failed to update location", 500));
  }
};
