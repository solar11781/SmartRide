const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/auth");
console.log("✅ auth.js route file loaded");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
