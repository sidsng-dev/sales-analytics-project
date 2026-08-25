import React from "react";
import { Navigate } from "react-router-dom";
import { ShieldX } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <ShieldX size={30} />
          </div>

          <h2>Access Denied</h2>

          <p>
            You don't have permission to access this
            page.
          </p>

          <span>
            Your current role:{" "}
            <strong>{user?.role}</strong>
          </span>

          <button
            onClick={() =>
              (window.location.href = "/")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;