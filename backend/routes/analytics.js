const express = require("express");
const router = express.Router();
const { getRideStats, getRevenueStats } = require("../controllers/analyticsController");

// Route to get ride statistics (total rides and rides per month)
router.get("/rides", getRideStats);

// Route to get revenue statistics (total revenue and revenue per month)
router.get("/revenue", getRevenueStats);

module.exports = router;