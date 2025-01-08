import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";

export const useMarkDone = (onSuccess: () => void) => {
  const [isMarking, setIsMarking] = useState(false);

  const markDone = async (taskId: string) => {
    setIsMarking(true);
    try {
      await apiClient.put(`/tasks/${taskId}/mark-done`);
      toast.success("Task marked as done successfully!");
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Failed to mark task as done."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsMarking(false);
    }
  };

  return { isMarking, markDone };
};
