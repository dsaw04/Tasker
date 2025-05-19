import { useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";
import { handleError } from "../utils/errorHandler";
import { getDefaultDate } from "../utils/getDefaultDate";

export const useAddTask = (onSuccess: () => void) => {
  const [formData, setFormData] = useState({
    description: "",
    date: getDefaultDate(),
    status: "to-do",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = e.target.name;
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      date: getDefaultDate(),
      status: "to-do",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/task", {
        ...formData,
        date: new Date(formData.date),
      });
      toast.success("Task added successfully!");
      resetForm();
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
