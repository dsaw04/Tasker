import mongoose from "mongoose";

const userMetricsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserMetrics", userMetricsSchema);
