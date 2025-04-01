import React, { useEffect, useState } from "react";

const MyRides = () => {
  const [assignedRides, setAssignedRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const driver_id = localStorage.getItem("user_id");

  const fetchRides = async () => {
    try {
      const [assignedRes, pendingRes] = await Promise.all([
        fetch(`http://localhost:5001/api/driver/${driver_id}/rides`),
        fetch("http://localhost:5001/api/rides")
      ]);

      const assignedData = await assignedRes.json();
      const pendingData = await pendingRes.json();

      if (assignedData.success) setAssignedRides(assignedData.rides);
      if (pendingData.success) {
        const unassigned = pendingData.rides.filter(ride => !ride.driver_id && ride.status === "Pending");
        setPendingRides(unassigned);
      }
    } catch (err) {
      console.error("❌ Error loading rides:", err);
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (ride_id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/driver/complete/${ride_id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Ride marked as completed");
        fetchRides();
      } else {
        alert("❌ Failed to complete ride");
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const claimRide = async (ride_id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/driver/assign/${ride_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Ride assigned to you!");
        fetchRides();
      } else {
        alert("❌ Failed to assign ride");
      }
    } catch (err) {
      console.error("❌ Error assigning ride:", err);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">🧾 Assigned Rides</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : assignedRides.length === 0 ? (
        <p className="text-center text-gray-500">No rides assigned.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {assignedRides.map((ride) => (
            <div
              key={ride.ride_id}
              className="p-4 border rounded shadow-sm bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-blue-600">{ride.pickup_location} ➜ {ride.dropoff_location}</p>
                <p className="text-sm text-gray-600">Status: {ride.status}</p>
              </div>
              {ride.status !== "Completed" && (
                <button
                  onClick={() => completeRide(ride.ride_id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 text-center">📥 Available Rides</h2>
      {pendingRides.length === 0 ? (
        <p className="text-center text-gray-400">No available rides to claim.</p>
      ) : (
        <div className="space-y-4">
          {pendingRides.map((ride) => (
            <div
              key={ride.ride_id}
              className="p-4 border rounded bg-yellow-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{ride.pickup_location} ➜ {ride.dropoff_location}</p>
                <p className="text-sm text-gray-600">Distance: {ride.distance_km} km</p>
              </div>
              <button
                onClick={() => claimRide(ride.ride_id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Accept Ride
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;
