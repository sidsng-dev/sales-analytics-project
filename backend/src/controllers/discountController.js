const Discount = require("../models/Discount");

// GET all discounts
const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: discounts.length,
      discounts,
    });
  } catch (error) {
    console.error("Get discounts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch discounts",
    });
  }
};

// GET discount by ID
const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      discount,
    });
  } catch (error) {
    console.error("Get discount error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch discount",
    });
  }
};

// CREATE discount
const createDiscount = async (req, res) => {
  try {
    const {
      discountId,
      campaignName,
      promoCode,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate,
      endDate,
    } = req.body;

    if (
      !discountId ||
      !campaignName ||
      !promoCode ||
      discountValue === undefined ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Discount ID, campaign name, promo code, discount value, start date and end date are required",
      });
    }

    const existingDiscount = await Discount.findOne({
      $or: [{ discountId }, { promoCode }],
    });

    if (existingDiscount) {
      return res.status(409).json({
        success: false,
        message: "Discount ID or promo code already exists",
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (
      discountType === "Percentage" &&
      Number(discountValue) > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    const discount = await Discount.create({
      discountId,
      campaignName,
      promoCode,
      discountType: discountType || "Percentage",
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || 0,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Discount created successfully",
      discount,
    });
  } catch (error) {
    console.error("Create discount error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create discount",
    });
  }
};

// UPDATE discount
const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Discount updated successfully",
      discount,
    });
  } catch (error) {
    console.error("Update discount error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update discount",
    });
  }
};

// DELETE discount
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error) {
    console.error("Delete discount error:", error);

    res.status(500).json({
      success: false,
      message: "Discount deleted successfully",
    });
  }
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};