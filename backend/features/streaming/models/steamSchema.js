import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isFree: { type: Boolean, default: true },
  price: { type: Number, default: 0 }, // Fixed price for the stream, if applicable
  costPerMinute: { type: Number, default: 0 }, // Cost per minute, if applicable
  fee: { type: Number, default: 0 }, // set default as 0 for free streams
  feeType: {
    type: String,
    enum: ["one-time", "per-minute"],
    default: "one-time",
  }, // fee type can be one-time or charged per minute
  // ... other fields like streamId, description, etc.
});

export default mongoose.model("Stream", streamSchema);
