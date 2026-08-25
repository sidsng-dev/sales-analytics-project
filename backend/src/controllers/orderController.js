const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// GET all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "customerId name email")
      .populate("items.product", "productId name price")
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// GET order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "customerId name email")
      .populate("items.product", "productId name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// CREATE order
const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      customer,
      items,
      discountAmount = 0,
      taxAmount = 0,
      paymentMethod = "Other",
      paymentStatus = "Paid",
      orderStatus = "Completed",
      orderDate,
    } = req.body;

    if (!orderId || !customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order ID, customer and at least one item are required",
      });
    }

    const existingOrder = await Order.findOne({ orderId });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "Order ID already exists",
      });
    }

    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice ?? product.price);
      const discount = Number(item.discount ?? 0);

      const itemTotal =
        quantity * unitPrice - discount;

      subtotal += itemTotal;

      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity,
        unitPrice,
        discount,
        total: itemTotal,
      });
    }

    const totalAmount =
      subtotal - Number(discountAmount) + Number(taxAmount);

    if (totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Order total cannot be negative",
      });
    }

    const order = await Order.create({
      orderId,
      customer,
      items: processedItems,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      orderDate: orderDate || new Date(),
    });

    // Update product stock
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Update customer statistics
    await Customer.findByIdAndUpdate(customer, {
      $inc: {
        orders: 1,
        totalSpent: totalAmount,
      },
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "customerId name email")
      .populate("items.product", "productId name price");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// UPDATE order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customer", "customerId name email")
      .populate("items.product", "productId name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};