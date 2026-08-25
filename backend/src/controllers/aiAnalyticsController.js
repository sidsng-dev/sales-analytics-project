const analyticsService = require("../services/analyticsService");
const {
  askSalesAnalyticsAgent,
  askSalesAnalyticsCSV,
} = require("../services/foundryService");

// Existing MongoDB analytics AI
const askAIAnalytics = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("AI Question:", question);

    const [
      dashboard,
      salesOverview,
      salesByCategory,
      topProducts,
      customerAnalytics,
      inventoryAnalytics,
      recentTransactions,
    ] = await Promise.all([
      analyticsService.getDashboardSummary(),
      analyticsService.getSalesOverview(),
      analyticsService.getSalesByCategory(),
      analyticsService.getTopProducts(),
      analyticsService.getCustomerAnalytics(),
      analyticsService.getInventoryAnalytics(),
      analyticsService.getRecentTransactions(),
    ]);

    const analyticsData = {
      dashboard,
      salesOverview,
      salesByCategory,
      topProducts,
      customerAnalytics,
      inventoryAnalytics,
      recentTransactions,
    };

    const answer = await askSalesAnalyticsAgent(
      question,
      analyticsData
    );

    return res.status(200).json({
      success: true,
      question,
      answer,
    });
  } catch (error) {
    console.error("AI Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process AI analytics request",
      error: error.message,
    });
  }
};


// NEW: CSV upload + Code Interpreter analysis
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
      return res.status(400).json({
        success: false,
        message: "Only CSV files are allowed",
      });
    }

    console.log("CSV received:", req.file.originalname);
    console.log("CSV size:", req.file.size);

    const result = await askSalesAnalyticsCSV(
      req.file.buffer,
      req.file.originalname
    );

    return res.status(200).json({
      success: true,
      filename: req.file.originalname,
      answer: result,
    });
  } catch (error) {
    console.error("CSV AI Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze CSV",
      error: error.message,
    });
  }
};


module.exports = {
  askAIAnalytics,
  uploadCSV,
};