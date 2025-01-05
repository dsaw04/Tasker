import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { TaskType } from "../types/TaskType";
import { TaskStatus } from "../types/TaskType";
import apiClient from "../api/apiClient";

// Utility to normalize datetime to local timezone
const toLocalDatetime = (date: Date): string =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

export const useUpdateTask = (task: TaskType, onSuccess: () => void) => {
  const [formData, setFormData] = useState({
    description: "",
    date: toLocalDatetime(new Date()), // Initialize to local time
    status: "to-do" as TaskStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description,
        date: toLocalDatetime(new Date(task.date)), // Normalize task date
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    if (task) {
      setFormData({
        description: task.description,
        date: toLocalDatetime(new Date(task.date)),
        status: task.status,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.put(`/task/${task._id}`, {
        ...formData,
        date: new Date(formData.date),
      });
      toast.success("Task updated successfully!");
      onSuccess(); // Trigger a refetch
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to update task.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
