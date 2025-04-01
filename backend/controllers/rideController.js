const Ride = require("../models/Ride");
const db = require("../config/db");

const bookRide = async (req, res) => {
  const { user_id, vehicle, pickup, dropoff, distance, duration, eta } =
    req.body;

  if (
    !user_id ||
    !pickup ||
    !dropoff ||
    !vehicle ||
    !distance ||
    !duration ||
    !eta
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }

  try {
    const ride = new Ride({
      user_id,
      vehicle_type: vehicle,
      pickup_location: pickup,
      dropoff_location: dropoff,
      distance_km: distance,
      duration_min: duration,
      eta,
    });
    await ride.save();

    // Add notification for admin
    const [user] = await db
      .promise()
      .query("SELECT username FROM users WHERE user_id = ?", [user_id]);
    const customerName = user[0].username;

    await db
      .promise()
      .query("INSERT INTO notifications (ride_id, message) VALUES (?, ?)", [
        ride.ride_id,
        `${customerName} has booked a ride from ${pickup} to ${dropoff}`,
      ]);

    return res
      .status(201)
      .json({ success: true, message: "Ride booked successfully!" });
  } catch (error) {
    console.error("❌ Ride booking error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while booking ride." });
  }
};

const getRideHistory = async (req, res) => {
  const { user_id } = req.params;

  try {
    const rides = await Ride.findByUserId(user_id);
    return res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error("❌ Error fetching ride history:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteRide = async (req, res) => {
  const { ride_id } = req.params;

  try {
    await Ride.deleteById(ride_id);
    return res
      .status(200)
      .json({ success: true, message: "Ride deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting ride:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete ride" });
  }
};

const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.findAll();
    return res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error("❌ Error fetching all rides:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch rides" });
  }
};

const getRideById = async (req, res) => {
  const { ride_id } = req.params;

  try {
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    res.json({ success: true, ride });
  } catch (err) {
    console.error("❌ Error getting ride:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateRideFeedback = async (req, res) => {
  const { ride_id } = req.params;
  const { rating, review } = req.body;

  if (!rating && !review) {
    return res
      .status(400)
      .json({ success: false, message: "Rating or review is required." });
  }

  try {
    await Ride.updateFeedback(ride_id, rating, review);
    return res
      .status(200)
      .json({ success: true, message: "Feedback updated successfully." });
  } catch (error) {
    console.error("❌ Error updating feedback:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  bookRide,
  getRideHistory,
  deleteRide,
  getAllRides,
  getRideById,
  updateRideFeedback,
};
