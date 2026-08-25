import React, { useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  X,
  Save,
} from "lucide-react";
import "./Products.css";

const initialProducts = [
  {
    id: "#PRD-301",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 149,
    stock: 342,
    minStock: 50,
    reorderLevel: 100,
    description: "Premium wireless headphones",
  },
  {
    id: "#PRD-302",
    name: "Gaming Laptop",
    category: "Computers",
    price: 1249,
    stock: 86,
    minStock: 20,
    reorderLevel: 40,
    description: "High-performance gaming laptop",
  },
  {
    id: "#PRD-303",
    name: "Smartphone Pro",
    category: "Mobiles",
    price: 899,
    stock: 12,
    minStock: 20,
    reorderLevel: 30,
    description: "Latest generation smartphone",
  },
  {
    id: "#PRD-304",
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 129,
    stock: 218,
    minStock: 40,
    reorderLevel: 80,
    description: "RGB mechanical keyboard",
  },
  {
    id: "#PRD-305",
    name: "Smart Watch",
    category: "Accessories",
    price: 299,
    stock: 0,
    minStock: 15,
    reorderLevel: 30,
    description: "Smart fitness watch",
  },
];

const getStatus = (stock, minStock) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= minStock) return "Low Stock";
  return "In Stock";
};

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minStock: "",
    reorderLevel: "",
    description: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.id.toLowerCase().includes(search);

      const status = getStatus(product.stock, product.minStock);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const openAddModal = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      minStock: "",
      reorderLevel: "",
      description: "",
    });

    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      reorderLevel: product.reorderLevel,
      description: product.description || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
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

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      minStock:
        formData.minStock === "" ? 0 : Number(formData.minStock),
      reorderLevel:
        formData.reorderLevel === ""
          ? 0
          : Number(formData.reorderLevel),
      description: formData.description.trim(),
    };

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...productData,
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: `#PRD-${300 + products.length + 1}`,
        ...productData,
      };

      setProducts((prev) => [newProduct, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts((prev) =>
      prev.filter((item) => item.id !== product.id)
    );
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="products-title">
          <div className="products-title-icon">
            <Package size={20} />
          </div>

          <div>
            <h1>Products</h1>
            <p>
              Manage your inventory, pricing, and product stock levels
            </p>
          </div>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <Plus size={17} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Controls */}
      <div className="products-controls">
        <div className="search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
              type="button"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="filter-wrapper">
          <Filter size={16} />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="products-list-card">
        <div className="products-list-header">
          <div>
            <h3>All Products</h3>
            <p>
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="product-table-wrapper">
          <div className="product-table">
            {/* Table Header */}
            <div className="table-head product-grid-layout">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {filteredProducts.map((product) => {
              const status = getStatus(
                product.stock,
                product.minStock
              );

              return (
                <div
                  className="product-row product-grid-layout"
                  key={product.id}
                >
                  {/* Product */}
                  <div className="product-info">
                    <div className="product-icon">
                      <Package size={16} />
                    </div>

                    <div className="product-name-wrapper">
                      <strong>{product.name}</strong>
                      <span className="product-id-tag">
                        {product.id}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="category-text">
                    {product.category}
                  </span>

                  {/* Price */}
                  <strong className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  {/* Stock */}
                  <span className="stock-value">
                    {product.stock} units
                  </span>

                  {/* Status */}
                  <div>
                    <span
                      className={`status-badge ${getStatusClass(
                        status
                      )}`}
                    >
                      <span className="status-dot" />
                      {status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="action-buttons">
                    <button
                      className="action-icon-btn"
                      title="Edit Product"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      className="action-icon-btn delete"
                      title="Delete Product"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="no-results">
                <Package size={30} />
                <h4>No products found</h4>
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
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information"
                    : "Add a new product to your inventory"}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeModal}
                type="button"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                {/* Product Name */}
                <div className="form-group full-width">
                  <label>
                    Product Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label>
                    Category <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Electronics"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Price */}
                <div className="form-group">
                  <label>
                    Price <span>*</span>
                  </label>

                  <div className="input-with-prefix">
                    <span>₹</span>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="form-group">
                  <label>
                    Current Stock <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Minimum Stock */}
                <div className="form-group">
                  <label>Minimum Stock</label>

                  <input
                    type="number"
                    name="minStock"
                    min="0"
                    placeholder="e.g. 20"
                    value={formData.minStock}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Reorder Level */}
                <div className="form-group">
                  <label>Reorder Level</label>

                  <input
                    type="number"
                    name="reorderLevel"
                    min="0"
                    placeholder="e.g. 40"
                    value={formData.reorderLevel}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Enter product description..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Modal Footer */}
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
                  className="primary-btn save-btn"
                >
                  <Save size={16} />

                  {editingProduct
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;