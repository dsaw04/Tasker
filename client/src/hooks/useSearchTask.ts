import { useState, useCallback } from "react";
import axios from "axios";
import { TaskType } from "../types/TaskType";
import apiClient from "../api/apiClient";

export const useSearchTask = () => {
  const [results, setResults] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<number | null>(null);

  const searchTasks = useCallback(async (query: string) => {
    setLoading(true);
    setSearchError(null);

    try {
      const response = await apiClient.get("/search", {
        params: { description: query },
      });

      const { data } = response.data;

      const transformedResults = data.map((task: TaskType) => ({
        ...task,
        date: new Date(task.date),
      }));

      setResults(transformedResults);
    } catch (err) {
      console.error("Error during search:", err);
      if (axios.isAxiosError(err)) {
        setSearchError(err.response ? err.response.status : 500);
      } else {
        setSearchError(500);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const resetResults = useCallback(() => {
    setResults([]); 
    setSearchError(null);
  }, []);

  return { results, searchTasks, searchError, resetResults, loading };
};
