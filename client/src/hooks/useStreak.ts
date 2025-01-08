import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";
import { AxiosError } from "axios";

export const useStreak = () => {
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = useCallback(async () => {
    setLoading(true); // Set loading state when refetching
    setError(null); // Reset error state
    try {
      const response = await apiClient.get("/users/streak");
      setStreak(response.data.streak);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error fetching streak:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak(); // Initial fetch
  }, [fetchStreak]);

  return { streak, loading, error, refetch: fetchStreak };
};
