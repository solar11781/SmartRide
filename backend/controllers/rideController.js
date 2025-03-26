const db = require("../config/db");

const bookRide = async (req, res) => {
  const { user_id, vehicle, pickup, dropoff, distance, duration, eta } = req.body;

  if (!user_id || !pickup || !dropoff || !vehicle || !distance || !duration || !eta) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    await db
      .promise()
      .query(
        `INSERT INTO rides 
         (user_id, vehicle_type, pickup_location, dropoff_location, distance_km, duration_min, eta, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, vehicle, pickup, dropoff, distance, duration, eta, "Pending"]
      );

    return res.status(201).json({ success: true, message: "Ride booked successfully!" });
  } catch (error) {
    console.error("❌ Ride booking error:", error);
    return res.status(500).json({ success: false, message: "Server error while booking ride." });
  }
};

const getRideHistory = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const [rides] = await db
        .promise()
        .query("SELECT * FROM rides WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
  
      return res.status(200).json({ success: true, rides });
    } catch (error) {
      console.error("❌ Error fetching ride history:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  const deleteRide = async (req, res) => {
    const { ride_id } = req.params;
    try {
      await db.promise().query("DELETE FROM rides WHERE ride_id = ?", [ride_id]);
      return res.status(200).json({ success: true, message: "Ride deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting ride:", err);
      return res.status(500).json({ success: false, message: "Failed to delete ride" });
    }
  };
  

module.exports = { bookRide, getRideHistory, deleteRide, };
