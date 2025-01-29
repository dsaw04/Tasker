import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

/**
 * Deletes guest users and their associated tasks.
 * Runs as part of a daily cleanup job.
 */
export const deleteGuestUsersAndTasks = async () => {
  try {
    const guestUsers = await User.find({ role: "guest" });

    if (guestUsers.length === 0) {
      console.log("No guest users to delete.");
      return 0;
    }

    const guestUserIds = guestUsers.map((user) => user._id);
    await Task.deleteMany({ user: { $in: guestUserIds } });
    const result = await User.deleteMany({ _id: { $in: guestUserIds } });

    console.log(`Deleted ${result.deletedCount} guest users and their tasks.`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error during guest user cleanup:", error);
    throw error;
  }
};

/**
 * Deletes unverified users older than 30 days along with their associated tasks.
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
      console.log("No unverified users to delete.");
      return 0;
    }

    const unverifiedUserIds = unverifiedUsers.map((user) => user._id);
    await Task.deleteMany({ user: { $in: unverifiedUserIds } });
    const result = await User.deleteMany({ _id: { $in: unverifiedUserIds } });

    console.log(
      `Deleted ${result.deletedCount} unverified users and their tasks.`
    );
    return result.deletedCount;
  } catch (error) {
    console.error("Error during unverified user cleanup:", error);
    throw error;
  }
};
