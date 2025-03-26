const db = require('../config/db');

const getPaymentByRideId = async (req, res) => {
  const { ride_id } = req.params;

  try {
    const [results] = await db.promise().query("SELECT * FROM payments WHERE ride_id = ?", [ride_id]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No payment found for this ride" });
    }

    return res.status(200).json({ success: true, payment: results[0] });
  } catch (err) {
    console.error("❌ Error fetching payment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getPaymentByRideId };
