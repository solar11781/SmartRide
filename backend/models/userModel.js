const db = require('../config/db');

// Create new user
const createUser = (email, username, role, phone_number, password, verified, callback) => {
  const sql = `INSERT INTO users (email, username, role, phone_number, password, verified) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [email, username, role, phone_number, password, verified], callback);
};

// Find user by username
const findUserByUsername = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], callback);
};

// Fetch all users
const getAllUsers = (callback) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, callback);
};

// Update user verification status
const verifyUser = (user_id, callback) => {
  const sql = 'UPDATE users SET verified = 1 WHERE user_id = ?';
  db.query(sql, [user_id], callback);
};

module.exports = { createUser, findUserByUsername, getAllUsers, verifyUser };
