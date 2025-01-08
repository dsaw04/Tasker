import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../sendgrid/sendgrid.config.js";
import crypto from "crypto";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

const generateGuestRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "30m",
  });
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = generateVerificationCode();

    const newUser = new User({
      username,
      email,
      password: password,
      verificationToken,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000,
    });
    await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Save the refresh token in the user document
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Set cookies for tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    await sendVerificationEmail(email, verificationToken, username);

    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const email = req.cookies.email;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate a new verification token
    const verificationToken = generateVerificationCode();
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationToken, user.username);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.clearCookie("email");
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User not found. Please check your credentials." });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "Incorrect password. Please try again." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email verification is pending. Please verify your email.",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Login successful!", accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const user = await User.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user._id);

    // Rotate the refresh token
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    if (user.role === "guest") {
      const newExpirationDate = new Date();
      newExpirationDate.setMinutes(newExpirationDate.getMinutes() + 30);
      user.refreshTokenExpiresAt = newExpirationDate;
    }
    await user.save();

    // Send new cookies
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error during token refresh:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Refresh token expired" });
    }
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null } // Clear refresh token in DB
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGuest = async (req, res) => {
  try {
    const randomSequence = crypto.randomBytes(4).toString("hex");
    const guestUsername = `Guest_${randomSequence}`;

    const uniqueGuestEmail = `guest_${Date.now()}@example.com`;

    // Create a new guest user
    const guestUser = new User({
      username: guestUsername,
      email: uniqueGuestEmail,
      role: "guest",
      guestTaskLimit: 5,
      guestEditLimit: 10,
    });
    await guestUser.save();

    const token = generateAccessToken(guestUser._id);
    const refreshToken = generateGuestRefreshToken(guestUser._id);
    guestUser.refreshToken = refreshToken;

    await guestUser.save();

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "Guest user created successfully",
      token,
      user: {
        id: guestUser._id,
        username: guestUser.username,
        role: guestUser.role,
      },
    });
  } catch (error) {
    console.error("Error creating guest user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStreak = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access Denied: Token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      streak: user.streak,
    });
  } catch (err) {
    console.error("Error fetching streak:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not registered." });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await sendResetPasswordEmail(email, resetLink, user.username);
    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.password = password;

    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ error: "Token has expired." });
    }
    res.status(400).json({ error: "Invalid token." });
  }
};
