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

    // User association. Assuming you have authentication middleware that sets req.user
    const userId = req.user._id;

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
    // Further logic for joining a stream can go here.
    // For example, decrementing the user's balance or adding the user to the stream's list of viewers.

    console.log(`User ${req.user._id} joined stream ${req.params.streamId}`); // Logging

    res.status(200).json({ message: "Successfully joined the stream" });
  } catch (error) {
    console.error("Failed to join the stream:", error); // Logging
    res.status(500).json({ error: "Failed to join the stream" });
  }
};

// TODO: You can add more controller functions as required.
