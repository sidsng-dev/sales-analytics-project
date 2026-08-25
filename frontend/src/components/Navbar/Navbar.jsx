import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ title = "Dashboard" }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="dashboard-navbar">
      {/* Left side: Page Title */}
      <div className="navbar-left">
        <h2>{title}</h2>
      </div>

      {/* Right side: Actions & User Controls */}
      <div className="navbar-right">
        
        {/* Notifications Icon with Badge */}
        <div className="nav-item-wrapper">
          <button 
            className="nav-icon-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
          >
            🔔
            <span className="notification-badge">3</span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu notification-dropdown">
              <h4>Notifications</h4>
              <ul>
                <li><span>📦</span> Galaxy Mobile stock is critical</li>
                <li><span>📊</span> Q3 Sales report generated</li>
                <li><span>🔄</span> Azure Synapse pipeline synced</li>
              </ul>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button 
          className="nav-icon-btn" 
          onClick={() => alert("Opening Settings panel...")} 
          title="Settings"
        >
          ⚙️
        </button>

        {/* Profile Dropdown */}
        <div className="nav-item-wrapper">
          <div 
            className="profile-trigger" 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="user-avatar-small">SS</div>
            <span className="user-profile-name">Siddhi Singh</span>
          </div>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown">
              <div className="dropdown-header">
                <strong>Siddhi Singh</strong>
                <small>siddhi@example.com</small>
              </div>
              <hr />
              <button className="dropdown-link" onClick={() => alert("Going to Profile...")}>👤 My Profile</button>
              <button className="dropdown-link" onClick={() => alert("Going to Settings...")}>⚙️ Account Settings</button>
              <hr />
              <button className="dropdown-link logout" onClick={() => alert("Logging out...")}>🚪 Logout</button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}