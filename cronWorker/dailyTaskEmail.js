import cron from "node-cron";
import { getTasksForToday } from "./utils/getTaskForToday.js";
import { publishEmailTask } from "./utils/emailPublisher.js";

export const scheduleDailyTaskEmail = () => {
  cron.schedule(
    "* * * * *",
    async () => {
      // ✅ Runs every 1 minute for testing
      console.log("cron triggered");
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
