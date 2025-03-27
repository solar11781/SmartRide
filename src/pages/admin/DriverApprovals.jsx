import React, { useEffect, useState } from "react";
import axios from "axios";

const DriverApprovals = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Fetch all drivers
    axios
      .get("http://localhost:5001/api/auth/drivers")
      .then((response) => setDrivers(response.data))
      .catch((error) => console.error("Error fetching drivers:", error));
  }, []);

  const handleVerify = (driver_id) => {
    // Verify driver
    axios
      .post("http://localhost:5001/api/auth/drivers/verify", { user_id: driver_id })
      .then(() => {
        // Update the driver list after verification
        setDrivers(
          drivers.map((driver) =>
            driver.user_id === driver_id ? { ...driver, is_verified: 1 } : driver
          )
        );
      })
      .catch((error) => console.error("Error verifying driver:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Driver Approvals</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Username</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Email</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Phone Number</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300 w-40">ID Card</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300 w-40">Driver License</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300 w-40">Insurance Document</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Vehicle Color</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Status / Action</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => (
            <tr
              key={driver.user_id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="py-3 px-4 text-center border-b border-gray-300">{driver.username}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">{driver.email}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">{driver.phone_number}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                <img
                  src={`http://localhost:5001/${driver.id_card}`}
                  alt="ID Card"
                  className="w-32 h-32 object-cover mx-auto"
                />
              </td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                <img
                  src={`http://localhost:5001/${driver.driver_license}`}
                  alt="Driver License"
                  className="w-32 h-32 object-cover mx-auto"
                />
              </td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                <img
                  src={`http://localhost:5001/${driver.insurance_document}`}
                  alt="Insurance Document"
                  className="w-32 h-32 object-cover mx-auto"
                />
              </td>
              <td className="py-3 px-4 text-center border-b border-gray-300">{driver.vehicle_color}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">
                {driver.is_verified === 0 ? (
                  <button
                    onClick={() => handleVerify(driver.user_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Verify
                  </button>
                ) : (
                  <span className="text-green-500 font-semibold">Verified</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverApprovals;