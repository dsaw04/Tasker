import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const VerificationRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return location.state?.fromRegister ||
    location.state?.fromError ||
    location.state?.fromResend ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};

export default VerificationRoute;
