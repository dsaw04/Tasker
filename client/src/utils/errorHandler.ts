import { AxiosError } from "axios";
import toast from "react-hot-toast";

/**
 * Handles errors globally across the app.
 * @param {unknown} error - The caught error from a try-catch block.
 */
export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const message =
      error.response?.data?.message || "An unexpected error occurred.";

    switch (statusCode) {
      case 400:
        toast.error(message);
        return message;
      case 401:
        toast.error("Unauthorized access. Please log in.");
        return "Unauthorized access.";
      case 403:
        toast.error("Access denied. You don't have permission.");
        return "Access denied.";
      case 404:
        toast.error("Resource not found.");
        return "Resource not found.";
      case 429:
        toast.error("Too many requests. Try again later.");
        return "Too many requests.";
      case 500:
      default:
        toast.error("Something went wrong. Please try again later.");
        return "Internal server error.";
    }
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return error.message;
  }

  toast.error("An unexpected error occurred.");
  return "An unexpected error occurred.";
};
