import cron from "node-cron";
import {
  deleteGuestUsersAndTasks,
  deleteUnverifiedUsersAndTasks,
} from "./utils/cleanupService.js";

/**
 * Schedules cleanup jobs for guest users (daily) and unverified users (monthly).
 */
export const scheduleCleanupJob = () => {
  // Daily cleanup job for guest users
  cron.schedule(
    "* * * * *",
    async () => {
      // ✅ Runs every 1 minute for testing
      console.log("cron triggered");
      try {
        await deleteGuestUsersAndTasks();
      } catch (error) {
        console.error("Error during guest user cleanup:", error);
      }
    },
    {
      timezone: "Pacific/Auckland",
    }
  );

  // Monthly cleanup job for unverified users (runs on the 1st of every month)
  cron.schedule(
    "* * * * *",
    async () => {
      // ✅ Runs every 1 minute for testing
      console.log("cron triggered");
      try {
        await deleteUnverifiedUsersAndTasks();
      } catch (error) {
        console.error("Error during unverified user cleanup:", error);
      }
    },
    {
      timezone: "Pacific/Auckland",
    }
  );
};
