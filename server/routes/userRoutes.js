import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.delete("/logout", logoutUser);

export default router;
