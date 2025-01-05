import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendVerificationEmail } from "../sendgrid/sendgrid.config.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
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
  const { username, password } = req.body;

  // Find user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) {
    console.log("Cannot find user!");
    return res.status(400).json({ error: "Cannot find user!" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    console.log("Invalid Login!");
    return res.status(400).json({ error: "Invalid Login!" });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ error: "Please verify your email to log in." });
  }

  // Generate access and refresh tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token in the user document
  user.refreshToken = refreshToken;
  await user.save();

  // Set HttpOnly cookies for tokens
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

  res.status(200).json({ message: "Login successful!", accessToken });
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
    user.refreshToken = newRefreshToken; // Save new refresh token in DB
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
