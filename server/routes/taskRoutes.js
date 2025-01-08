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

const router = express.Router();

router.post("/task", authenticateToken, create);
router.get("/tasks", authenticateToken, getAllTasks);
router.get("/search", authenticateToken, searchTasks);
router.put("/task/:id", authenticateToken, updateTask);
router.put("/tasks/:id/mark-done", authenticateToken, markDone);
router.delete("/task/:id", authenticateToken, deleteTask);

export default router;
