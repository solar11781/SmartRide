const db = require('../config/db');

// Create new user
const createUser = (email, username, role, phone_number, password, callback) => {
  const sql = `INSERT INTO users (email, username, role, phone_number, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [email, username, role, phone_number, password], callback);
};

// Find user by username
const findUserByUsername = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], callback);
};

module.exports = { createUser, findUserByUsername };
