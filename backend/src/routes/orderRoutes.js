const express = require("express");

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

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
  getOrders
);

router.get(
  "/:id",
  protect,
  authorize("admin", "analyst"),
  getOrderById
);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createOrder
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateOrder
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

module.exports = router;