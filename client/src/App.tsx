import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TaskerApp from "./pages/Tasker";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import VerificationPage from "./pages/VerificationPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { NotFound } from "./pages/NotFound";
import VerificationRoute from "./routes/VerificationRoute";
import ResendVerificationPage from "./pages/ResendVerificationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/verify"
          element={
            <VerificationRoute>
              <VerificationPage />
            </VerificationRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/resend-verification"
          element={
            <VerificationRoute>
              <ResendVerificationPage />
            </VerificationRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TaskerApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
