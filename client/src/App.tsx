import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TaskerApp from "./pages/Tasker";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import VerificationPage from "./pages/VerificationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TaskerApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
