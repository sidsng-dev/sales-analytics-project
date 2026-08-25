const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  askAIAnalytics,
  uploadCSV,
} = require("../controllers/aiAnalyticsController");

// Store uploaded CSV temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// Existing AI question endpoint
router.post("/ask", askAIAnalytics);

// NEW: CSV upload endpoint
router.post("/upload", upload.single("file"), uploadCSV);

module.exports = router;