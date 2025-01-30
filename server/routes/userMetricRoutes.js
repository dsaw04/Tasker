import express from "express";
import { getStreak } from "../controllers/userMetricsController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/streak", authenticateToken, getStreak);

export default router;
