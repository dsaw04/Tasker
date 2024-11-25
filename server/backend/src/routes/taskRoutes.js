import express from "express";
import { create } from "../controllers/taskController.js";

const router = express.Router();
router.post("/tasks", create);

export default router;
