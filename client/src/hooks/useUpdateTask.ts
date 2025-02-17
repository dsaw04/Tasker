import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { TaskType } from "../types/TaskType";
import { TaskStatus } from "../types/TaskType";
import apiClient from "../api/apiClient";
import { handleError } from "../utils/errorHandler";

export const useUpdateTask = (task: TaskType, onSuccess: () => void) => {
  const getDefaultDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}T${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const [formData, setFormData] = useState({
    description: "",
    date: getDefaultDate(),
    status: "to-do" as TaskStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description,
        date: new Date(task.date).toString(),
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
        date: getDefaultDate(),
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
      onSuccess();
    } catch (error) {
      handleError(error);
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
