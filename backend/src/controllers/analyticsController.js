const analyticsService = require("../services/analyticsService");

const getDashboardSummary = async (req, res) => {
  try {
    const data = await analyticsService.getDashboardSummary();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};

const getSalesOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await analyticsService.getSalesOverview(
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Sales overview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load sales overview",
    });
  }
};

const getSalesByCategory = async (req, res) => {
  try {
    const data = await analyticsService.getSalesByCategory();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Category analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load category analytics",
    });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const data = await analyticsService.getTopProducts();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Top products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load top products",
    });
  }
};

const getCustomerAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getCustomerAnalytics();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Customer analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load customer analytics",
    });
  }
};

const getInventoryAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getInventoryAnalytics();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Inventory analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load inventory analytics",
    });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const data = await analyticsService.getRecentTransactions();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Recent transactions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load recent transactions",
    });
  }
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