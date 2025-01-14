import cron from "node-cron";
import { deleteGuestUsersAndTasks } from "../utils/cleanupService.js";

export const scheduleCleanupJob = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const deletedCount = await deleteGuestUsersAndTasks();
        console.log(
          `Cleanup completed. Removed ${deletedCount} guest users and their tasks.`
        );
      } catch (error) {
        console.error("Error during guest user cleanup:", error);
      }
    },
    {
      timezone: "Pacific/Auckland",
    }
  );

  console.log("Guest user cleanup job scheduled.");
};
