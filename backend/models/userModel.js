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
    const [result] = await db.promise().query(sql, [
      username,
      email,
      phone_number,
      password,
      role,
    ]);
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
    await db.promise().query(sql, [
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