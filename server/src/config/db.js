import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI not found. Running with in-memory fallback data.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.warn("MongoDB connection failed. Running with in-memory fallback data.");
    console.warn(error.message);
  }
};

export default connectDB;
