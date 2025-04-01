const db = require("../config/db");

// Fetch all notifications, ordered by the most recent
const getNotifications = async (req, res) => {
  try {
    const [notifications] = await db
      .promise()
      .query("SELECT * FROM notifications ORDER BY created_at DESC");

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getNotifications };