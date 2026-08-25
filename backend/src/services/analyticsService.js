const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Inventory = require("../models/Inventory");

// Dashboard summary
const getDashboardSummary = async () => {
  const completedOrders = await Order.find({
    orderStatus: "Completed",
  }).lean();

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const totalOrders = completedOrders.length;

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const customers = await Customer.countDocuments({
    status: "active",
  });

  const products = await Product.countDocuments({
    status: "active",
  });

  const totalCost = await Promise.all(
    completedOrders.flatMap((order) =>
      order.items.map(async (item) => {
        const product = await Product.findById(item.product)
          .select("costPrice")
          .lean();

        return product
          ? product.costPrice * item.quantity
          : 0;
      })
    )
  );

  const cost = totalCost.reduce((sum, value) => sum + value, 0);

  const netProfit = totalRevenue - cost;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    activeCustomers: customers,
    activeProducts: products,
    netProfit,
  };
};

// Sales overview
const getSalesOverview = async (startDate, endDate) => {
  const match = {
    orderStatus: "Completed",
  };

  if (startDate || endDate) {
    match.orderDate = {};

    if (startDate) {
      match.orderDate.$gte = new Date(startDate);
    }

    if (endDate) {
      match.orderDate.$lte = new Date(endDate);
    }
  }

  return Order.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$orderDate",
          },
        },
        revenue: {
          $sum: "$totalAmount",
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

// Sales by category
const getSalesByCategory = async () => {
  return Order.aggregate([
    {
      $match: {
        orderStatus: "Completed",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: "$product.category",
        revenue: {
          $sum: "$items.total",
        },
        quantity: {
          $sum: "$items.quantity",
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);
};

// Top products
const getTopProducts = async () => {
  return Order.aggregate([
    {
      $match: {
        orderStatus: "Completed",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.product",
        productName: {
          $first: "$items.productName",
        },
        quantitySold: {
          $sum: "$items.quantity",
        },
        revenue: {
          $sum: "$items.total",
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

// Customer analytics
const getCustomerAnalytics = async () => {
  return Customer.aggregate([
    {
      $group: {
        _id: "$segment",
        customers: {
          $sum: 1,
        },
        totalSpent: {
          $sum: "$totalSpent",
        },
        totalOrders: {
          $sum: "$orders",
        },
      },
    },
    {
      $sort: {
        totalSpent: -1,
      },
    },
  ]);
};

// Inventory analytics
const getInventoryAnalytics = async () => {
  const inventory = await Inventory.find()
    .populate("product", "productId name category stock price")
    .lean();

  return inventory.map((item) => {
    const stock = item.product?.stock || 0;

    let status = "In Stock";

    if (stock === 0) {
      status = "Out of Stock";
    } else if (stock <= item.minimumStock) {
      status = "Critical";
    } else if (stock <= item.reorderLevel) {
      status = "Low Stock";
    }

    return {
      inventoryId: item.inventoryId,
      product: item.product,
      currentStock: stock,
      minimumStock: item.minimumStock,
      reorderLevel: item.reorderLevel,
      reorderQuantity: item.reorderQuantity,
      status,
    };
  });
};

// Recent transactions
const getRecentTransactions = async () => {
  return Transaction.find()
    .populate("customer", "name")
    .populate("order", "orderId")
    .sort({ transactionDate: -1 })
    .limit(10)
    .lean();
};

module.exports = {
  getDashboardSummary,
  getSalesOverview,
  getSalesByCategory,
  getTopProducts,
  getCustomerAnalytics,
  getInventoryAnalytics,
  getRecentTransactions,
};