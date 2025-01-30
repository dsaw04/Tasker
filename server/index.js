import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoute from "./routes/taskRoutes.js";
import userRoute from "./routes/userRoutes.js";
import userMetricRoute from "./routes/userMetricRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectRabbitMQ } from "./utils/rabbitmq.js";
import { startEmailConsumer } from "./queues/emailConsumer.js";
import { scheduleCleanupJob } from "./cronJobs/cleanupJobs.js";
import { scheduleDailyTaskEmail } from "./cronJobs/dailyTaskEmail.js";
import { connectRedis } from "./config/redisClient.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Environment Variables
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

// Database Connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Database connected successfully!");
    await connectRabbitMQ();
    await connectRedis();
    startEmailConsumer();
    scheduleDailyTaskEmail();
    scheduleCleanupJob();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

// Routes
app.use("/api", taskRoute);
app.use("/api/users", userRoute);
app.use("/api/metrics", userMetricRoute);
