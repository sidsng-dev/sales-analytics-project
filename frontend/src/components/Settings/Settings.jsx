import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Settings.css";

function Settings() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  const [fullName, setFullName] = useState(
    user?.name || "Siddhi Singh"
  );

  const [email, setEmail] = useState(
    user?.email || "siddhi.singh@example.com"
  );

  const [saved, setSaved] = useState(false);

  const role =
    user?.role || "Admin";

  const roleName =
    role === "Admin"
      ? "Administrator"
      : "Business Analyst";

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">

      {/* PAGE HEADER */}
      <div className="settings-header">
        <h1>Account Settings</h1>

        <p>
          Manage your profile preferences, security,
          and application settings
        </p>
      </div>

      <div className="settings-container">

        {/* LEFT NAVIGATION */}
        <div className="settings-nav">

          <button
            className={
              activeTab === "profile"
                ? "settings-nav-btn active"
                : "settings-nav-btn"
            }
            onClick={() => setActiveTab("profile")}
          >
            <User size={17} />
            <span>Profile Details</span>
          </button>

          <button
            className={
              activeTab === "notifications"
                ? "settings-nav-btn active"
                : "settings-nav-btn"
            }
            onClick={() =>
              setActiveTab("notifications")
            }
          >
            <Bell size={17} />
            <span>Notifications</span>
          </button>

          <button
            className={
              activeTab === "security"
                ? "settings-nav-btn active"
                : "settings-nav-btn"
            }
            onClick={() => setActiveTab("security")}
          >
            <Shield size={17} />
            <span>Security & Access</span>
          </button>

          <button
            className={
              activeTab === "appearance"
                ? "settings-nav-btn active"
                : "settings-nav-btn"
            }
            onClick={() =>
              setActiveTab("appearance")
            }
          >
            <Palette size={17} />
            <span>Appearance</span>
          </button>

        </div>

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="settings-card">

            <div className="settings-card-header">
              <h2>Profile Information</h2>

              <p>
                Update your personal account details
              </p>
            </div>

            <div className="settings-line" />

            <div className="settings-form">

              <div className="settings-field">
                <label>Full Name</label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                />
              </div>

              <div className="settings-field">
                <label>Email Address</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="settings-field">
                <label>Access Role</label>

                <div className="role-display">
                  <span>{roleName}</span>

                  <span
                    className={
                      role === "Admin"
                        ? "role-badge admin"
                        : "role-badge analyst"
                    }
                  >
                    {role}
                  </span>
                </div>
              </div>

            </div>

            <div className="settings-line" />

            <div className="settings-actions">

              {saved && (
                <span className="saved-message">
                  <CheckCircle size={15} />
                  Changes saved
                </span>
              )}

              <button
                className="save-settings-btn"
                onClick={handleSave}
              >
                <Save size={15} />
                Save Changes
              </button>

            </div>

          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="settings-card">

            <div className="settings-card-header">
              <h2>Notifications</h2>

              <p>
                Manage your notification preferences
              </p>
            </div>

            <div className="settings-line" />

            <div className="notification-settings">

              <div className="notification-setting">
                <div>
                  <strong>Low Stock Alerts</strong>

                  <span>
                    Receive notifications when products
                    reach critical stock levels.
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                />
              </div>

              <div className="notification-setting">
                <div>
                  <strong>Sales Reports</strong>

                  <span>
                    Receive periodic sales analytics reports.
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                />
              </div>

              <div className="notification-setting">
                <div>
                  <strong>System Notifications</strong>

                  <span>
                    Receive important application updates.
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                />
              </div>

            </div>

          </div>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <div className="settings-card">

            <div className="settings-card-header">
              <h2>Security & Access</h2>

              <p>
                Manage your account security and access
              </p>
            </div>

            <div className="settings-line" />

            <div className="security-settings">

              <div className="security-item">
                <Shield size={18} />

                <div>
                  <strong>Current Role</strong>
                  <span>{roleName}</span>
                </div>
              </div>

              <div className="security-item">
                <User size={18} />

                <div>
                  <strong>Account</strong>
                  <span>
                    {user?.email}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* APPEARANCE */}
        {activeTab === "appearance" && (
          <div className="settings-card">

            <div className="settings-card-header">
              <h2>Appearance</h2>

              <p>
                Customize the application appearance
              </p>
            </div>

            <div className="settings-line" />

            <div className="appearance-setting">

              <Palette size={20} />

              <div>
                <strong>Dark Mode</strong>

                <span>
                  Sales Analytics currently uses
                  the dark dashboard theme.
                </span>
              </div>

              <span className="appearance-status">
                Active
              </span>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Settings;