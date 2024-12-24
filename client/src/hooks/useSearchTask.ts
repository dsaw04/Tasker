import { useState, useCallback } from "react";
import axios from "axios";
import { TaskType } from "../types/TaskType";

export const useSearchTask = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTasks = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/search", {
        params: { description: query },
      });
      const transformedResults = response.data.data.map((task: TaskType) => ({
        ...task,
        date: new Date(task.date), // Ensure date is a Date object
      }));
      setResults(transformedResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetResults = useCallback(() => {
    setResults([]); // Clear the search results
  }, []);

  return { results, searchTasks, resetResults, loading };
};
