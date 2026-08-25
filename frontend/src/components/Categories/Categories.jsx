import React, { useMemo, useState } from "react";
import {
  Tags,
  Plus,
  Search,
  Edit3,
  Trash2,
  Layers,
  ShoppingBag,
  X,
  Save,
} from "lucide-react";
import "./Categories.css";

const initialCategories = [
  {
    id: "#CAT-01",
    name: "Electronics",
    description: "Gadgets, audio devices, and electronic hardware",
    productsCount: 142,
    revenueShare: "38%",
  },
  {
    id: "#CAT-02",
    name: "Computers",
    description: "Laptops, desktops, monitors, and components",
    productsCount: 85,
    revenueShare: "25%",
  },
  {
    id: "#CAT-03",
    name: "Accessories",
    description: "Keyboards, mice, hubs, and desk accessories",
    productsCount: 210,
    revenueShare: "20%",
  },
  {
    id: "#CAT-04",
    name: "Mobiles",
    description: "Smartphones, tablets, and mobile add-ons",
    productsCount: 64,
    revenueShare: "17%",
  },
];

function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const filteredCategories = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(search) ||
        category.description.toLowerCase().includes(search) ||
        category.id.toLowerCase().includes(search)
    );
  }, [categories, searchTerm]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
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
    const description = formData.description.trim();

    if (!name) {
      alert("Category name is required.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== editingCategory?.id
    );

    if (duplicate) {
      alert("A category with this name already exists.");
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name,
                description,
              }
            : category
        )
      );
    } else {
      const newCategory = {
        id: `#CAT-${String(categories.length + 1).padStart(2, "0")}`,
        name,
        description,
        productsCount: 0,
        revenueShare: "0%",
      };

      setCategories((prev) => [newCategory, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (category) => {
    if (category.productsCount > 0) {
      const confirmed = window.confirm(
        `"${category.name}" contains ${category.productsCount} products.\n\nAre you sure you want to delete this category?`
      );

      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );

      if (!confirmed) return;
    }

    setCategories((prev) =>
      prev.filter((item) => item.id !== category.id)
    );
  };

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <div className="categories-title">
          <div className="categories-title-icon">
            <Tags size={20} />
          </div>

          <div>
            <h1>Categories</h1>
            <p>
              Organize and manage store inventory categories
            </p>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="categories-controls">
        <div className="search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search categories..."
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
      </div>

      {/* Categories Card */}
      <div className="categories-list-card">
        <div className="categories-list-header">
          <div>
            <h3>All Categories</h3>
            <p>
              {filteredCategories.length} categor
              {filteredCategories.length !== 1 ? "ies" : "y"} found
            </p>
          </div>
        </div>

        <div className="categories-table-wrapper">
          <div className="categories-table">
            {/* Table Header */}
            <div className="table-head category-grid-layout">
              <span>Category Name & ID</span>
              <span>Description</span>
              <span>Products Count</span>
              <span>Revenue Share</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {filteredCategories.map((category) => (
              <div
                className="category-row category-grid-layout"
                key={category.id}
              >
                {/* Category */}
                <div className="category-info">
                  <div className="category-icon-wrapper">
                    <Layers size={16} />
                  </div>

                  <div className="category-name-wrapper">
                    <strong>{category.name}</strong>
                    <span className="category-id">
                      {category.id}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <span className="category-desc">
                  {category.description || "No description"}
                </span>

                {/* Product Count */}
                <div className="units-cell">
                  <ShoppingBag size={14} />
                  <span>{category.productsCount} items</span>
                </div>

                {/* Revenue */}
                <strong className="revenue">
                  {category.revenueShare}
                </strong>

                {/* Actions */}
                <div className="action-buttons">
                  <button
                    className="action-icon-btn"
                    title="Edit Category"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    className="action-icon-btn delete"
                    title="Delete Category"
                    onClick={() => handleDelete(category)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <div className="no-results">
                <Tags size={30} />
                <h4>No categories found</h4>
                <p>
                  Try changing your search or add a new category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add New Category"}
                </h2>

                <p>
                  {editingCategory
                    ? "Update category information"
                    : "Create a new product category"}
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
              className="category-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>
                  Category Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Electronics"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Enter category description..."
                  value={formData.description}
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

                  {editingCategory
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;