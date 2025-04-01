const express = require("express");
const router = express.Router();
const { getDriverRides, completeRide, assignRideToDriver, setDriverLocation } = require("../controllers/driverController");

router.get("/:driver_id/rides", getDriverRides);
router.post("/complete/:ride_id", completeRide);
router.post('/assign/:ride_id', assignRideToDriver);
router.post("/location/:driver_id", setDriverLocation);

module.exports = router;
