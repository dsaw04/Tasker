import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

export const deleteGuestUsersAndTasks = async () => {
  try {
    const guestUsers = await User.find({ role: "guest" });

    if (guestUsers.length === 0) {
      console.log("No guest users to delete.");
      return 0;
    }

    const guestUserIds = guestUsers.map((user) => user._id);
    await Task.deleteMany({ userId: { $in: guestUserIds } });
    const result = await User.deleteMany({ _id: { $in: guestUserIds } });
    console.log(`Deleted ${result.deletedCount} guest users and their tasks.`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
};
