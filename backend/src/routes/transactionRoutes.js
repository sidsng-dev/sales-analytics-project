const express = require("express");

const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

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
  getTransactions
);

router.get(
  "/:id",
  protect,
  authorize("admin", "analyst"),
  getTransactionById
);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createTransaction
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateTransaction
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTransaction
);

module.exports = router;