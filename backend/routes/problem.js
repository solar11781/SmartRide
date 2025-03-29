const express = require("express");
const router = express.Router();
const {
  createProblem,
  getProblemsByUser,
  getAllProblems,
  updateProblemStatus,
} = require("../controllers/problemController");

// Create a new problem report
router.post("/", createProblem);

// Get all problems for a specific user
router.get("/user/:user_id", getProblemsByUser);

// Get all problems (admin use case)
router.get("/", getAllProblems);

// Update the status of a problem
router.put("/:problem_id", updateProblemStatus);

module.exports = router;