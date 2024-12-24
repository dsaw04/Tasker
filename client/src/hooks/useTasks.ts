import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TaskType } from "../types/TaskType";

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks function (reusable)
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/api/tasks");
      const transformedTasks = response.data.data.map((task: TaskType) => ({
        ...task,
        date: new Date(task.date), // Ensure date is a Date object
      }));
      setTasks(transformedTasks);

      console.log("Transformed Tasks:", transformedTasks);
      setTasks(transformedTasks);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
};
