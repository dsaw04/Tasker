import { useMemo } from "react";
import { TaskType } from "../types/TaskType";

export const useFilteredTasks = (tasks: TaskType[], results: TaskType[]) => {
  return useMemo(() => (results.length ? results : tasks), [tasks, results]);
};
