import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  createGuest,
  getStreak,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const resendRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many resend attempts. Please try again later.",
});

router.get("/streak", getStreak);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/verify", verifyEmail);
router.post("/resend", resendRateLimiter, resendVerificationEmail);
router.post("/guest", createGuest);
router.delete("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

export default router;
