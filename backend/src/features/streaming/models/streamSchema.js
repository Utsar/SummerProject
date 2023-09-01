// backend/src/features/stream/models/streamSchema.js
import mongoose from "mongoose";

// Define the stream schema for MongoDB.
// This schema will represent individual live streams in the system.
const streamSchema = new mongoose.Schema({
  // Reference to the user associated with this stream.
  // This provides a link between the stream and the user who is hosting it.
  user: {
    type: mongoose.Schema.Types.ObjectId, // Uses MongoDB's ObjectId type to reference the User model.
    ref: "User", // This tells Mongoose which model to use during population.
    required: true, // This stream must always be associated with a user.
    index: true, // <-- Adding index
  },

  // The name of the stream.
  name: {
    type: String,
    required: true,
  },

  // A brief description of the stream.
  description: {
    type: String,
    required: true,
  },

  // A flag to determine if the stream is free to watch.
  isFree: {
    type: Boolean,
    default: true, // By default, the stream is free to watch.
  },

  // The fixed price for the stream (only applicable if it's not free).
  price: {
    type: Number,
    default: 0,
    validate: {
      // <-- Adding validation
      validator: Number.isFinite,
      message: "{VALUE} is not a valid price!",
    },
    min: [0, "Price must be a positive number"], // <-- Ensuring non-negative
  },

  // Cost per minute for the stream (applicable for streams with a per-minute charging model).
  costPerMinute: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isFinite,
      message: "{VALUE} is not a valid cost per minute!",
    },
    min: [0, "Cost per minute must be a positive number"], // <-- Ensuring non-negative
  },

  // The fee associated with the stream.
  // If it's a free stream, the fee will be 0.
  fee: {
    type: Number,
    default: 0,
  },

  // The type of fee for the stream.
  // Can be "one-time" (fixed fee) or "per-minute" (charged based on watch time).
  feeType: {
    type: String,
    enum: ["one-time", "per-minute"], // Only these two values are allowed for the feeType field.
    default: "one-time",
  },
  status: {
    // <-- Adding status field
    type: String,
    enum: ["active", "inactive", "completed"],
    default: "inactive",
  },

  // Other relevant fields for the stream can be added as the application evolves.
  // For instance, fields like 'streamUrl', 'viewers', 'tags', etc., can be incorporated in future iterations.
});

// Export the mongoose model based on the stream schema.
// This exported model can then be used elsewhere in the application to interact with the 'streams' collection in MongoDB.
export default mongoose.model("Stream", streamSchema);
