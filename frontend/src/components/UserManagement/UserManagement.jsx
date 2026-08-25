import React, { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  X,
  Save,
  ShieldCheck,
  BarChart3,
  UserCheck,
  UserX,
} from "lucide-react";

import "./UserManagement.css";

const initialUsers = [
  {
    id: "#USR-001",
    name: "Siddhi Singh",
    email: "siddhi@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Today, 01:42 AM",
  },
  {
    id: "#USR-002",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Analyst",
    status: "Active",
    lastLogin: "Today, 12:18 AM",
  },
  {
    id: "#USR-003",
    name: "Priya Verma",
    email: "priya@example.com",
    role: "Analyst",
    status: "Active",
    lastLogin: "Yesterday, 08:45 PM",
  },
  {
    id: "#USR-004",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    role: "Analyst",
    status: "Inactive",
    lastLogin: "Aug 14, 2026",
  },
  {
    id: "#USR-005",
    name: "Neha Kapoor",
    email: "neha@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Aug 17, 2026",
  },
];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Analyst",
    status: "Active",
  });

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "Admin").length,
      analysts: users.filter((user) => user.role === "Analyst").length,
      active: users.filter((user) => user.status === "Active").length,
      inactive: users.filter((user) => user.status === "Inactive").length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const openAddModal = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      role: "Analyst",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      role: "Analyst",
      status: "Active",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !email) {
      alert("Name and email are required.");
      return;
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === email &&
        user.id !== editingUser?.id
    );

    if (emailExists) {
      alert("A user with this email already exists.");
      return;
    }

    const userData = {
      name,
      email,
      role: formData.role,
      status: formData.status,
    };

    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...userData,
              }
            : user
        )
      );
    } else {
      const newUser = {
        id: `#USR-${String(users.length + 1).padStart(3, "0")}`,
        ...userData,
        lastLogin: "Never",
      };

      setUsers((prev) => [newUser, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (user) => {
    if (user.id === "#USR-001") {
      alert("The primary admin account cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );

    if (!confirmed) return;

    setUsers((prev) =>
      prev.filter((item) => item.id !== user.id)
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="user-management-page">
      {/* Header */}
      <div className="user-management-header">
        <div className="user-management-title">
          <div className="user-management-title-icon">
            <Users size={21} />
          </div>

          <div>
            <h1>User Management</h1>
            <p>
              Manage users, roles and access permissions
            </p>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <UserPlus size={17} />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="user-stat-icon purple">
            <Users size={19} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span>Admin Users</span>
            <strong>{stats.admins}</strong>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon cyan">
            <BarChart3 size={19} />
          </div>

          <div>
            <span>Analysts</span>
            <strong>{stats.analysts}</strong>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Active Users</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon red">
            <UserX size={19} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{stats.inactive}</strong>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="users-card">
        <div className="users-card-header">
          <div>
            <h3>System Users</h3>
            <p>
              Control user accounts and role assignments
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="users-controls">
          <div className="users-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search users by name, email or ID..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="users-filter">
            <Filter size={15} />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>

          <div className="users-filter">
            <UserCheck size={15} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {(searchTerm ||
            roleFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="users-table-wrapper">
          <div className="users-table">
            <div className="users-table-head users-grid">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Last Login</span>
              <span>Actions</span>
            </div>

            {filteredUsers.map((user) => (
              <div
                className="user-row users-grid"
                key={user.id}
              >
                {/* User */}
                <div className="user-info">
                  <div className="user-avatar">
                    {getInitials(user.name)}
                  </div>

                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <small>{user.id}</small>
                  </div>
                </div>

                {/* Role */}
                <span
                  className={`role-badge ${user.role.toLowerCase()}`}
                >
                  {user.role === "Admin" ? (
                    <ShieldCheck size={13} />
                  ) : (
                    <BarChart3 size={13} />
                  )}

                  {user.role}
                </span>

                {/* Status */}
                <span
                  className={`user-status ${user.status.toLowerCase()}`}
                >
                  <span className="status-dot"></span>
                  {user.status}
                </span>

                {/* Last Login */}
                <span className="last-login">
                  {user.lastLogin}
                </span>

                {/* Actions */}
                <div className="user-actions">
                  <button
                    className="action-icon-btn"
                    title="Edit User"
                    onClick={() =>
                      openEditModal(user)
                    }
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    className="action-icon-btn delete"
                    title="Delete User"
                    onClick={() =>
                      handleDelete(user)
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="users-empty">
                <Users size={32} />

                <h4>No users found</h4>

                <p>
                  Try changing your search or filter
                  criteria.
                </p>

                <button
                  className="secondary-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingUser
                    ? "Edit User"
                    : "Add New User"}
                </h2>

                <p>
                  {editingUser
                    ? "Update user account and role"
                    : "Create a new system user"}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeModal}
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="user-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group full-width">
                <label>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Email Address <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>User Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Analyst">Analyst</option>
                </select>
              </div>

              <div className="form-group">
                <label>Account Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="role-info-box full-width">
                <div>
                  <ShieldCheck size={16} />
                  <strong>Admin</strong>
                </div>

                <p>
                  Can manage users and perform all
                  administrative operations.
                </p>

                <div>
                  <BarChart3 size={16} />
                  <strong>Analyst</strong>
                </div>

                <p>
                  Can view and analyze business data but
                  cannot manage users or critical
                  administrative operations.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <Save size={16} />

                  {editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;