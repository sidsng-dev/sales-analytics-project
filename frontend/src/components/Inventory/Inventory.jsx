import React, { useMemo, useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Boxes,
  ArrowDownToLine,
} from "lucide-react";

import "./Inventory.css";

const initialInventory = [
  {
    id: "#PRD-101",
    name: "Wireless Headphones",
    category: "Electronics",
    sku: "WH-1001",
    currentStock: 45,
    minimumStock: 20,
    reorderLevel: 30,
    price: 2499,
  },
  {
    id: "#PRD-102",
    name: "Mechanical Keyboard",
    category: "Accessories",
    sku: "MK-1002",
    currentStock: 8,
    minimumStock: 15,
    reorderLevel: 20,
    price: 3499,
  },
  {
    id: "#PRD-103",
    name: "Wireless Mouse",
    category: "Accessories",
    sku: "WM-1003",
    currentStock: 2,
    minimumStock: 10,
    reorderLevel: 15,
    price: 1299,
  },
  {
    id: "#PRD-104",
    name: "24-inch Monitor",
    category: "Computers",
    sku: "MN-1004",
    currentStock: 0,
    minimumStock: 10,
    reorderLevel: 15,
    price: 12999,
  },
  {
    id: "#PRD-105",
    name: "Laptop Stand",
    category: "Accessories",
    sku: "LS-1005",
    currentStock: 28,
    minimumStock: 10,
    reorderLevel: 18,
    price: 1899,
  },
  {
    id: "#PRD-106",
    name: "USB-C Hub",
    category: "Electronics",
    sku: "UH-1006",
    currentStock: 12,
    minimumStock: 12,
    reorderLevel: 20,
    price: 2199,
  },
  {
    id: "#PRD-107",
    name: "Gaming Laptop",
    category: "Computers",
    sku: "GL-1007",
    currentStock: 6,
    minimumStock: 5,
    reorderLevel: 8,
    price: 74999,
  },
  {
    id: "#PRD-108",
    name: "Smartphone",
    category: "Mobiles",
    sku: "SP-1008",
    currentStock: 32,
    minimumStock: 15,
    reorderLevel: 22,
    price: 28999,
  },
];

function getStockStatus(item) {
  if (item.currentStock === 0) {
    return "Out of Stock";
  }

  if (item.currentStock <= item.minimumStock) {
    return "Critical";
  }

  if (item.currentStock <= item.reorderLevel) {
    return "Low Stock";
  }

  return "In Stock";
}

