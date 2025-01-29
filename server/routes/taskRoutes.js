import express from "express";
import {
  create,
  deleteTask,
  getAllTasks,
  searchTasks,
  updateTask,
  markDone,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { enforceGuestLimit } from "../middlewares/enforceGuestLimit.js";

const router = express.Router();

router.post("/task", authenticateToken, enforceGuestLimit("create"), create);
router.get("/tasks", authenticateToken, getAllTasks);
router.get("/search", authenticateToken, searchTasks);
router.put(
  "/task/:id",
  authenticateToken,
  enforceGuestLimit("update"),
  updateTask
);
router.put("/tasks/:id/mark-done", authenticateToken, markDone);
router.delete(
  "/task/:id",
  authenticateToken,
  enforceGuestLimit("delete"),
  deleteTask
);

export default router;
