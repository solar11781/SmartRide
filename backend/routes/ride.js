const express = require("express");
const router = express.Router();
const {
  bookRide,
  getRideHistory,
  deleteRide,
  getRideById,
  updateRideFeedback,
  getAllRides
} = require("../controllers/rideController");

// 📌 Book a new ride
router.post("/book", bookRide);

// 📌 Get ride history for a specific user
router.get("/history/:user_id", getRideHistory);

// 📌 Delete a ride by ID
router.delete("/:ride_id", deleteRide);

// ✅ Get a ride by ID (used for payment page, etc.)
router.get("/:ride_id", getRideById);

// Updating ride feedback
router.put("/feedback/:ride_id", updateRideFeedback);

// 📌 Get all rides
router.get("/", getAllRides);

module.exports = router;
