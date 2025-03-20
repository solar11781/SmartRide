import React, { useState } from "react";

const BookRidePage = () => {
  const [vehicle, setVehicle] = useState("Motorbike");

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Book a Ride</h3>
      {/* Add your booking form or ride details here */}
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Vehicle type
          </label>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="radio"
                id="Motorbike"
                name="vehicle"
                value="Motorbike"
                checked={vehicle === "Motorbike"}
                onChange={() => setVehicle("Motorbike")}
                className="mr-2"
              />
              Motorbike
            </label>
            <label className="mr-4">
              <input
                type="radio"
                id="Car"
                name="vehicle"
                value="Car"
                checked={vehicle === "Car"}
                onChange={() => setVehicle("Car")}
                className="mr-2"
              />
              Car
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your pickup location"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Dropoff Location
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your dropoff location"
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
  );
};

export default BookRidePage;
