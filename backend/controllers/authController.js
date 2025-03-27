const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../models/userModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// REGISTER FUNCTION
const register = async (req, res) => {
  upload.fields([
    { name: "idCard" },
    { name: "driverLicense" },
    { name: "insuranceDocument" },
  ])(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed" });
    }

    let { username, email, phone_number, password, role } = req.body;

    // 0. Sanitize input
    username = username?.trim();
    email = email?.trim().toLowerCase();
    phone_number = phone_number?.replace(/\D/g, ""); // Remove non-digits
    password = password?.trim();
    role = role?.trim().toLowerCase();

    // 1. Validate format
    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters.",
      });
    }

    if (!/^[0-9]{10,15}$/.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10-15 digits (no letters or symbols).",
      });
    }

    const strongPasswordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!strongPasswordPattern.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      });
    }

    // 2. Check for duplicates
    try {
      const [existing] = await db
        .promise()
        .query(
          "SELECT * FROM users WHERE username = ? OR phone_number = ? OR email = ?",
          [username, phone_number, email]
        );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "An account with this username, phone number or email already exists.",
        });
      }
    } catch (error) {
      console.error("❌ Error checking for duplicates:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error checking for duplicates." });
    }

    // 3. Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error("❌ Error hashing password:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error hashing password." });
    }

    // 4. Insert into users table
    let userId;
    try {
      const [result] = await db
        .promise()
        .query(
          "INSERT INTO users (username, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)",
          [username, email, phone_number, hashedPassword, role]
        );

      userId = result.insertId;
    } catch (error) {
      console.error("❌ Error inserting into users table:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error inserting into users table." });
    }

    // 5. Rename and move uploaded files
    const idCardPath = req.files.idCard
      ? `uploads/${userId}-id-card${path.extname(
          req.files.idCard[0].originalname
        )}`
      : null;
    const driverLicensePath = req.files.driverLicense
      ? `uploads/${userId}-driver-license${path.extname(
          req.files.driverLicense[0].originalname
        )}`
      : null;
    const insuranceDocumentPath = req.files.insuranceDocument
      ? `uploads/${userId}-insurance-document${path.extname(
          req.files.insuranceDocument[0].originalname
        )}`
      : null;
    const { licensePlate, vehicleType, vehicleColor } = req.body;

    try {
      if (req.files.idCard) {
        fs.renameSync(
          req.files.idCard[0].path,
          path.join(__dirname, "../", idCardPath)
        );
      }
      if (req.files.driverLicense) {
        fs.renameSync(
          req.files.driverLicense[0].path,
          path.join(__dirname, "../", driverLicensePath)
        );
      }
      if (req.files.insuranceDocument) {
        fs.renameSync(
          req.files.insuranceDocument[0].path,
          path.join(__dirname, "../", insuranceDocumentPath)
        );
      }
    } catch (error) {
      console.error("❌ Error renaming files:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error renaming files." });
    }

    // 6. Insert into drivers_details table if role is driver
    if (role === "driver") {
      try {
        await db
          .promise()
          .query(
            "INSERT INTO drivers_details (driver_id, id_card, driver_license, insurance_document, license_plate, vehicle_type, vehicle_color, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0)",
            [
              userId,
              idCardPath,
              driverLicensePath,
              insuranceDocumentPath,
              licensePlate,
              vehicleType,
              vehicleColor,
            ]
          );
      } catch (error) {
        console.error("❌ Error inserting into drivers_details table:", error);
        return res.status(500).json({
          success: false,
          message: "Error inserting into drivers_details table.",
        });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Account created successfully!" });
  });
};

// ✅ LOGIN FUNCTION
const login = (req, res) => {
  const { username, password } = req.body;

  User.findUserByUsername(username, (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ message: "User not found" });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role,
          phone_number: user.phone_number,
        },
        "secretkey",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role,
          phone_number: user.phone_number,
        },
      });
    });
  });
};

const getAllUsers = (req, res) => {
  User.fetchAllUsers((err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  });
};

const getAllDrivers = (req, res) => {
  User.fetchAllDrivers((err, results) => {
    if (err) {
      console.error("❌ Error fetching drivers:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  });
};

// VERIFY USER FUNCTION
const verifyDriver = (req, res) => {
  const { user_id } = req.body;

  User.verifyDriver(user_id, (err, results) => {
    if (err) {
      console.error("❌ Error verifying driver:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver verified successfully" });
  });
};

module.exports = { register, login, getAllUsers, getAllDrivers, verifyDriver };
