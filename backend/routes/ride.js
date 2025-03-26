const express = require("express");
const router = express.Router();
const { bookRide, getRideHistory, deleteRide } = require("../controllers/rideController"); // ✅ FIX

router.post("/book", bookRide);
router.get("/history/:user_id", getRideHistory);
router.delete('/:ride_id', deleteRide); // ✅ New
module.exports = router;
