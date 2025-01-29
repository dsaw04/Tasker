import { useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";
import { handleApiError } from "../utils/errorHandler";
import { toLocalDatetime } from "../utils/toLocatDateTime";

export const useAddTask = (onSuccess: () => void) => {
  const getDefaultDate = () => {
    const current = new Date();
    current.setMinutes(current.getMinutes() + 1);
    return toLocalDatetime(current);
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
      await apiClient.post("/task", formData); 
      toast.success("Task added successfully!");
      resetForm();
      onSuccess(); 
    } catch (error) {
      toast.error(handleApiError(error)); 
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
