const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notificationController");

// 📌 Get all notifications
router.get("/", getNotifications);

module.exports = router;