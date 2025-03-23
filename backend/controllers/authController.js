const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
  let { username, email, phone_number, password, role } = req.body;

  // 0. Sanitize input
  username = username?.trim();
  email = email?.trim().toLowerCase();
  phone_number = phone_number?.replace(/\D/g, ""); // remove all non-digits
  password = password?.trim();
  role = role?.trim();

  // 1. Validate format
  if (!username || username.length < 3) {
    return res.status(400).json({ success: false, message: "Username must be at least 3 characters." });
  }

  if (!/^[0-9]{10,15}$/.test(phone_number)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be 10–15 digits (no letters or symbols)."
    });
  }

  const strongPasswordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!strongPasswordPattern.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
    });
  }

  // 2. Check for duplicates
  try {
    const [existing] = await db.promise().query(
      "SELECT * FROM users WHERE username = ? OR phone_number = ? OR email = ?",
      [username, phone_number, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "An account with this username, phone number or email already exists."
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into DB
    await db.promise().query(
      "INSERT INTO users (username, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)",
      [username, email, phone_number, hashedPassword, role]
    );

    return res.status(200).json({ success: true, message: "Account created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  User.findUserByUsername(username, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({
        id: user.user_id,
        username: user.username,
        role: user.role
      }, 'secretkey', { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role
        }
      });
    });
  });
};

module.exports = { register, login };
