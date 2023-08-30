import Stream from "../features/streaming/models/streamSchema";
import User from "../features/user/models/userSchema";
import mongoose from "mongoose";

/**
 * Middleware to check if the user has sufficient balance to join a stream and reserve funds if necessary.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkUserBalance = async (req, res, next) => {
  // Set HTTP header for content type
  res.setHeader("Content-Type", "application/json");

  const session = await mongoose.startSession(); // Start a new session for the transaction
  session.startTransaction();

  try {
    // Extract the stream ID from the request parameters
    const streamId = req.params.id;

    // Find the stream by its ID
    const stream = await Stream.findById(streamId);
    if (!stream) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(404).json({ error: "Stream not found" });
    }

    // Find the user from the request
    const user = await User.findById(req.user._id).session(session); // Attach session
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user's balance is less than the stream's fee
    if (user.balance < stream.fee) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "Insufficient funds to join this stream" });
    }

    // If the stream has a one-time fee, reserve the funds
    if (stream.feeType === "one-time") {
      reserveFundsForStream(user, stream.fee);
    }

    await session.commitTransaction(); // Commit the transaction
    session.endSession();

    next(); // Move to the next middleware or route handler
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction in case of error
    session.endSession();
    res
      .status(500)
      .json({ error: `Error checking user balance: ${error.message}` });
  }
};

/**
 * Reserves funds for a one-time fee stream.
 * @param {Object} user - The user whose funds are to be reserved.
 * @param {Number} fee - The fee amount to be reserved.
 * @returns {Object} The updated user document.
 * @throws {Error} Throws an error if funds are insufficient or user update fails.
 */
const reserveFundsForStream = async (user, fee) => {
  // Preliminary check to see if the user's balance is sufficient
  if (user.balance < fee) {
    throw new Error("Insufficient funds"); // You can throw an error or handle this condition differently
  }

  // Atomic operation to update the user's balance and reservedFunds
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $inc: {
        balance: -fee,
        reservedFunds: fee,
      },
    },
    { new: true } // This option ensures that the updated document is returned
  );

  if (!updatedUser) {
    throw new Error("User update failed"); // Throw an error if the update failed
  }

  return updatedUser; // Return the updated user document
};

export default checkUserBalance;
