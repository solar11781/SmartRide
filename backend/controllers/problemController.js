const Problem = require("../models/Problem");

// Create a new problem report
const createProblem = async (req, res) => {
  const { user_id, ride_id, description } = req.body;

  if (!user_id || !description) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    const problem = new Problem({ user_id, ride_id, description });
    await problem.save();
    return res.status(201).json({ success: true, message: "Problem reported successfully!" });
  } catch (error) {
    console.error("Error creating problem report:", error);
    return res.status(500).json({ success: false, message: "Server error while reporting problem." });
  }
};

// Get all problems for a specific user
const getProblemsByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const problems = await Problem.findByUserId(user_id);
    return res.status(200).json({ success: true, problems });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all problems (admin use case)
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.findAll();
    return res.status(200).json({ success: true, problems });
  } catch (error) {
    console.error("Error fetching all problems:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update the status of a problem
const updateProblemStatus = async (req, res) => {
  const { problem_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Missing status field." });
  }

  try {
    await Problem.updateStatus(problem_id, status);
    return res.status(200).json({ success: true, message: "Problem status updated successfully!" });
  } catch (error) {
    console.error("Error updating problem status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createProblem,
  getProblemsByUser,
  getAllProblems,
  updateProblemStatus,
};