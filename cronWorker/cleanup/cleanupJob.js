import mongoose from "mongoose";
import dotenv from "dotenv";
import { deleteGuestUsersAndTasks } from "../utils/cleanupService.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await mongoose.connection.asPromise();
  } catch (error) {
    console.error("MongoDB connection error (cronWorker):", error);
    process.exit(1);
  }
};

const startCleanup = async () => {
  try {
    await connectMongoDB();
    await deleteGuestUsersAndTasks();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error starting cleanup:", error);
    process.exit(1);
  }
};

startCleanup();
