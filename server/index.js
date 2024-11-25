import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./backend/src/routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

// Routes
app.use("/api", route);
