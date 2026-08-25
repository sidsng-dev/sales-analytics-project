import React, { useState } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState(
    "siddhi.singh@example.com"
  );

  const [password, setPassword] = useState(
    "password123"
  );

  const [role, setRole] = useState("Admin");

  const handleSubmit = (e) => {
    e.preventDefault();

    /*
     * TEMPORARY FRONTEND LOGIN
     *
     * Later this will be replaced with:
     *
     * POST /api/auth/login
     *
     * and the backend will return:
     *
     * {
     *   token,
     *   user: {
     *     id,
     *     name,
     *     email,
     *     role
     *   }
     * }
     */

    const userData = {
      id: role === "Admin" ? "USR-001" : "USR-002",
      name:
        role === "Admin"
          ? "Siddhi Singh"
          : "Rahul Sharma",
      email,
      role,
    };

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    } else {
      alert("Logged in successfully!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <h2>Sales Analytics</h2>

          <p>
            Sign in to your business intelligence dashboard
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <Mail
                size={18}
                className="input-icon"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock
                size={18}
                className="input-icon"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="input-group">
            <label>Login Role</label>

            <div className="role-selector">

              {/* Admin */}
              <button
                type="button"
                className={`role-option ${
                  role === "Admin"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setRole("Admin")
                }
              >
                <ShieldCheck size={17} />

                <div>
                  <strong>Admin</strong>
                  <span>
                    Full system access
                  </span>
                </div>
              </button>

              {/* Analyst */}
              <button
                type="button"
                className={`role-option ${
                  role === "Analyst"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setRole("Analyst")
                }
              >
                <BarChart3 size={17} />

                <div>
                  <strong>Analyst</strong>
                  <span>
                    Analytics access
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-submit-btn"
          >
            <span>
              Sign in as {role}
            </span>

            <ArrowRight size={18} />
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;