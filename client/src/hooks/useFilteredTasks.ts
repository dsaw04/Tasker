import { useMemo } from "react";
import { TaskType } from "../types/TaskType";
import { isSameDay } from "date-fns";

export const useFilteredTasks = (
  tasks: TaskType[],
  results: TaskType[],
  selectedDate: string | null
) => {
  const baseTasks = results.length ? results : tasks;

  return useMemo(() => {
    if (selectedDate) {
      return baseTasks.filter((task) =>
        isSameDay(new Date(task.date), new Date(selectedDate))
      );
    }
    return baseTasks;
  }, [baseTasks, selectedDate]);
};
