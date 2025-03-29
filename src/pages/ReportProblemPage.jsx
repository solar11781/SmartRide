import React, { useState, useEffect } from "react";

const ReportProblemPage = () => {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user_id = localStorage.getItem("user_id");

  // Fetch ride history
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/rides/history/${user_id}`
        );
        const data = await res.json();
        if (data.success) {
          setRides(data.rides);
        } else {
          setMessage("❌ Failed to fetch ride history.");
        }
      } catch (err) {
        console.error("Error fetching rides:", err);
        setMessage("❌ Error fetching ride history.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user_id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      alert("Please provide a description of the problem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          ride_id: selectedRide || null, // Include ride_id if selected
          description,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        alert("✅ Problem reported successfully!");
        setDescription("");
        setSelectedRide("");
      } else {
        alert("❌ Failed to report the problem.");
      }
    } catch (err) {
      console.error("Error reporting problem:", err);
      alert("❌ Error reporting the problem.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
        Report a Problem
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Please describe the issue you're facing. If the problem is related to a
        specific ride, select it from the list below.
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading rides...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Ride Selection */}
          <div className="mb-4">
            <label
              htmlFor="ride"
              className="block text-sm font-medium text-gray-700"
            >
              Select a Ride (Optional)
            </label>
            <select
              id="ride"
              value={selectedRide}
              onChange={(e) => setSelectedRide(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select a Ride --</option>
              {rides.map((ride) => (
                <option key={ride.ride_id} value={ride.ride_id}>
                  {ride.pickup_location} ➜ {ride.dropoff_location} (
                  {new Date(ride.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Problem Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Describe your problem
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your problem here..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Submit Report
          </button>
        </form>
      )}

      {message && <p className="text-center text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default ReportProblemPage;
