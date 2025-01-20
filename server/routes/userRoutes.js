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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, customAccessToken, refreshToken } = req.user;

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
    const { user, customAccessToken, refreshToken } = req.user;

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
