import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { TaskType } from "../types/TaskType";
import { TaskStatus } from "../types/TaskType";
import apiClient from "../api/apiClient";
import { handleError } from "../utils/errorHandler";


const toLocalDatetime = (date: Date): string =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

export const useUpdateTask = (task: TaskType, onSuccess: () => void) => {
  const [formData, setFormData] = useState({
    description: "",
    date: toLocalDatetime(new Date()),
    status: "to-do" as TaskStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description,
        date: toLocalDatetime(new Date(task.date)),
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
      console.log(formData);
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
