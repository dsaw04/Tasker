import { getUserStreak } from "../utils/userMetricUtils.js";

export const getStreak = async (req, res) => {
  try {
    const streak = await getUserStreak(req.user);
    return res.status(200).json({ success: true, streak });
  } catch (err) {
    console.error("Error fetching streak:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};
