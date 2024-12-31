import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateToken, getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.delete("/logout", logoutUser);

export default router;
