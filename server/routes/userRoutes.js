import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  createGuest,
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
import { validateUserRegistration } from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", validateUserRegistration, createUser); //temp remove registerRateLimiter
router.post("/login", loginUser); //temp remove loginRateLimiter
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

    res.redirect(`${process.env.FRONTEND_URL}/`);
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

    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

export default router;
