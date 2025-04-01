import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RideHistoryPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/rides/history/${user_id}`
      );
      const data = await res.json();
      if (data.success) setRides(data.rides);
    } catch (err) {
      console.error("Error fetching ride history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user_id]);

  const handleDelete = async (ride_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ride?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5001/api/rides/${ride_id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Ride deleted");
        fetchHistory(); // Refresh
      } else {
        alert("❌ Failed to delete ride");
      }
    } catch (err) {
      alert("Error deleting ride.");
    }
  };

  // Add state to manage reviews and ratings
  const [feedback, setFeedback] = useState({}); // { ride_id: { rating, review } }

  // Function to handle rating selection
  const handleRating = (ride_id, rating) => {
    setFeedback((prev) => ({
      ...prev,
      [ride_id]: { ...prev[ride_id], rating },
    }));

    // Update the rides array to reflect the change immediately
    setRides((prevRides) =>
      prevRides.map((ride) =>
        ride.ride_id === ride_id ? { ...ride, rating } : ride
      )
    );
  };

  // Function to handle review input change
  const handleReviewChange = (ride_id, review) => {
    setFeedback((prev) => ({
      ...prev,
      [ride_id]: { ...prev[ride_id], review },
    }));

    // Update the rides array to reflect the change immediately
    setRides((prevRides) =>
      prevRides.map((ride) =>
        ride.ride_id === ride_id ? { ...ride, review } : ride
      )
    );
  };

  // Function to submit feedback
  const submitReview = async (ride_id) => {
    const { rating, review } = feedback[ride_id] || {};
    if (!rating && !review) {
      alert("Please provide a rating or review.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/rides/feedback/${ride_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, review }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("✅ Feedback submitted successfully.");
        fetchHistory(); // Refresh ride history
      } else {
        alert("❌ Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("❌ Error submitting feedback.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">
        🧾 My Ride History
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading rides...</p>
      ) : rides.length === 0 ? (
        <p className="text-center text-gray-500">No rides found yet.</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.ride_id}
              className="p-4 bg-white shadow-md rounded-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-600">
                  {ride.pickup_location} ➜ {ride.dropoff_location}
                </h3>
                <span
                  className={`text-sm px-2 py-1 rounded 
                  ${
                    ride.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : ride.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {ride.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                📅 {new Date(ride.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                🚗 Vehicle: {ride.vehicle_type}
              </p>
              <p className="text-sm text-gray-600">
                📏 Distance: {ride.distance_km} km
              </p>
              <p className="text-sm text-gray-600">
                ⏱️ Duration: {ride.duration_min} min
              </p>
              <p className="text-sm text-gray-600">
                🕒 ETA: {new Date(ride.eta).toLocaleTimeString()}
              </p>

              <div className="mt-3 flex gap-4">
                {ride.status === "Pending" && (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/payment/${ride.ride_id}`)
                    }
                    className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
                  >
                    Make Payment
                  </button>
                )}
                <button
                  onClick={() => handleDelete(ride.ride_id)}
                  className="px-4 py-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                >
                  Delete Ride
                </button>
              </div>

              <div className="mt-3">
                {/* Rating Buttons */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(ride.ride_id, star)}
                      className={`px-2 py-1 cursor-pointer rounded hover:bg-yellow-200 ${
                        ride.rating >= star ? "bg-yellow-500" : "bg-gray-300"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>

                {/* Review Input */}
                <textarea
                  placeholder="Write your review here..."
                  value={ride.review || ""}
                  onChange={(e) =>
                    handleReviewChange(ride.ride_id, e.target.value)
                  }
                  className="w-full mt-2 p-2 border rounded"
                ></textarea>

                {/* Submit Button */}
                <button
                  onClick={() => submitReview(ride.ride_id)}
                  className="cursor-pointer mt-2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Submit Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistoryPage;
