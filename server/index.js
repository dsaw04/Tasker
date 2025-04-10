import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoute from "./routes/taskRoutes.js";
import userRoute from "./routes/userRoutes.js";
import userMetricRoute from "./routes/userMetricRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectRedis } from "./config/redisClient.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Environment Variables
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGO_URL, {
      maxPoolSize: 20,
    });
  } catch (error) {
    console.error("MongoDB connection error (server):", error);
    process.exit(1);
  }
};

// Database Connection
await connectMongoDB()
  .then(async () => {
    await connectRedis();
    app.listen(PORT);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

// Routes
app.use("/api", taskRoute);
app.use("/api/users", userRoute);
app.use("/api/metrics", userMetricRoute);
