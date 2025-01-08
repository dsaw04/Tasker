import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";

export const useDeleteTask = (onSuccess: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTask = async (taskId: string) => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/task/${taskId}`);
      toast.success("Task deleted successfully!");
      onSuccess(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to delete task.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteTask };
};
