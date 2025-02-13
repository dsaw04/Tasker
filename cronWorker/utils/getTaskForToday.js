import Task from "../../server/models/taskModel.js";

/**
 * Fetch tasks for today, grouped by user, excluding tasks created by guests.
 * @returns {Array} Array of objects, each containing user email, username, and tasks.
 */
export const getTasksForToday = async () => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
    8,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 2,
    8,
    0,
    0,
    0
  );

  try {
    // Fetch tasks due today, including user email, username, and role
    const tasks = await Task.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("user", "email username role"); // Include email, username, and role

    if (!tasks.length) {
      return [];
    }

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
    return result;
  } catch (error) {
    console.error("Error fetching tasks for today:", error);
    throw error;
  }
};
