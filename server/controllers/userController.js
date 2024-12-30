import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Cannot find user!" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid Login!" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key (store in .env)
      { expiresIn: "30d" } // Token expiration time
    );

    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
