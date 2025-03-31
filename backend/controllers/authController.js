const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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

    // Sanitize input
    username = username?.trim();
    email = email?.trim().toLowerCase();
    phone_number = phone_number?.replace(/\D/g, ""); // Remove non-digits
    password = password?.trim();
    role = role?.trim().toLowerCase();

    // Validate input
    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters.",
      });
    }

    if (!/^[0-9]{10,15}$/.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10-15 digits.",
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

    try {
      // Check for duplicates
      const existingUser = await User.findDuplicate(
        username,
        email,
        phone_number
      );
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "An account with this username, email, or phone number already exists.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = await User.create({
        username,
        email,
        phone_number,
        password: hashedPassword,
        role,
      });

      // Handle driver-specific details
      if (role === "driver") {
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

        // Rename and move uploaded files
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

        // Save driver details
        await User.createDriverDetails({
          driver_id: userId,
          id_card: idCardPath,
          driver_license: driverLicensePath,
          insurance_document: insuranceDocumentPath,
          license_plate: licensePlate,
          vehicle_type: vehicleType,
          vehicle_color: vehicleColor,
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Account created successfully!" });
    } catch (error) {
      console.error("❌ Error during registration:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error during registration." });
    }
  });
};

// LOGIN FUNCTION
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// GET ALL DRIVERS
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.fetchAllDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    console.error("❌ Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

// VERIFY DRIVER
const verifyDriver = async (req, res) => {
  const { user_id } = req.body;

  try {
    const result = await User.verifyDriver(user_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver verified successfully" });
  } catch (error) {
    console.error("❌ Error verifying driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET DRIVER DETAILS
const getDriverDetails = async (req, res) => {
  const { user_id } = req.params;

  try {
    const driverDetails = await User.getDriverDetails(user_id);
    if (!driverDetails) {
      return res.status(404).json({ message: "Driver details not found" });
    }

    res.status(200).json(driverDetails);
  } catch (error) {
    console.error("❌ Error fetching driver details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  const { user_id, username, email, phone_number } = req.body;

  try {
    await User.updateDetails(user_id, { username, email, phone_number });
    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const driverDetails = await User.getDriverDetails(user_id);

    // Delete associated files
    if (driverDetails) {
      const { id_card, driver_license, insurance_document } = driverDetails;

      [id_card, driver_license, insurance_document].forEach((filePath) => {
        if (filePath) {
          const fullPath = path.join(__dirname, "../", filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
    }

    // Delete user
    await User.delete(user_id);
    res
      .status(200)
      .json({ message: "User account and documents deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getAllDrivers,
  verifyDriver,
  getDriverDetails,
  updateUser,
  deleteUser,
};
