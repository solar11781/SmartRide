// backend/config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Update if using a password
  database: 'smartride'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected!');
});

module.exports = db;
