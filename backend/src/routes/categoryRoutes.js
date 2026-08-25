const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin + Analyst
router.get(
  "/",
  protect,
  authorize("admin", "analyst"),
  getCategories
);

router.get(
  "/:id",
  protect,
  authorize("admin", "analyst"),
  getCategoryById
);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createCategory
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;