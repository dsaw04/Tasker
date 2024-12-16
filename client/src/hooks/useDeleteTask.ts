import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useDeleteTask = (onSuccess: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTask = async (taskId: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/api/task/${taskId}`);
      toast.success("Task deleted successfully!");
      onSuccess(); // Trigger a refetch or parent success action
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
