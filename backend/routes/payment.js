const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🧾 GET /api/payment/:ride_id
router.get("/:ride_id", async (req, res) => {
  const { ride_id } = req.params;

  try {
    const [result] = await db.promise().query("SELECT * FROM payments WHERE ride_id = ?", [ride_id]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    return res.status(200).json({ success: true, payment: result[0] });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
