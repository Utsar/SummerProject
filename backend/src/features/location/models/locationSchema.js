// features/location/models/locationSchema.js

import mongoose from "mongoose";

// Define a schema to store user locations
const locationSchema = new mongoose.Schema({
  // Reference to the user associated with this location
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // GeoJSON format to store coordinates
  coordinates: {
    type: {
      type: String,
      default: "Point", // Default to "Point" as it represents a single location
    },
    coordinates: {
      type: [Number], // An array to store longitude and latitude
      required: true,
    },
  },
  // Automatically capture the date when the location is created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a geospatial index for efficient location-based queries
locationSchema.index({ coordinates: "2dsphere" });

// Export the mongoose model
export default mongoose.model("Location", locationSchema);
