import express from "express";
import {
  create,
  deleteTask,
  getAllTasks,
  searchTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();
router.post("/task", create);
router.get("/tasks", getAllTasks);
router.get("/search", searchTasks);
router.put("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);

export default router;
