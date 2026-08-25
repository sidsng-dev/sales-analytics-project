const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    minimumStock: {
      type: Number,
      min: 0,
      default: 10,
    },

    reorderLevel: {
      type: Number,
      min: 0,
      default: 20,
    },

    reorderQuantity: {
      type: Number,
      min: 0,
      default: 50,
    },

    reservedQuantity: {
      type: Number,
      min: 0,
      default: 0,
    },

    lastRestockedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Critical", "Out of Stock"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);