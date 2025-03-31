import React, { useEffect, useState } from "react";
import axios from "axios";

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    // Fetch all problems
    axios
      .get("http://localhost:5001/api/problems")
      .then((response) => setProblems(response.data.problems))
      .catch((error) => console.error("Error fetching problems:", error));
  }, []);

  const handleResolve = (problem_id) => {
    // Resolve problem
    axios
      .put(`http://localhost:5001/api/problems/${problem_id}`, {
        status: "Resolved",
      })
      .then(() => {
        // Update the problem list after resolving
        setProblems(
          problems.map((problem) =>
            problem.problem_id === problem_id
              ? { ...problem, status: "Resolved" }
              : problem
          )
        );
      })
      .catch((error) => console.error("Error resolving problem:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Reported Problems</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">
              Username
            </th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">
              Pickup → Dropoff
            </th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">
              Description
            </th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">
              Created Date
            </th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">
              Status / Action
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr
              key={problem.problem_id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="py-3 px-4 text-center border-b border-gray-300">
                {problem.username}
              </td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                {problem.pickup_location} → {problem.dropoff_location}
              </td>
              <td className="py-3 px-4 text-left border-b border-gray-300">
                {problem.description}
              </td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                {new Date(problem.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                {problem.status === "Pending" ? (
                  <button
                    onClick={() => handleResolve(problem.problem_id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="text-green-500 font-semibold">Resolved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsPage;
