import React, { useState } from "react";
import MapComponent from "../../components/MapComponent";

const BookRidePage = () => {
  const [vehicle, setVehicle] = useState("Motorbike");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [message, setMessage] = useState("");

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const geocodeLocation = async (query, setCoordinates) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}`
    );

    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates;
      setCoordinates([lng, lat]);
    } else {
      setMessage("❌ Unable to find location: " + query);
    }
  };

  const handlePickupBlur = () => {
    if (pickup) geocodeLocation(pickup, setPickupCoordinates);
  };

  const handleDropoffBlur = () => {
    if (dropoff) geocodeLocation(dropoff, setDropoffCoordinates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickup || !dropoff || !pickupCoordinates || !dropoffCoordinates) {
      return setMessage("❌ Please provide valid pickup and dropoff locations.");
    }

    const user_id = localStorage.getItem("user_id");

    // Step 1: Get route info from Mapbox
    const directionsURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    const routeRes = await fetch(directionsURL);
    const routeData = await routeRes.json();
    const route = routeData.routes[0];

    if (!route) {
      return setMessage("❌ Couldn't find a route between locations.");
    }

    const distance = (route.distance / 1000).toFixed(2); // in km
    const duration = (route.duration / 60).toFixed(1); // in minutes
    const eta = new Date(Date.now() + route.duration * 1000).toISOString();

    // Step 2: Send data to backend
    const response = await fetch("http://localhost:5001/api/rides/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        vehicle,
        pickup,
        dropoff,
        distance,
        duration,
        eta,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      setMessage("✅ Ride booked successfully!");
      setPickup("");
      setDropoff("");
      setPickupCoordinates(null);
      setDropoffCoordinates(null);
    } else {
      setMessage("❌ Failed to book ride: " + (result.message || "Unknown error"));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Book a Ride</h3>
        {message && <p className="mb-4 text-sm text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vehicle type</label>
            <div className="flex items-center">
              {["Motorbike", "Car"].map((v) => (
                <label key={v} className="mr-4">
                  <input
                    type="radio"
                    value={v}
                    checked={vehicle === v}
                    onChange={() => setVehicle(v)}
                    className="mr-2"
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              onBlur={handlePickupBlur}
              placeholder="Enter pickup location"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              onBlur={handleDropoffBlur}
              placeholder="Enter dropoff location"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
          >
            Book Ride
          </button>
        </form>
      </div>

      {/* Map */}
      <div>
        <MapComponent
          pickupCoordinates={pickupCoordinates}
          dropoffCoordinates={dropoffCoordinates}
        />
      </div>
    </div>
  );
};

export default BookRidePage;
