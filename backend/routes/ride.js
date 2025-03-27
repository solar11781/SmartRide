const express = require("express");
const router = express.Router();
const {
  bookRide,
  getRideHistory,
  deleteRide,
  getRideById,         // ✅ Add this line
  getAllRides          // Optional: if you're listing all rides somewhere
} = require("../controllers/rideController");

// 📌 Book a new ride
router.post("/book", bookRide);

// 📌 Get ride history for a specific user
router.get("/history/:user_id", getRideHistory);

// 📌 Delete a ride by ID
router.delete("/:ride_id", deleteRide);

// ✅ Get a ride by ID (used for payment page, etc.)
router.get("/:ride_id", getRideById);

// (Optional) 📌 Get all rides
router.get("/", getAllRides);

module.exports = router;
