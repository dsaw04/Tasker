import { useMemo } from "react";
import { sortTasks } from "../utils/sortTasks";
import { TaskType } from "../types/TaskType";

export const useSortTasks = (
  tasks: TaskType[],
  sortOption: string
): TaskType[] => {
  return useMemo(() => sortTasks(tasks, sortOption), [tasks, sortOption]);
};
