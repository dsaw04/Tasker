import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useUpdateTask = (onSuccess: () => void) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTask = async (
    taskId: string,
    updatedData: { description: string; date: string; status: string }
  ) => {
    setIsUpdating(true);
    try {
      await axios.put(`http://localhost:8000/api/task/${taskId}`, updatedData);
      toast.success("Task updated successfully!");
      onSuccess(); // Trigger a refetch
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to update task.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, updateTask };
};
