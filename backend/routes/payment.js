const express = require("express");
const router = express.Router();

const { getPaymentByRideId, makePayment } = require("../controllers/paymentController");

// Get payment info for a specific ride
router.get("/:ride_id", getPaymentByRideId);

// Make payment for a ride
router.post("/pay/:ride_id", makePayment);

module.exports = router;
