import { useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";
import { handleError } from "../utils/errorHandler";

export const useAddTask = (onSuccess: () => void) => {
  const getDefaultDate = () => {
    const current = new Date();
    current.setMinutes(current.getMinutes() + 1);
    return current.toString();
  };

  const [formData, setFormData] = useState({
    description: "",
    date: getDefaultDate(),
    status: "to-do",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
