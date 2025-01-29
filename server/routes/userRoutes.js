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
import passport from "../auth/passport.js";
import {
  registerRateLimiter,
  loginRateLimiter,
  emailRateLimiter,
  guestRateLimiter,
} from "../utils/rateLimiter.js";

const router = express.Router();

router.get("/streak", getStreak);
router.post("/register", registerRateLimiter, createUser);
router.post("/login", loginRateLimiter, loginUser);
router.post("/refresh", refreshToken);
router.post("/verify", emailRateLimiter, verifyEmail);
router.post("/resend", emailRateLimiter, resendVerificationEmail);
router.post("/guest", guestRateLimiter, createGuest);
router.delete("/logout", logoutUser);
router.post("/forgot-password", emailRateLimiter, forgotPassword);
router.put("/reset-password", emailRateLimiter, resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { customAccessToken, refreshToken } = req.user;

    res.cookie("accessToken", customAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect("http://localhost:3000/");
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const { customAccessToken, refreshToken } = req.user;

    res.cookie("accessToken", customAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect("http://localhost:3000/");
  }
);

export default router;
