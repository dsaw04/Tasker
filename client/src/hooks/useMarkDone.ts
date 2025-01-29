import { useState } from "react";
import { handleError } from "../utils/errorHandler";
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
      handleError(error);
    } finally {
      setIsMarking(false);
    }
  };

  return { isMarking, markDone };
};
