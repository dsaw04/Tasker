import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: function () {
      return this.role !== "guest" && !this.githubId;
    },
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
    index: true,
  },
  password: {
    type: String,
    required: function () {
      return this.role !== "guest" && !this.googleId && !this.githubId;
    },
  },
  googleId: {
    type: String,
  },
  githubId: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "guest"],
    default: "user",
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshTokenExpiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  verificationToken: {
    type: String,
    index: true,
  },
  verificationTokenExpires: {
    type: Date,
  },
  guestTaskLimit: {
    type: Number,
  },
  guestEditLimit: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
