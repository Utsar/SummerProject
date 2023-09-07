import express from "express";
import Stream from "../models/streamSchema"; // Assuming this is the correct import for the stream model
import User from "../models/userSchema"; // Importing the User model for checking balance

const liveStreamRouter = express.Router();

// Middleware to Check User's Balance
const checkBalanceMiddleware = async (req, res, next) => {
  try {
    const streamId = req.params.id;
    const stream = await Stream.findById(streamId);
    const user = req.user;

    if (stream.fee > 0 && user.balance < stream.fee) {
      return res
        .status(400)
        .json({ error: "Insufficient funds to join this stream" });
    }

    if (stream.feeType === "one-time") {
      user.balance -= stream.fee;
      await user.save();
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Error checking user balance" });
  }
};

// Route to Create a Stream
liveStreamRouter.post("/create", async (req, res) => {
  try {
    const { name, fee, feeType } = req.body;

    const stream = new Stream({
      name: name,
      fee: fee || 0,
      feeType: feeType || "one-time",
    });

    await stream.save();

    res.status(201).json({ message: "Stream created successfully", stream });
  } catch (error) {
    res.status(500).json({ error: "Failed to create the stream" });
  }
});

// Route to Join a Stream (with Balance Checking)
liveStreamRouter.post("/join/:id", checkBalanceMiddleware, async (req, res) => {
  try {
    // Logic for user joining the stream
    // This could involve sending back a stream URL or other relevant details

    res.status(200).json({ message: "Successfully joined the stream" });
  } catch (error) {
    res.status(500).json({ error: "Failed to join the stream" });
  }
});

// ... Other routes can be added as needed ...

export default liveStreamRouter;
