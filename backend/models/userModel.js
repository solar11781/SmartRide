const db = require("../config/db");

class User {
  constructor({ user_id, username, email, phone_number, password, role }) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.password = password;
    this.role = role;
  }

  // Create a new user
  static async create({ username, email, phone_number, password, role }) {
    const sql = `
      INSERT INTO users (username, email, phone_number, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db
      .promise()
      .query(sql, [username, email, phone_number, password, role]);
    return result.insertId; // Return the new user's ID
  }

  // Find a user by username
  static async findByUsername(username) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [rows] = await db.promise().query(sql, [username]);
    return rows.length ? new User(rows[0]) : null;
  }

  // Find a user by ID
  static async findById(user_id) {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    const [rows] = await db.promise().query(sql, [user_id]);
    return rows.length ? new User(rows[0]) : null;
  }

  // Fetch all users with driver verification status
  static async fetchAllUsers() {
    try {
      const sql = `
      SELECT 
        users.user_id, 
        users.username, 
        users.email, 
        users.role, 
        users.phone_number, 
        COALESCE(drivers_details.is_verified, NULL) AS is_verified
      FROM users
      LEFT JOIN drivers_details ON users.user_id = drivers_details.driver_id
    `;
      const [rows] = await db.promise().query(sql);
      return rows; // Return raw rows instead of mapping to User instances
    } catch (error) {
      console.error("❌ Error fetching all users:", error);
      throw new Error("Database query failed");
    }
  }

  // Fetch all drivers with their details
  static async fetchAllDrivers() {
    try {
      const sql = `
      SELECT 
        users.user_id, 
        users.username, 
        users.email, 
        users.phone_number, 
        drivers_details.id_card, 
        drivers_details.driver_license, 
        drivers_details.insurance_document, 
        drivers_details.vehicle_color, 
        drivers_details.is_verified 
      FROM users
      INNER JOIN drivers_details ON users.user_id = drivers_details.driver_id
    `;
      const [rows] = await db.promise().query(sql);
      return rows; // Return raw rows instead of mapping to User instances
    } catch (error) {
      console.error("❌ Error fetching all drivers:", error);
      throw new Error("Database query failed");
    }
  }

  // Update user details
  static async updateDetails(user_id, { username, email, phone_number }) {
    const sql = `
      UPDATE users
      SET username = ?, email = ?, phone_number = ?
      WHERE user_id = ?
    `;
    await db.promise().query(sql, [username, email, phone_number, user_id]);
  }

  // Delete a user
  static async delete(user_id) {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    await db.promise().query(sql, [user_id]);
  }

  // Fetch driver details by user ID
  static async getDriverDetails(user_id) {
    const sql = `
      SELECT 
        id_card, 
        driver_license, 
        insurance_document, 
        license_plate, 
        vehicle_type, 
        vehicle_color, 
        is_verified 
      FROM drivers_details 
      WHERE driver_id = ?
    `;
    const [rows] = await db.promise().query(sql, [user_id]);
    return rows.length ? rows[0] : null;
  }

  // Verify driver
  static async verifyDriver(driver_id) {
    try {
      const sql =
        "UPDATE drivers_details SET is_verified = 1 WHERE driver_id = ?";
      const [result] = await db.promise().query(sql, [driver_id]);
      return result; // Return the result of the query
    } catch (error) {
      console.error("❌ Error verifying driver:", error);
      throw new Error("Database query failed");
    }
  }

  // Create driver details
  static async createDriverDetails({
    driver_id,
    id_card,
    driver_license,
    insurance_document,
    license_plate,
    vehicle_type,
    vehicle_color,
  }) {
    const sql = `
      INSERT INTO drivers_details (
        driver_id, id_card, driver_license, insurance_document, license_plate, vehicle_type, vehicle_color, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    await db
      .promise()
      .query(sql, [
        driver_id,
        id_card,
        driver_license,
        insurance_document,
        license_plate,
        vehicle_type,
        vehicle_color,
      ]);
  }
}

module.exports = User;
