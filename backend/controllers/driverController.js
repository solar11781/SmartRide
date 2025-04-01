const db = require("../config/db");

const getDriverRides = async (req, res) => {
  const { driver_id } = req.params;

  try {
    const [rides] = await db
      .promise()
      .query("SELECT * FROM rides WHERE driver_id = ?", [driver_id]);

    res.status(200).json({ success: true, rides });
  } catch (err) {
    console.error("❌ Error in getDriverRides:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const completeRide = async (req, res) => {
//   const { ride_id } = req.params;

//   try {
//     await db
//       .promise()
//       .query("UPDATE rides SET status = 'Completed' WHERE ride_id = ?", [ride_id]);

//     res.status(200).json({ success: true, message: "Ride marked as completed" });
//   } catch (err) {
//     console.error("❌ Error in completeRide:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const completeRide = async (req, res) => {
  const { ride_id } = req.params;

  try {
    const [rideResults] = await db
      .promise()
      .query("SELECT * FROM rides WHERE ride_id = ?", [ride_id]);
    if (rideResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    const ride = rideResults[0];
    const [user] = await db
      .promise()
      .query("SELECT username FROM users WHERE user_id = ?", [ride.user_id]);
    const customerName = user[0].username;

    await db
      .promise()
      .query("UPDATE rides SET status = 'Completed' WHERE ride_id = ?", [
        ride_id,
      ]);

    // Add notification for admin
    await db
      .promise()
      .query(
        "INSERT INTO notifications (ride_id, message) VALUES (?, ?)",
        [
          ride_id,
          `Ride from ${ride.pickup_location} to ${ride.dropoff_location} booked by ${customerName} was completed.`,
        ]
      );

    res
      .status(200)
      .json({ success: true, message: "Ride marked as completed" });
  } catch (err) {
    console.error("❌ Error in completeRide:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const assignRideToDriver = async (req, res) => {
  const { ride_id } = req.params;
  const driver_id = req.body.driver_id;

  if (!driver_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing driver ID" });
  }

  try {
    await db
      .promise()
      .query(
        "UPDATE rides SET driver_id = ?, status = 'Assigned' WHERE ride_id = ?",
        [driver_id, ride_id]
      );

    res.status(200).json({ success: true, message: "Ride assigned to driver" });
  } catch (err) {
    console.error("❌ Error assigning ride:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const setDriverLocation = async (req, res) => {
  const { driver_id } = req.params;
  const { lat, lng, location } = req.body;

  try {
    if (lat && lng) {
      // Geolocation update
      await db
        .promise()
        .query(
          "UPDATE users SET location_lat = ?, location_lng = ?, location_name = NULL WHERE user_id = ? AND role = 'Driver'",
          [lat, lng, driver_id]
        );
    } else if (location) {
      // Manual location update
      await db
        .promise()
        .query(
          "UPDATE users SET location_name = ?, location_lat = NULL, location_lng = NULL WHERE user_id = ? AND role = 'Driver'",
          [location, driver_id]
        );
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Missing location data." });
    }

    res.status(200).json({ success: true, message: "Location updated." });
  } catch (err) {
    console.error("❌ Error updating location:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDriverRides,
  completeRide,
  assignRideToDriver,
  setDriverLocation,
};
