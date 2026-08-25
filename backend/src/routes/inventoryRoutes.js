const express = require("express");

const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  restockProduct,
  deleteInventory,
} = require("../controllers/inventoryController");

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
  getInventory
);

router.get(
  "/:id",
  protect,
  authorize("admin", "analyst"),
  getInventoryById
);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createInventory
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateInventory
);

router.patch(
  "/:id/restock",
  protect,
  authorize("admin"),
  restockProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteInventory
);

module.exports = router;