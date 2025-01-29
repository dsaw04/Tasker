import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

/**
 * Checks whether a date is either today or in the future.
 * @param {Date} date
 * @returns {Boolean}
 */
export const isTodayOrFuture = (date) => {
  const currentDate = new Date();
  return new Date(date).getTime() >= currentDate.getTime();
};

/**
 * Checks if a task with the same description exists for the same user on the given date.
 * @param {String} userId - The user's ID.
 * @param {String} description - The task description.
 * @param {Date} date - The date of the task.
 * @returns {Boolean} - Returns true if a duplicate exists, false otherwise.
 */
export const isDuplicateTask = async (userId, description, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const taskExist = await Task.findOne({
    description,
    date: { $gte: startOfDay, $lte: endOfDay },
    user: userId,
  });

  return !!taskExist;
};

/**
 * Updates overdue tasks for a specific user and resets their streak if necessary.
 * @param {ObjectId} userId - The user's ID.
 */
export const handleOverdueTasks = async (userId) => {
  const overdueTasks = await Task.updateMany(
    { user: userId, date: { $lt: new Date() } },
    { $set: { isOverdue: true } }
  );

  if (overdueTasks.modifiedCount > 0) {
    await User.findByIdAndUpdate(userId, { $set: { streak: 0 } });
  }
};
