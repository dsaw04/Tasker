import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: ["to-do", "check-in", "done"],
      default: "to-do",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
