const db = require("../config/db");

class Problem {
  constructor({
    problem_id,
    user_id,
    ride_id,
    description,
    status,
    created_at,
  }) {
    this.problem_id = problem_id;
    this.user_id = user_id;
    this.ride_id = ride_id;
    this.description = description;
    this.status = status || "Pending";
    this.created_at = created_at || new Date();
  }

  // Save a new problem report to the database
  async save() {
    const query = `
      INSERT INTO problems (user_id, ride_id, description, status)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db
      .promise()
      .query(query, [
        this.user_id,
        this.ride_id,
        this.description,
        this.status,
      ]);
    this.problem_id = result.insertId;
    return this;
  }

  // Retrieve all problems (admin use case)
  static async findAll() {
    const query = `
      SELECT 
        problems.problem_id,
        problems.description,
        problems.status,
        problems.created_at,
        COALESCE(users.username, 'Unknown User') AS username,
        COALESCE(rides.pickup_location, 'Unknown Location') AS pickup_location,
        COALESCE(rides.dropoff_location, 'Unknown Location') AS dropoff_location
      FROM problems
      LEFT JOIN users ON problems.user_id = users.user_id
      LEFT JOIN rides ON problems.ride_id = rides.ride_id
      ORDER BY problems.created_at DESC
    `;
    const [rows] = await db.promise().query(query);
    return rows;
  }

  // Update the status of a problem
  static async updateStatus(problem_id, status) {
    const query = `
      UPDATE problems SET status = ? WHERE problem_id = ?
    `;
    await db.promise().query(query, [status, problem_id]);
  }
}

module.exports = Problem;
