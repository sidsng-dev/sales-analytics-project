const express = require("express");

const {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} = require("../controllers/discountController");

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
  getDiscounts
);

router.get(
  "/:id",
  protect,
  authorize("admin", "analyst"),
  getDiscountById
);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createDiscount
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateDiscount
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteDiscount
);

module.exports = router;