import { useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";
import { handleError } from "../utils/errorHandler";

export const useDeleteTask = (onSuccess: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTask = async (taskId: string) => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/task/${taskId}`);
      toast.success("Task deleted successfully!");
      onSuccess(); 
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteTask };
};
