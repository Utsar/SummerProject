// backend>src/features/location/controllers/locationController.js

import Location from "../models/locationSchema";
import User from "../../user/models/userSchema";
import { adjustLocationPrecision } from "../utils/adjustPrecision"; // Import the utility function

// Default values for pagination
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export const createLocation = async (req, res) => {
  try {
    const { userId, coordinates } = req.body;

    // Create a new location instance and save it to the database
    const location = new Location({ user: userId, coordinates });
    await location.save();

    // Respond with the saved location data
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: "Failed to create location" });
  }
};

export const getNearbyStreamingUsers = async (req, res) => {
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
    res.status(400).json({ error: "Failed to get nearby streaming users" });
  }
};

export const updateLocationWithPrecision = async (req, res) => {
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
    res.status(500).json({ error: "Failed to update location" });
  }
};
