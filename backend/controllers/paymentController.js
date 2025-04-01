const db = require("../config/db");

const getPaymentByRideId = async (req, res) => {
  const { ride_id } = req.params;
  try {
    const [rideResults] = await db.promise().query(
      "SELECT * FROM rides WHERE ride_id = ?",
      [ride_id]
    );

    if (rideResults.length === 0) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const ride = rideResults[0];
    const amount = ride.distance_km * 5000;

    const [paymentResults] = await db.promise().query(
      "SELECT * FROM payments WHERE ride_id = ? ORDER BY created_at DESC LIMIT 1",
      [ride_id]
    );

    const latestPayment = paymentResults[0];

    res.status(200).json({
      success: true,
      payment: {
        ride_id,
        amount,
        method: latestPayment?.method || "",
        status: latestPayment?.status || "Pending",
        created_at: latestPayment?.created_at || ride.created_at,
      },
    });
  } catch (err) {
    console.error("❌ Get payment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const Invoice = require("../models/Invoice");
const Receipt = require("../models/Receipt");

const makePayment = async (req, res) => {
  const { ride_id } = req.params;
  const { method } = req.body;

  try {
    const [rideResults] = await db.promise().query("SELECT * FROM rides WHERE ride_id = ?", [ride_id]);
    if (rideResults.length === 0) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const ride = rideResults[0];
    const invoice = new Invoice(ride);

    // Store payment
    await db.promise().query(
      "INSERT INTO payments (ride_id, amount, method, status, created_at) VALUES (?, ?, ?, ?, NOW())",
      [invoice.ride_id, invoice.amount, method, "Completed"]
    );

    await db.promise().query(
      "UPDATE rides SET status = 'Completed', payment_method = ? WHERE ride_id = ?",
      [method, ride_id]
    );

    const [paymentResult] = await db.promise().query(
      "SELECT * FROM payments WHERE ride_id = ? ORDER BY created_at DESC LIMIT 1", [ride_id]
    );
    
    const payment = paymentResult[0];
    const receipt = new Receipt(payment); // this object should now contain correct fields
    
    return res.status(200).json({
      success: true,
      receipt: receipt.toJSON(), // sends receipt_id, amount, method, created_at
    });


  } catch (err) {
    console.error("Payment error:", err);
    return res.status(500).json({ success: false, message: "Server error during payment" });
  }
};


module.exports = {
  getPaymentByRideId,
  makePayment,
};
