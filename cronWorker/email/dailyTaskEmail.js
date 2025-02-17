import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectRabbitMQ } from "../utils/rabbitmq.js";
import { getTasksForToday } from "../utils/getTaskForToday.js";
import { publishEmailTask } from "../utils/emailPublisher.js";

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

const startDailyEmail = async () => {
  try {
    await connectMongoDB();
    const rabbitMQConnection = await connectRabbitMQ();

    const usersWithTasks = await getTasksForToday();

    for (const user of usersWithTasks) {
      const { email, username, tasks } = user;
      await publishEmailTask(email, username, tasks);
    }

    await mongoose.connection.close();
    if (rabbitMQConnection) {
      await rabbitMQConnection.close();
    }
    process.exit(0);
  } catch (error) {
    console.error("Error in daily mail:", error);
    process.exit(1);
  }
};

startDailyEmail();
