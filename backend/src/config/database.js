// backend>src>config>database.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoReconnect: true,
      reconnectInterval: 5000,
    };

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected...");
    });

    mongoose.connection.on("error", (error) => {
      console.error(`MongoDB connection error: ${error}`);
      mongoose.disconnect(); // Ensures that if an error occurs after a connection is established, the connection is closed.
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Reconnecting...");
      setTimeout(() => connectDB(), connectionOptions.reconnectInterval);
    });

    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
