import { AxiosError } from "axios";

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response) {
      return error.response.data?.message || "Server responded with an error.";
    } else if (error.request) {
      return "No response from the server. Please check your network.";
    }
  }
  return "An unexpected error occurred.";
};
