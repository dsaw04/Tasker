export interface TaskType {
  _id: string;
  description: string;
  date: Date;
  status: string;
}

export function sortTasks(tasks: TaskType[], sortOption: string): TaskType[] {
  return [...tasks].sort((a, b) => {
    if (sortOption === "chronological") {
      return new Date(a.date).getTime() - new Date(b.date).getTime(); // Convert to Date if 'date' is a string
    }
    if (sortOption === "priority") {
      const priorityOrder = ["to-do", "check-in", "done"];
      return priorityOrder.indexOf(a.status) - priorityOrder.indexOf(b.status);
    }
    if (sortOption === "alphabetical") {
      return a.description.localeCompare(b.description);
    }
    return 0; // Default case
  });
}
