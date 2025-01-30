import Task from "../models/taskModel.js";
import UserMetrics from "../models/userMetricsModel.js";
import { redisClient } from "../config/redisClient.js";

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
  const now = new Date();
  const overdueTasks = await Task.updateMany(
    { user: userId, date: { $lt: now }, isOverdue: false },
    { $set: { isOverdue: true } }
  );

  if (overdueTasks.modifiedCount > 0) {
    const userMetrics = await UserMetrics.findOneAndUpdate(
      { user: userId },
      { $set: { streak: 0 } },
      { new: true }
    );

    if (userMetrics) {
      const cacheKey = `streak:${userId}`;
      await redisClient.set(cacheKey, 0, { EX: 86400 });
    }
  }
};

/**
 * Fetch tasks for today, grouped by user, excluding tasks created by guests.
 * @returns {Array} Array of objects, each containing user email, username, and tasks.
 */
export const getTasksForToday = async () => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  console.log("Fetching tasks for today between:", startOfDay, "and", endOfDay);

  try {
    // Fetch tasks due today, including user email, username, and role
    const tasks = await Task.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("user", "email username role"); // Include email, username, and role

    if (!tasks.length) {
      console.log("No tasks found for today.");
      return [];
    }

    console.log("Tasks fetched:", tasks);

    // Group tasks by user, skipping tasks created by guests
    const userTaskMap = tasks.reduce((acc, task) => {
      if (
        !task.user || // Skip if no user is associated
        !task.user.email || // Skip if no email
        !task.user.username || // Skip if no username
        task.user.role === "guest" // Skip tasks created by guests
      ) {
        console.warn(
          `Task ${task._id} is skipped because it is missing a valid user or created by a guest.`
        );
        return acc;
      }

      const userId = task.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          email: task.user.email,
          username: task.user.username,
          tasks: [],
        };
      }
      acc[userId].tasks.push({
        id: task._id,
        description: task.description,
        date: task.date,
        status: task.status,
      });

      return acc;
    }, {});

    const result = Object.values(userTaskMap); // Convert map to array
    console.log("Tasks organized by user (excluding guest tasks):", result);

    return result;
  } catch (error) {
    console.error("Error fetching tasks for today:", error);
    throw error;
  }
};
