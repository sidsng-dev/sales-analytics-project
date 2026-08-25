const Transaction = require("../models/Transaction");
const Order = require("../models/Order");
const Customer = require("../models/Customer");

// GET all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("order", "orderId totalAmount")
      .populate("customer", "customerId name email")
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

// GET transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("order", "orderId totalAmount")
      .populate("customer", "customerId name email");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
    });
  }
};

// CREATE transaction
const createTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      order,
      customer,
      type,
      amount,
      paymentMethod,
      status,
      transactionDate,
      description,
    } = req.body;

    if (!transactionId || !type || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID, type and amount are required",
      });
    }

    const existingTransaction = await Transaction.findOne({
      transactionId,
    });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message: "Transaction ID already exists",
      });
    }

    if (order) {
      const orderExists = await Order.findById(order);

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    if (customer) {
      const customerExists = await Customer.findById(customer);

      if (!customerExists) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
    }

    const transaction = await Transaction.create({
      transactionId,
      order: order || null,
      customer: customer || null,
      type,
      amount,
      paymentMethod: paymentMethod || "Other",
      status: status || "Completed",
      transactionDate: transactionDate || new Date(),
      description: description || "",
    });

    const populatedTransaction = await Transaction.findById(
      transaction._id
    )
      .populate("order", "orderId totalAmount")
      .populate("customer", "customerId name email");

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
    });
  }
};

// UPDATE transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("order", "orderId totalAmount")
      .populate("customer", "customerId name email");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update transaction",
    });
  }
};

// DELETE transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};