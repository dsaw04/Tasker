import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: function () {
      return this.role !== "guest"; // Email is required only for non-guest users
    },
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: function () {
      return this.role !== "guest"; // Password is required only for non-guest users
    },
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
  streak: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.role === "guest") return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
