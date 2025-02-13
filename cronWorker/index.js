import mongoose from "mongoose";
import { scheduleDailyTaskEmail } from "./dailyTaskEmail.js";
import { scheduleCleanupJob } from "./cleanupJobs.js";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./rabbitmq.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const startCronWorker = async () => {
  try {
    await mongoose.connect(MONGO_URL)
    .then(async () => {
      console.log("Connected to MongoDB");
    });
    await connectRabbitMQ();
    console.log("Starting cron worker...");
    scheduleDailyTaskEmail();
    scheduleCleanupJob();
  } catch (error) {
    console.error("Error starting cron worker:", error);
    process.exit(1);
  }
};

startCronWorker();
