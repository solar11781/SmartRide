const db = require("../config/db");

class Analytics {
  // Get total number of rides
  static async getTotalRides() {
    const query = "SELECT COUNT(*) AS total FROM rides";
    const [rows] = await db.promise().query(query);
    return rows[0].total || 0; // Return total rides or 0 if no rows
  }

  // Get rides per month
  static async getRidesPerMonth() {
    const query = `
        SELECT MONTH(created_at) AS month, COUNT(*) AS total 
        FROM rides 
        GROUP BY month
      `;
    const [rows] = await db.promise().query(query);
    return rows; // Return rides per month
  }

  // Get total revenue
  static async getTotalRevenue() {
    const query = `
      SELECT SUM(amount) AS total 
      FROM payments 
      WHERE status = 'Completed'
    `;
    const [rows] = await db.promise().query(query);
    return rows[0].total !== null ? parseFloat(rows[0].total) : 0; // Ensure totalRevenue is a number
  }

  // Get revenue per month
  static async getRevenuePerMonth() {
    const query = `
      SELECT MONTH(created_at) AS month, SUM(amount) AS total 
      FROM payments 
      WHERE status = 'Completed' 
      GROUP BY month
    `;
    const [rows] = await db.promise().query(query);
    return rows.map((row) => ({
      month: row.month || 0, // Ensure month is valid
      total: row.total !== null ? row.total : 0, // Ensure total is a number
    }));
  }
}

module.exports = Analytics;
