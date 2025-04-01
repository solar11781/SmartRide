// 📦 Load environment variables
require("dotenv").config();

// 🚀 Create Express app
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// 🧱 Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the uploads folder

// ✅ Route Imports
const authRoutes = require("./routes/auth");
const rideRoutes = require("./routes/ride");
const paymentRoutes = require("./routes/payment");
const driverRoutes = require("./routes/driver");
const problemRoutes = require("./routes/problem");
const analyticsRoutes = require("./routes/analytics");

// ✅ API Routes
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth routes loaded");

app.use("/api/rides", rideRoutes);
console.log("✅ /api/rides routes loaded");

app.use("/api/payment", paymentRoutes);
console.log("✅ /api/payment routes loaded");

app.use("/api/driver", driverRoutes);
console.log("✅ /api/driver routes loaded");

app.use("/api/problems", problemRoutes);
console.log("✅ /api/problems routes loaded");

app.use("/api/analytics", analyticsRoutes);
console.log("✅ /api/analytics routes loaded");

// 🚨 404 Fallback (must come last)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// 🟢 Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
