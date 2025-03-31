const Analytics = require("../models/analytics");
const db = require("../config/db");

// Get ride statistics
const getRideStats = async (req, res) => {
  try {
    // Total number of rides
    const [totalRides] = await db
      .promise()
      .query("SELECT COUNT(*) AS total FROM rides");

    // Rides per month
    const [ridesPerMonth] = await db
      .promise()
      .query(
        "SELECT MONTH(created_at) AS month, COUNT(*) AS total FROM rides GROUP BY month"
      );

    res.status(200).json({
      success: true,
      totalRides: totalRides[0].total,
      ridesPerMonth,
    });
  } catch (error) {
    console.error("❌ Error fetching ride stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ride stats.",
    });
  }
};

// Get revenue statistics
const getRevenueStats = async (req, res) => {
  try {
    const totalRevenue = await Analytics.getTotalRevenue();
    const revenuePerMonth = await Analytics.getRevenuePerMonth();

    res.status(200).json({
      success: true,
      totalRevenue,
      revenuePerMonth,
    });
  } catch (error) {
    console.error("❌ Error fetching revenue stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching revenue stats.",
    });
  }
};

module.exports = { getRideStats, getRevenueStats };
