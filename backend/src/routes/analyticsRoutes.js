const express = require("express");

const {
  getDashboardSummary,
  getSalesOverview,
  getSalesByCategory,
  getTopProducts,
  getCustomerAnalytics,
  getInventoryAnalytics,
  getRecentTransactions,
} = require("../controllers/analyticsController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorize("admin", "analyst"),
  getDashboardSummary
);

router.get(
  "/sales-overview",
  protect,
  authorize("admin", "analyst"),
  getSalesOverview
);

router.get(
  "/sales-by-category",
  protect,
  authorize("admin", "analyst"),
  getSalesByCategory
);

router.get(
  "/top-products",
  protect,
  authorize("admin", "analyst"),
  getTopProducts
);

router.get(
  "/customers",
  protect,
  authorize("admin", "analyst"),
  getCustomerAnalytics
);

router.get(
  "/inventory",
  protect,
  authorize("admin", "analyst"),
  getInventoryAnalytics
);

router.get(
  "/recent-transactions",
  protect,
  authorize("admin", "analyst"),
  getRecentTransactions
);

module.exports = router;