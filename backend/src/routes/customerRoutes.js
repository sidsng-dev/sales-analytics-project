const express = require("express");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

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
  getCustomers
);

router.get(
  "/:id",
  protect,
  authorize("admin", "analyst"),
  getCustomerById
);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createCustomer
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCustomer
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCustomer
);

module.exports = router;