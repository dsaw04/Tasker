import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Utility to normalize datetime to local timezone
const toLocalDatetime = (date: Date): string =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16); // Formats as "YYYY-MM-DDTHH:mm"

export const useAddTask = (onSuccess: () => void) => {
  // Set current time in local timezone
  const now = toLocalDatetime(new Date());

  const [formData, setFormData] = useState({
    description: "",
    date: now, // Use local timezone
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
    setFormData({ description: "", date: now, status: "to-do" }); // Reset form with local time
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8000/api/task", formData);
      toast.success("Task added successfully!");
      resetForm();
      onSuccess(); // Trigger refetch
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to add task.");
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
