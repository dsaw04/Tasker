import cron from "node-cron";
import {
  deleteGuestUsersAndTasks,
  deleteUnverifiedUsersAndTasks,
} from "../utils/cleanupService.js";

/**
 * Schedules cleanup jobs for guest users (daily) and unverified users (monthly).
 */
export const scheduleCleanupJob = () => {
  // Daily cleanup job for guest users
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const deletedCount = await deleteGuestUsersAndTasks();
        console.log(
          `Guest cleanup completed. Removed ${deletedCount} guest users and their tasks.`
        );
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
    "0 1 1 * *",
    async () => {
      try {
        const deletedCount = await deleteUnverifiedUsersAndTasks();
        console.log(
          `Unverified user cleanup completed. Removed ${deletedCount} unverified users and their tasks.`
        );
      } catch (error) {
        console.error("Error during unverified user cleanup:", error);
      }
    },
    {
      timezone: "Pacific/Auckland",
    }
  );

  console.log("Guest and unverified user cleanup jobs scheduled.");
};
