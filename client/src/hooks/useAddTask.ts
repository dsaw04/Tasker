import { useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";
import { handleApiError } from "../utils/errorHandler";
import { toLocalDatetime } from "../utils/toLocatDateTime";

export const useAddTask = (onSuccess: () => void) => {
  const getDefaultDate = () => {
    const current = new Date();
    current.setMinutes(current.getMinutes() + 1); // Add 1 minute to avoid past time
    return toLocalDatetime(current); // Convert to local datetime format
  };

  const [formData, setFormData] = useState({
    description: "",
    date: getDefaultDate(), // Default to current local datetime
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
      date: getDefaultDate(), // Reset with updated current date
      status: "to-do",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/task", formData); // Use `apiClient`
      toast.success("Task added successfully!");
      resetForm();
      onSuccess(); // Trigger parent success callback (e.g., refetch tasks)
    } catch (error) {
      toast.error(handleApiError(error)); // Handle backend error messages
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
