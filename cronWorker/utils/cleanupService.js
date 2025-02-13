import User from "../../server/models/userModel.js";
import Task from "../../server/models/taskModel.js";
import UserMetrics from "../../server/models/userMetricsModel.js";

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

/**
 * Deletes unverified users older than 30 days, their tasks, and their metrics.
 * Runs as part of a monthly cleanup job.
 */
export const deleteUnverifiedUsersAndTasks = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const unverifiedUsers = await User.find({
      isVerified: false,
      createdAt: { $lt: oneMonthAgo },
    });

    if (unverifiedUsers.length === 0) {
      return 0;
    }

    const unverifiedUserIds = unverifiedUsers.map((user) => user._id);

    await Promise.all([
      Task.deleteMany({ user: { $in: unverifiedUserIds } }),
      UserMetrics.deleteMany({ user: { $in: unverifiedUserIds } }),
      User.deleteMany({ _id: { $in: unverifiedUserIds } }),
    ]);

    return unverifiedUsers.length;
  } catch (error) {
    console.error("Error during unverified user cleanup:", error);
    throw error;
  }
};
