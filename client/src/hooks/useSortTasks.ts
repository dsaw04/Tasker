import { useMemo } from "react";
import { TaskType, sortTasks } from "../utils/sortTasks";

export const useSortTasks = (
  tasks: TaskType[],
  sortOption: string
): TaskType[] => {
  return useMemo(() => sortTasks(tasks, sortOption), [tasks, sortOption]);
};
