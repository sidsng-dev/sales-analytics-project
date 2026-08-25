import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Percent,
  Bot,
  Boxes,
  UserCog,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Sales Analytics</h2>
        <span>Business Intelligence</span>
      </div>

      <div className="sidebar-menu-group">
        <span className="menu-label">Main Menu</span>

        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* Products */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Package size={18} />
          <span>Products</span>
        </NavLink>

        {/* Categories */}
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Layers size={18} />
          <span>Categories</span>
        </NavLink>

        {/* Customers */}
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Users size={18} />
          <span>Customers</span>
        </NavLink>

        {/* Discount Analysis */}
        <NavLink
          to="/discounts"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Percent size={18} />
          <span>Discount Analysis</span>
        </NavLink>

        {/* Inventory */}
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Boxes size={18} />
          <span>Inventory</span>
        </NavLink>

        {/* =================================================
            ADMIN ONLY
            ================================================= */}
        {isAdmin && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "sidebar-item active"
                : "sidebar-item"
            }
          >
            <UserCog size={18} />
            <span>User Management</span>
          </NavLink>
        )}

        {/* AI Business Analyst */}
        <NavLink
          to="/ai-analyst"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Bot size={18} />
          <span>AI Business Analyst</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;