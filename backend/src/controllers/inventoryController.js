const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

// Calculate inventory status
const calculateStatus = (stock, minimumStock, reorderLevel) => {
  if (stock === 0) {
    return "Out of Stock";
  }

  if (stock <= minimumStock) {
    return "Critical";
  }

  if (stock <= reorderLevel) {
    return "Low Stock";
  }

  return "In Stock";
};

// GET all inventory
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate(
        "product",
        "productId name category price stock status"
      )
      .sort({ createdAt: -1 });

    const result = inventory.map((item) => {
      const stock = item.product?.stock || 0;

      return {
        ...item.toObject(),
        currentStock: stock,
        status: calculateStatus(
          stock,
          item.minimumStock,
          item.reorderLevel
        ),
      };
    });

    res.status(200).json({
      success: true,
      count: result.length,
      inventory: result,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};

// GET inventory by ID
const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate(
      "product",
      "productId name category price stock status"
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    const stock = inventory.product?.stock || 0;

    res.status(200).json({
      success: true,
      inventory: {
        ...inventory.toObject(),
        currentStock: stock,
        status: calculateStatus(
          stock,
          inventory.minimumStock,
          inventory.reorderLevel
        ),
      },
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};

// CREATE inventory record
const createInventory = async (req, res) => {
  try {
    const {
      inventoryId,
      product,
      minimumStock,
      reorderLevel,
      reorderQuantity,
    } = req.body;

    if (!inventoryId || !product) {
      return res.status(400).json({
        success: false,
        message: "Inventory ID and product are required",
      });
    }

    const productExists = await Product.findById(product);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingInventory = await Inventory.findOne({
      $or: [{ inventoryId }, { product }],
    });

    if (existingInventory) {
      return res.status(409).json({
        success: false,
        message: "Inventory record already exists",
      });
    }

    const inventory = await Inventory.create({
      inventoryId,
      product,
      minimumStock: minimumStock ?? 10,
      reorderLevel: reorderLevel ?? 20,
      reorderQuantity: reorderQuantity ?? 50,
      lastRestockedAt: new Date(),
    });

    const populatedInventory = await Inventory.findById(
      inventory._id
    ).populate(
      "product",
      "productId name category price stock status"
    );

    res.status(201).json({
      success: true,
      message: "Inventory record created successfully",
      inventory: populatedInventory,
    });
  } catch (error) {
    console.error("Create inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create inventory record",
    });
  }
};

// UPDATE inventory settings
const updateInventory = async (req, res) => {
  try {
    const {
      minimumStock,
      reorderLevel,
      reorderQuantity,
      reservedQuantity,
    } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        minimumStock,
        reorderLevel,
        reorderQuantity,
        reservedQuantity,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "product",
      "productId name category price stock status"
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update inventory",
    });
  }
};

// RESTOCK PRODUCT
const restockProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Restock quantity must be greater than 0",
      });
    }

    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    const product = await Product.findById(inventory.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.stock += Number(quantity);
    await product.save();

    inventory.lastRestockedAt = new Date();
    await inventory.save();

    res.status(200).json({
      success: true,
      message: "Product restocked successfully",
      currentStock: product.stock,
    });
  } catch (error) {
    console.error("Restock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to restock product",
    });
  }
};

// DELETE inventory record
const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(
      req.params.id
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory record deleted successfully",
    });
  } catch (error) {
    console.error("Delete inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete inventory record",
    });
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  restockProduct,
  deleteInventory,
};