function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showStockModal, setShowStockModal] = useState(false);
  const [stockItem, setStockItem] = useState(null);
  const [stockAction, setStockAction] = useState("add");
  const [stockQuantity, setStockQuantity] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    sku: "",
    currentStock: "",
    minimumStock: "",
    reorderLevel: "",
    price: "",
  });

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(inventory.map((item) => item.category)),
    ];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return inventory.filter((item) => {
      const status = getStockStatus(item);

      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    inventory,
    searchTerm,
    statusFilter,
    categoryFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: inventory.length,

      inStock: inventory.filter(
        (item) => getStockStatus(item) === "In Stock"
      ).length,

      lowStock: inventory.filter(
        (item) => getStockStatus(item) === "Low Stock"
      ).length,

      critical: inventory.filter(
        (item) => getStockStatus(item) === "Critical"
      ).length,

      outOfStock: inventory.filter(
        (item) => getStockStatus(item) === "Out of Stock"
      ).length,

      totalUnits: inventory.reduce(
        (sum, item) => sum + item.currentStock,
        0
      ),
    };
  }, [inventory]);

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const openAddModal = () => {
    setEditingItem(null);

    setFormData({
      name: "",
      category: "Electronics",
      sku: "",
      currentStock: "",
      minimumStock: "",
      reorderLevel: "",
      price: "",
    });

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name,
      category: item.category,
      sku: item.sku,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      reorderLevel: item.reorderLevel,
      price: item.price,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);

    setFormData({
      name: "",
      category: "Electronics",
      sku: "",
      currentStock: "",
      minimumStock: "",
      reorderLevel: "",
      price: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const sku = formData.sku.trim().toUpperCase();

    if (!name || !sku) {
      alert("Product name and SKU are required.");
      return;
    }

    const currentStock = Number(formData.currentStock);
    const minimumStock = Number(formData.minimumStock);
    const reorderLevel = Number(formData.reorderLevel);
    const price = Number(formData.price);

    if (
      currentStock < 0 ||
      minimumStock < 0 ||
      reorderLevel < 0 ||
      price < 0
    ) {
      alert("Stock, levels and price cannot be negative.");
      return;
    }

    if (minimumStock > reorderLevel) {
      alert(
        "Minimum stock should not be greater than reorder level."
      );
      return;
    }

    const duplicateSku = inventory.some(
      (item) =>
        item.sku.toLowerCase() === sku.toLowerCase() &&
        item.id !== editingItem?.id
    );

    if (duplicateSku) {
      alert("A product with this SKU already exists.");
      return;
    }

    const productData = {
      name,
      category: formData.category,
      sku,
      currentStock,
      minimumStock,
      reorderLevel,
      price,
    };

    if (editingItem) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...productData,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: `#PRD-${100 + inventory.length + 1}`,
        ...productData,
      };

      setInventory((prev) => [newItem, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${item.name}" from inventory?`
    );

    if (!confirmed) return;

    setInventory((prev) =>
      prev.filter((inventoryItem) => inventoryItem.id !== item.id)
    );
  };

  const openStockModal = (item, action) => {
    setStockItem(item);
    setStockAction(action);
    setStockQuantity("");
    setShowStockModal(true);
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setStockItem(null);
    setStockQuantity("");
  };

  const handleStockUpdate = (e) => {
    e.preventDefault();

    const quantity = Number(stockQuantity);

    if (!quantity || quantity <= 0) {
      alert("Enter a valid quantity.");
      return;
    }

    if (!stockItem) return;

    if (
      stockAction === "remove" &&
      quantity > stockItem.currentStock
    ) {
      alert("You cannot remove more stock than available.");
      return;
    }

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== stockItem.id) return item;

        const updatedStock =
          stockAction === "add"
            ? item.currentStock + quantity
            : item.currentStock - quantity;

        return {
          ...item,
          currentStock: updatedStock,
        };
      })
    );

    closeStockModal();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
  };

  const getStatusIcon = (status) => {
    if (status === "In Stock") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "Low Stock") {
      return <AlertTriangle size={14} />;
    }

    if (status === "Critical") {
      return <AlertCircle size={14} />;
    }

    return <XCircle size={14} />;
  };

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <div className="inventory-title">
          <div className="inventory-title-icon">
            <Package size={20} />
          </div>

          <div>
            <h1>Inventory</h1>
            <p>
              Monitor stock levels and manage inventory
              availability
            </p>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          <span>Add Inventory Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="inventory-stats">
        <div className="inventory-stat-card">
          <div className="inventory-stat-icon purple">
            <Boxes size={19} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon green">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>In Stock</span>
            <strong>{stats.inStock}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon yellow">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{stats.lowStock}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon red">
            <AlertCircle size={19} />
          </div>

          <div>
            <span>Critical</span>
            <strong>{stats.critical}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon gray">
            <XCircle size={19} />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{stats.outOfStock}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon blue">
            <Package size={19} />
          </div>

          <div>
            <span>Total Units</span>
            <strong>{stats.totalUnits}</strong>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="inventory-card">
        <div className="inventory-card-header">
          <div>
            <h3>Stock Overview</h3>
            <p>
              Monitor current stock against minimum and reorder
              levels
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="inventory-controls">
          <div className="inventory-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search products, SKU or category..."
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

          <div className="inventory-filter">
            <Filter size={15} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>
          </div>

          <div className="inventory-filter">
            <Package size={15} />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              {categories.map((category) => (
                <option
                  value={category}
                  key={category}
                >
                  {category === "All"
                    ? "All Categories"
                    : category}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm ||
            statusFilter !== "All" ||
            categoryFilter !== "All") && (
            <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="inventory-table-wrapper">
          <div className="inventory-table">
            <div className="inventory-table-head inventory-grid">
              <span>Product</span>
              <span>Category</span>
              <span>Current Stock</span>
              <span>Min. Stock</span>
              <span>Reorder Level</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredInventory.map((item) => {
              const status = getStockStatus(item);

              return (
                <div
                  className="inventory-row inventory-grid"
                  key={item.id}
                >
                  {/* Product */}
                  <div className="inventory-product">
                    <div className="inventory-product-icon">
                      <Package size={16} />
                    </div>

                    <div>
                      <strong>{item.name}</strong>

                      <span>
                        {item.sku} · {item.id}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="inventory-category">
                    {item.category}
                  </span>

                  {/* Current Stock */}
                  <div className="stock-value">
                    <strong>{item.currentStock}</strong>
                    <span>units</span>
                  </div>

                  {/* Minimum */}
                  <span className="stock-limit">
                    {item.minimumStock}
                  </span>

                  {/* Reorder */}
                  <span className="stock-limit">
                    {item.reorderLevel}
                  </span>

                  {/* Status */}
                  <span
                    className={`inventory-status ${status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {getStatusIcon(status)}
                    {status}
                  </span>

                  {/* Actions */}
                  <div className="inventory-actions">
                    <button
                      className="stock-action-btn add"
                      title="Add Stock"
                      onClick={() =>
                        openStockModal(item, "add")
                      }
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      className="stock-action-btn remove"
                      title="Remove Stock"
                      onClick={() =>
                        openStockModal(item, "remove")
                      }
                    >
                      <ArrowDownToLine size={14} />
                    </button>

                    <button
                      className="action-icon-btn"
                      title="Edit"
                      onClick={() =>
                        openEditModal(item)
                      }
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      className="action-icon-btn delete"
                      title="Delete"
                      onClick={() =>
                        handleDelete(item)
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredInventory.length === 0 && (
              <div className="inventory-empty">
                <Package size={32} />

                <h4>No inventory items found</h4>

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

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="inventory-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingItem
                    ? "Edit Inventory Item"
                    : "Add Inventory Item"}
                </h2>

                <p>
                  {editingItem
                    ? "Update product inventory details"
                    : "Add a product to inventory"}
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
              className="inventory-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group full-width">
                <label>
                  Product Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Wireless Headphones"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Electronics">
                    Electronics
                  </option>
                  <option value="Computers">
                    Computers
                  </option>
                  <option value="Accessories">
                    Accessories
                  </option>
                  <option value="Mobiles">
                    Mobiles
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  SKU <span>*</span>
                </label>

                <input
                  type="text"
                  name="sku"
                  placeholder="e.g. WH-1009"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Stock</label>

                <input
                  type="number"
                  name="currentStock"
                  min="0"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Minimum Stock</label>

                <input
                  type="number"
                  name="minimumStock"
                  min="0"
                  value={formData.minimumStock}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Reorder Level</label>

                <input
                  type="number"
                  name="reorderLevel"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Unit Price</label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                />
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

                  {editingItem
                    ? "Update Inventory"
                    : "Save Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockModal && stockItem && (
        <div
          className="modal-overlay"
          onClick={closeStockModal}
        >
          <div
            className="stock-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {stockAction === "add"
                    ? "Add Stock"
                    : "Remove Stock"}
                </h2>

                <p>{stockItem.name}</p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeStockModal}
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="stock-form"
              onSubmit={handleStockUpdate}
            >
              <div className="current-stock-box">
                <span>Current Stock</span>
                <strong>
                  {stockItem.currentStock} units
                </strong>
              </div>

              <div className="form-group">
                <label>
                  Quantity <span>*</span>
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={stockQuantity}
                  onChange={(e) =>
                    setStockQuantity(e.target.value)
                  }
                  autoFocus
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeStockModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`primary-btn ${
                    stockAction === "remove"
                      ? "remove-stock-btn"
                      : ""
                  }`}
                >
                  {stockAction === "add" ? (
                    <Plus size={16} />
                  ) : (
                    <ArrowDownToLine size={16} />
                  )}

                  {stockAction === "add"
                    ? "Add Stock"
                    : "Remove Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;