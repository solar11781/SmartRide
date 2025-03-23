const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// ✅ Keep only one of these:
const authRoutes = require('./routes/auth');
console.log("✅ auth.js route file loaded");

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); // ✅ only one time

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
