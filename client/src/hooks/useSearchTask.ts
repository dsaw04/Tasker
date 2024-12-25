import { useState, useCallback } from "react";
import axios from "axios";
import { TaskType } from "../types/TaskType";

export const useSearchTask = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<number | null>(null);

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
      setSearchError(null); // Clear any previous error if the search is successful
    } catch (err) {
      console.error(err);
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
    setResults([]); // Clear the search results
    setSearchError(null); // Clear the error when resetting
  }, []);

  return { results, searchTasks, searchError, resetResults, loading };
};
