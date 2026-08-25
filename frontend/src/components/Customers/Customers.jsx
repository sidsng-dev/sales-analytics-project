import React, { useMemo, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Edit3,
  Trash2,
  X,
  Save,
} from "lucide-react";
import "./Customers.css";

const initialCustomers = [
  {
    id: "#CUST-101",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    orders: 14,
    totalSpent: 4850,
    status: "Active",
  },
  {
    id: "#CUST-102",
    name: "Ananya Patel",
    email: "ananya.patel@example.com",
    phone: "+91 91234 56789",
    orders: 9,
    totalSpent: 3420,
    status: "Active",
  },
  {
    id: "#CUST-103",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 99887 76655",
    orders: 5,
    totalSpent: 1890,
    status: "Inactive",
  },
  {
    id: "#CUST-104",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+91 94433 22110",
    orders: 21,
    totalSpent: 7640,
    status: "Active",
  },
  {
    id: "#CUST-105",
    name: "Aman Verma",
    email: "aman.verma@example.com",
    phone: "+91 95544 33221",
    orders: 2,
    totalSpent: 599,
    status: "New",
  },
];

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search) ||
        customer.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const openAddModal = () => {
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "New",
    });

    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "New",
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
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name || !email || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    const duplicateEmail = customers.some(
      (customer) =>
        customer.email.toLowerCase() === email.toLowerCase() &&
        customer.id !== editingCustomer?.id
    );

    if (duplicateEmail) {
      alert("A customer with this email already exists.");
      return;
    }

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                name,
                email,
                phone,
                status: formData.status,
              }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: `#CUST-${100 + customers.length + 1}`,
        name,
        email,
        phone,
        orders: 0,
        totalSpent: 0,
        status: formData.status,
      };

      setCustomers((prev) => [newCustomer, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`
    );

    if (!confirmed) return;

    setCustomers((prev) =>
      prev.filter((item) => item.id !== customer.id)
    );
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div className="customers-title">
          <div className="customers-title-icon">
            <Users size={20} />
          </div>

          <div>
            <h1>Customers</h1>
            <p>
              View and manage your store's customer database and
              activity
            </p>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Controls */}
      <div className="customers-controls">
        <div className="search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm("")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="filter-wrapper">
          <Filter size={16} />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Segments</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="New">New</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="customers-list-card">
        <div className="customers-list-header">
          <div>
            <h3>All Customers</h3>
            <p>
              {filteredCustomers.length} customer
              {filteredCustomers.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="customers-table-wrapper">
          <div className="customers-table">
            {/* Header */}
            <div className="table-head customer-grid-layout">
              <span>Customer Name</span>
              <span>Contact Info</span>
              <span>Orders</span>
              <span>Total Spent</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {filteredCustomers.map((customer) => {
              const initials = customer.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  className="customer-row customer-grid-layout"
                  key={customer.id}
                >
                  {/* Customer */}
                  <div className="customer-info">
                    <div className="customer-avatar-cell">
                      {initials}
                    </div>

                    <div className="customer-name-wrapper">
                      <strong>{customer.name}</strong>

                      <span className="customer-id">
                        {customer.id}
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="contact-info-cell">
                    <span>
                      <Mail size={12} />
                      {customer.email}
                    </span>

                    <span>
                      <Phone size={12} />
                      {customer.phone}
                    </span>
                  </div>

                  {/* Orders */}
                  <span className="orders-cell">
                    {customer.orders} orders
                  </span>

                  {/* Total */}
                  <strong className="revenue">
                    {formatCurrency(customer.totalSpent)}
                  </strong>

                  {/* Status */}
                  <div>
                    <span
                      className={`status-badge ${customer.status.toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {customer.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="action-buttons">
                    <button
                      className="action-icon-btn"
                      title="Edit Customer"
                      onClick={() =>
                        openEditModal(customer)
                      }
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      className="action-icon-btn delete"
                      title="Delete Customer"
                      onClick={() =>
                        handleDelete(customer)
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
              <div className="no-results">
                <Users size={30} />
                <h4>No customers found</h4>
                <p>
                  Try changing your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="customer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingCustomer
                    ? "Edit Customer"
                    : "Add New Customer"}
                </h2>

                <p>
                  {editingCustomer
                    ? "Update customer information"
                    : "Add a new customer to your database"}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="customer-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>
                  Customer Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email Address <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="customer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Customer Segment</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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

                  {editingCustomer
                    ? "Update Customer"
                    : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;