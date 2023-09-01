// backend/src/features/stream/controllers/streamController.js

import Stream from "../models/streamSchema";
import User from "../../user/models/userSchema"; // Adjust this import based on your folder structure
import Joi from "joi";

// Joi schema for stream creation validation
const streamCreateSchema = Joi.object({
  name: Joi.string().required(),
  fee: Joi.number().min(0),
  feeType: Joi.string().valid("one-time", "per-minute"),
});

// Controller for creating a new stream
export const createStream = async (req, res) => {
  const { error } = streamCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { name, fee, feeType } = req.body;

    const userId = req.user._id; // Assuming authentication middleware sets req.user

    const stream = new Stream({
      user: userId,
      name,
      fee: fee || 0,
      feeType: feeType || "one-time",
    });

    await stream.save();

    console.log(`Stream created: ${stream._id} by user: ${userId}`); // Logging

    res.status(201).json({ message: "Stream created successfully", stream });
  } catch (error) {
    console.error("Failed to create the stream:", error); // Logging
    res.status(500).json({ error: "Failed to create the stream" });
  }
};

// Controller for joining a stream
export const joinStream = async (req, res) => {
  try {
    const userId = req.user._id;
    const streamId = req.params.streamId;

    // Fetch the user and the stream to join
    const user = await User.findById(userId);
    const stream = await Stream.findById(streamId);

    // Check if the stream exists
    if (!stream) {
      return res.status(404).json({ error: "Stream not found" });
    }

    // Check if the user has sufficient balance to join the stream
    if (stream.fee > 0 && user.balance < stream.fee) {
      return res
        .status(400)
        .json({ error: "Insufficient balance to join the stream" });
    }

    // Deduct the fee from the user's balance only if there is a fee
    if (stream.fee > 0) {
      user.balance -= stream.fee;
      await user.save();
    }

    // TODO: Add the user to the stream's participants list
    // stream.participants.push(userId);
    // await stream.save();

    res.status(200).json({ message: "Successfully joined the stream" });
  } catch (error) {
    console.error("Failed to join the stream:", error); // Logging
    res.status(500).json({ error: "Failed to join the stream" });
  }
};

// TODO: You can add more controller functions as required.
