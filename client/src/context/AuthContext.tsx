import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import apiClient, { setAccessToken } from "../api/apiClient";

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  verifyEmail: (code: string) => Promise<string>;
  getAccessToken: () => string | null;
  resendVerificationEmail: (email: string) => Promise<void | string>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  loginWithGoogle: () => {},
  logout: async () => {},
  register: async () => {},
  verifyEmail: async () => "",
  getAccessToken: () => null,
  resendVerificationEmail: async () => {},
  loginAsGuest: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/users/refresh",
          {},
          { withCredentials: true }
        );
        updateAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to authenticate:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/users/google";
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        { username, password },
        { withCredentials: true }
      );
      updateAccessToken(response.data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const verifyEmail = async (code: string): Promise<string> => {
    try {
      const response = await apiClient.post("/users/verify", { code });

      if (response.status !== 200) {
        throw new Error(
          response.data?.message || "Unexpected response from the server."
        );
      }

      return response.data.message;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message ||
          "Failed to verify email. Please try again.";
        console.error("Email verification failed:", errorMessage);
        throw new Error(errorMessage);
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        { username, email, password },
        { withCredentials: true }
      );
      updateAccessToken(response.data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string): Promise<void | string> => {
    try {
      const response = await apiClient.post(
        "/users/resend",
        { email },
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data?.message || "Unexpected response from the server."
        );
      }

      return response.data.message;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message ||
          "Failed to resend verification email. Please try again.";
        console.error("Resend verification email failed:", errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error("An unexpected error occurred:", error);
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const loginAsGuest = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/guest",
        {},
        { withCredentials: true }
      );
      updateAccessToken(response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Guest login failed:", error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post("http://localhost:8000/api/users/forgot-password", {
        email,
      });
      console.log("Password reset email sent.");
    } catch (error) {
      console.error("Forgot password request failed:", error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await axios.put("http://localhost:8000/api/users/reset-password", {
        token,
        password,
      });
      console.log("Password reset successful.");
    } catch (error) {
      console.error("Reset password request failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.delete("/users/logout", { withCredentials: true });
      updateAccessToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getAccessToken = () => accessToken;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        loginWithGoogle,
        logout,
        register,
        verifyEmail,
        resendVerificationEmail,
        getAccessToken,
        loginAsGuest,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
