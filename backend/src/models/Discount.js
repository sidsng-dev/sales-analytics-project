const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    discountId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    campaignName: {
      type: String,
      required: true,
      trim: true,
    },

    promoCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true,
    },

    discountType: {
      type: String,
      enum: ["Percentage", "Fixed Amount"],
      default: "Percentage",
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    redemptions: {
      type: Number,
      default: 0,
      min: 0,
    },

    revenueGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Expired", "Scheduled"],
      default: "Active",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Discount", discountSchema);