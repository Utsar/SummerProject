import express from "express";
import Location from "../models/locationSchema";

// Initialize the router for location-related routes
const locationRouter = express.Router();

// Route to create a new location for a user
locationRouter.post("/", async (req, res) => {
  try {
    const { userId, coordinates } = req.body;

    // Create a new location instance and save it to the database
    const location = new Location({ user: userId, coordinates });
    await location.save();

    // Respond with the saved location data
    res.status(201).json(location);
  } catch (err) {
    // If an error occurs, send an error response
    res.status(400).json({ error: "Failed to create location" });
  }
});

// Get locations of nearby streaming users
locationRouter.get("/users/near/streaming", async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

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
      isStreaming: true, // only fetch users who are currently streaming
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // users who updated their location within the last 24 hours
    }).limit(50); // Limit to 50 users for performance reasons

    res.json(nearbyStreamingUsers);
  } catch (err) {
    res.status(400).json({ error: "Failed to get nearby streaming users" });
  }
});

// Update user's location with controlled precision
locationRouter.put("/location", auth, async (req, res) => {
  try {
    const { latitude, longitude, precision } = req.body;

    let adjustedLat = latitude;
    let adjustedLong = longitude;

    // Adjust precision based on user input
    switch (precision) {
      case "exact":
        // No change, use provided coordinates
        break;
      case "city":
        adjustedLat = parseFloat(latitude.toFixed(2));
        adjustedLong = parseFloat(longitude.toFixed(2));
        break;
      case "state":
        adjustedLat = parseFloat(latitude.toFixed(1));
        adjustedLong = parseFloat(longitude.toFixed(1));
        break;
      default:
        return res.status(400).json({ error: "Invalid precision type" });
    }

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
});

// Export the locationRouter for use in the main app
export default locationRouter;
