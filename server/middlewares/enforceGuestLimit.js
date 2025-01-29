import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

export const enforceGuestLimit = (action) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user);

      if (user.role === "guest") {
        let limit = 0;

        if (action === "create") {
          limit = user.guestTaskLimit;
          const taskCount = await Task.countDocuments({ user: user._id });

          if (taskCount >= limit) {
            return res.status(403).json({
              success: false,
              message: `Guest users can only create up to ${limit} tasks.`,
            });
          }
        } else if (["update", "delete"].includes(action)) {
          limit = user.guestEditLimit;

          if (limit < 0) {
            return res.status(403).json({
              success: false,
              message: "Guest users can only edit/delete tasks 10 times.",
            });
          }

          user.guestEditLimit -= 1;
          await user.save();
        }
      }

      next();
    } catch (err) {
      console.error("Error in guest limit middleware:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred.",
      });
    }
  };
};
