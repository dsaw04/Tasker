import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TaskType } from "../types/TaskType";

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/api/tasks");

      if (response.status === 204 || !response.data?.data?.length) {
        setTasks([]);
        setError(204);
        return;
      }

      const transformedTasks = response.data.data.map((task: TaskType) => ({
        ...task,
        date: new Date(task.date),
      }));

      setTasks(transformedTasks);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.status || 500 : 500);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
};
