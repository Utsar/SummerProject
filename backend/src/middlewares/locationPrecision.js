//backend/src/middleware/locationPrecision.js
import logger from "../utils/logger"; // Import the logger

// Define the enum within the same file
const PrecisionTypes = {
  EXACT: "exact",
  CITY: "city",
  STATE: "state",
};

export const adjustLocationPrecision = (req, res, next) => {
  const { latitude, longitude, precision } = req.body;

  // Validate if latitude and longitude actually exist
  if (latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude must be provided" });
  }

  // Validate if latitude and longitude are numbers
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res
      .status(400)
      .json({ error: "Latitude and longitude must be numbers" });
  }

  let adjustedLat = latitude;
  let adjustedLong = longitude;

  // Enumeration for precision types
  switch (precision) {
    case PrecisionTypes.EXACT:
      // No change, use provided coordinates
      break;
    case PrecisionTypes.CITY:
      adjustedLat = parseFloat(latitude.toFixed(2));
      adjustedLong = parseFloat(longitude.toFixed(2));
      break;
    case PrecisionTypes.STATE:
      adjustedLat = parseFloat(latitude.toFixed(1));
      adjustedLong = parseFloat(longitude.toFixed(1));
      break;
    default:
      return res.status(400).json({ error: "Invalid precision type" });
  }

  // Logging
  logger.info(
    `Adjusted coordinates: Latitude - ${adjustedLat}, Longitude - ${adjustedLong}`
  );

  // Update request body with adjusted values
  req.body.latitude = adjustedLat;
  req.body.longitude = adjustedLong;

  next();
};
