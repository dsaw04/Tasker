import User from "./models/userModel.js";
import Task from "./models/taskModel.js";
import UserMetrics from "./models/userMetricsModel.js";

/**
 * Deletes guest users, their tasks, and their metrics.
 * Runs as part of a daily cleanup job.
 */
export const deleteGuestUsersAndTasks = async () => {
  try {
    const guestUsers = await User.find({ role: "guest" });

    if (guestUsers.length === 0) {
      return 0;
    }

    const guestUserIds = guestUsers.map((user) => user._id);

    await Promise.all([
      Task.deleteMany({ user: { $in: guestUserIds } }),
      UserMetrics.deleteMany({ user: { $in: guestUserIds } }),
      User.deleteMany({ _id: { $in: guestUserIds } }),
    ]);

    return guestUsers.length;
  } catch (error) {
    console.error("Error during guest user cleanup:", error);
    throw error;
  }
};
