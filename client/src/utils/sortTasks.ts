import { TaskType } from "../types/TaskType";

export function sortTasks(tasks: TaskType[], sortOption: string): TaskType[] {
  return [...tasks].sort((a, b) => {
    if (sortOption === "chronological") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortOption === "priority") {
      if (a.isOverdue !== b.isOverdue) {
        return a.isOverdue ? -1 : 1;
      }
      const priorityOrder = ["to-do", "check-in"];
      return priorityOrder.indexOf(a.status) - priorityOrder.indexOf(b.status);
    }
    if (sortOption === "alphabetical") {
      return a.description.localeCompare(b.description);
    }
    return 0; // Default case
  });
}
