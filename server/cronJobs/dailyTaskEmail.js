import cron from "node-cron";
import { getTasksForToday } from "../utils/taskUtils.js";
import { publishEmailTask } from "../queues/emailPublisher.js";

export const scheduleDailyTaskEmail = () => {
  cron.schedule(
    "0 9 * * *", // Run daily at 9:00 AM
    async () => {
      try {

        const usersWithTasks = await getTasksForToday();

        // Publish email tasks to RabbitMQ
        for (const user of usersWithTasks) {
          const { email, username, tasks } = user; // Extract fields from user object
          await publishEmailTask(email, username, tasks);
        }
      } catch (error) {
        console.error("Error during daily task email job:", error);
      }
    },
    {
      timezone: "Pacific/Auckland", // Adjust timezone as needed
    }
  );
};
