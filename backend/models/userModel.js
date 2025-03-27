const db = require("../config/db");

// Create new user
const createUser = (
  email,
  username,
  role,
  phone_number,
  password,
  callback
) => {
  const sql = `INSERT INTO users (email, username, role, phone_number, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [email, username, role, phone_number, password], callback);
};

// Create driver details
const createDriverDetails = (
  driver_id,
  id_card,
  driver_license,
  insurance_document,
  license_plate,
  vehicle_type,
  vehicle_color,
  callback
) => {
  const sql = `INSERT INTO drivers_details (driver_id, id_card, driver_license, insurance_document, license_plate, vehicle_type, vehicle_color, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`;
  db.query(
    sql,
    [
      driver_id,
      id_card,
      driver_license,
      insurance_document,
      license_plate,
      vehicle_type,
      vehicle_color,
    ],
    callback
  );
};

// Find user by username
const findUserByUsername = (username, callback) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], callback);
};

// Fetch all users
const getAllUsers = (callback) => {
  const sql = "SELECT * FROM users";
  db.query(sql, callback);
};

// Verify driver
const verifyDriver = (driver_id, callback) => {
  const sql = "UPDATE drivers_details SET is_verified = 1 WHERE driver_id = ?";
  db.query(sql, [driver_id], callback);
};

// Fetch all users with driver verification status
const fetchAllUsers = (callback) => {
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
  db.query(sql, callback);
};

// Fetch all drivers with their details
const fetchAllDrivers = (callback) => {
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
  db.query(sql, callback);
};

// Fetch driver details by user_id
const getDriverDetailsById = (user_id, callback) => {
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
  db.query(sql, [user_id], callback);
};

// Update user details
const updateUserDetails = (user_id, username, email, phone_number, callback) => {
  const sql = `
    UPDATE users 
    SET username = ?, email = ?, phone_number = ? 
    WHERE user_id = ?
  `;
  db.query(sql, [username, email, phone_number, user_id], callback);
};

// Delete user account
const deleteUserAccount = (user_id, callback) => {
  const sql = `
    DELETE FROM users 
    WHERE user_id = ?
  `;
  db.query(sql, [user_id], callback);
};

module.exports = {
  createUser,
  createDriverDetails,
  findUserByUsername,
  getAllUsers,
  verifyDriver,
  fetchAllUsers,
  fetchAllDrivers,
  getDriverDetailsById,
  updateUserDetails,
  deleteUserAccount,
};