import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import apiClient from "../api/apiClient";
import { handleError } from "../utils/errorHandler";
import { AuthContextType } from "../types/AuthContextType";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  loginWithGoogle: () => {},
  logout: async () => {},
  register: async () => {},
  verifyEmail: async () => {},
  resendVerificationEmail: async () => {},
  loginAsGuest: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/refresh`,
          {},
          { withCredentials: true }
        );
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/users/google`;
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        { username, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/verify`,
        { code },
        { withCredentials: true }
      );
    } catch (error) {
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        { username, email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/resend`,
        { email },
        { withCredentials: true }
      );
    } catch (error) {
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/guest`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/forgot-password`,
        { email },
        { withCredentials: true }
      );
    } catch (error) {
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/reset-password`,
        { token, password },
        { withCredentials: true }
      );
    } catch (error) {
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.delete("/users/logout", { withCredentials: true });
      setIsAuthenticated(false);
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(handleError(error));
    } finally {
      setLoading(false);
    }
  };

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
        loginAsGuest,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
