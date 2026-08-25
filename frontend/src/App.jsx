import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import {
  Bell,
  Settings as SettingsIcon,
  User,
  ChevronDown,
} from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import Categories from "./components/Categories/Categories";
import Customers from "./components/Customers/Customers";
import DiscountAnalysis from "./components/DiscountAnalysis/DiscountAnalysis";
import AiBusinessAnalyst from "./components/AiBusinessAnalyst/AiBusinessAnalyst";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login/Login";
import Inventory from "./components/Inventory/Inventory";
import UserManagement from "./components/UserManagement/UserManagement";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import "./App.css";

/* =========================================================
   NAVBAR
   ========================================================= */

function Navbar() {
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const location = useLocation();

  const { user, logout } = useAuth();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard Overview";

      case "/products":
        return "Products Management";

      case "/categories":
        return "Categories Hub";

      case "/customers":
        return "Customer Management";

      case "/discounts":
        return "Discount & Promo Analysis";

      case "/inventory":
        return "Inventory Management";

      case "/users":
        return "User Management";

      case "/ai-analyst":
        return "AI Business Analyst";

      case "/settings":
        return "Account Settings";

      default:
        return "Sales Analytics";
    }
  };

  const getInitials = () => {
    if (!user?.name) {
      return "SS";
    }

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <h2>{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="navbar-right">
        {/* =================================================
            NOTIFICATIONS
            ================================================= */}

        <div className="nav-dropdown-container">
          <button
            className="nav-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="badge-dot"></span>
          </button>

          {showNotifications && (
            <div className="dropdown-panel notification-panel">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <span>3 New</span>
              </div>

              <ul className="dropdown-list">
                <li>
                  <div>
                    <p>Low stock warning</p>
                    <small>
                      Galaxy Mobile inventory is critical
                    </small>
                  </div>
                </li>

                <li>
                  <div>
                    <p>Report Ready</p>
                    <small>
                      Q3 Sales analytics compiled
                    </small>
                  </div>
                </li>

                <li>
                  <div>
                    <p>Pipeline Synced</p>
                    <small>
                      Azure Synapse updated successfully
                    </small>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* =================================================
            PROFILE
            ================================================= */}

        <div className="nav-dropdown-container">
          <div
            className="profile-trigger"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="user-avatar-sm">
              {getInitials()}
            </div>

            <div className="profile-user-info">
              <span className="profile-name">
                {user?.name || "Siddhi Singh"}
              </span>

              <small className="profile-role">
                {user?.role || "Admin"}
              </small>
            </div>

            <ChevronDown
              size={14}
              className="chevron-icon"
            />
          </div>

          {showProfileMenu && (
            <div className="dropdown-panel profile-panel">
              <div className="profile-panel-header">
                <strong>
                  {user?.name || "Siddhi Singh"}
                </strong>

                <small>
                  {user?.email || "siddhi@example.com"}
                </small>

                <span className="profile-role-badge">
                  {user?.role || "Admin"}
                </span>
              </div>

              <div className="dropdown-divider"></div>

              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() =>
                  setShowProfileMenu(false)
                }
              >
                <User size={15} />
                My Profile
              </Link>

              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() =>
                  setShowProfileMenu(false)
                }
              >
                <SettingsIcon size={15} />
                Account Settings
              </Link>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item logout-btn"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   MAIN APPLICATION
   ========================================================= */

function AppContent() {
  const { isAuthenticated, login } = useAuth();

  /*
   * For now Login is still frontend/mock authentication.
   *
   * Later this callback will receive:
   *
   * {
   *   id,
   *   name,
   *   email,
   *   role,
   *   token
   * }
   *
   * from the backend API.
   */

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={(userData) => {
          /*
           * Temporary fallback:
           * Until Login.jsx sends a role, we use Admin.
           *
           * Later backend authentication will provide
           * the actual role.
           */

          login(
            userData || {
              name: "Siddhi Singh",
              email: "siddhi@example.com",
              role: "Admin",
            }
          );
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-pane">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* =================================================
                DASHBOARD
                ================================================= */}

            <Route
              path="/"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                PRODUCTS
                ================================================= */}

            <Route
              path="/products"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <Products />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                CATEGORIES
                ================================================= */}

            <Route
              path="/categories"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <Categories />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                CUSTOMERS
                ================================================= */}

            <Route
              path="/customers"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <Customers />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                DISCOUNT ANALYSIS
                ================================================= */}

            <Route
              path="/discounts"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <DiscountAnalysis />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                INVENTORY
                ================================================= */}

            <Route
              path="/inventory"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <Inventory />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                USER MANAGEMENT
                ADMIN ONLY
                ================================================= */}

            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                AI BUSINESS ANALYST
                ================================================= */}

            <Route
              path="/ai-analyst"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <AiBusinessAnalyst />
                </ProtectedRoute>
              }
            />

            {/* =================================================
                SETTINGS
                ================================================= */}

            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Analyst"]}
                >
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;