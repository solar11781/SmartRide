const db = require("../config/db");

class Ride {
  constructor({
    ride_id,
    user_id,
    vehicle_type,
    pickup_location,
    dropoff_location,
    distance_km,
    duration_min,
    eta,
    status,
    rating,
    review,
    created_at,
  }) {
    this.ride_id = ride_id;
    this.user_id = user_id;
    this.vehicle_type = vehicle_type;
    this.pickup_location = pickup_location;
    this.dropoff_location = dropoff_location;
    this.distance_km = distance_km;
    this.duration_min = duration_min;
    this.eta = eta;
    this.status = status || "Pending";
    this.rating = rating || null;
    this.review = review || null;
    this.created_at = created_at || new Date();
  }

  // Save a new ride to the database
  async save() {
    const query = `
      INSERT INTO rides 
      (user_id, vehicle_type, pickup_location, dropoff_location, distance_km, duration_min, eta, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db
      .promise()
      .query(query, [
        this.user_id,
        this.vehicle_type,
        this.pickup_location,
        this.dropoff_location,
        this.distance_km,
        this.duration_min,
        this.eta,
        this.status,
      ]);
    this.ride_id = result.insertId;
    return this;
  }

  // Retrieve ride history for a specific user
  static async findByUserId(user_id) {
    const query = `
      SELECT * FROM rides WHERE user_id = ? ORDER BY created_at DESC
    `;
    const [rows] = await db.promise().query(query, [user_id]);
    return rows;
  }

  // Retrieve all rides (admin use case)
  static async findAll() {
    const query = `
      SELECT * FROM rides ORDER BY created_at DESC
    `;
    const [rows] = await db.promise().query(query);
    return rows;
  }

  // Retrieve a specific ride by ID
  static async findById(ride_id) {
    const query = `
      SELECT * FROM rides WHERE ride_id = ?
    `;
    const [rows] = await db.promise().query(query, [ride_id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Delete a ride by ID
  static async deleteById(ride_id) {
    const query = `
      DELETE FROM rides WHERE ride_id = ?
    `;
    await db.promise().query(query, [ride_id]);
  }

  // Update feedback (rating and review) for a ride
  static async updateFeedback(ride_id, rating, review) {
    const query = `
      UPDATE rides SET rating = ?, review = ? WHERE ride_id = ?
    `;
    await db.promise().query(query, [rating, review, ride_id]);
  }
}

module.exports = Ride;
