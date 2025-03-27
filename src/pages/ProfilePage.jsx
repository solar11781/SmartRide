import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Get user data from localStorage
  const user_id = localStorage.getItem("user_id");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [phone_number, setPhoneNumber] = useState(localStorage.getItem("phone_number") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const type = localStorage.getItem("role");

  // Driver-specific details
  const [driverDetails, setDriverDetails] = useState(null);

  // Fetch driver details if the user is a driver
  useEffect(() => {
    if (type === "driver") {
      fetch(`http://localhost:5001/api/auth/drivers/${user_id}`)
        .then((response) => response.json())
        .then((data) => setDriverDetails(data))
        .catch((error) =>
          console.error("Error fetching driver details:", error)
        );
    }
  }, [type, user_id]);

  // Handle save changes
  const handleSaveChanges = () => {
    fetch("http://localhost:5001/api/auth/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, username, email, phone_number }),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error saving changes:", error));
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch(`http://localhost:5001/api/auth/users/${user_id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          localStorage.clear();
          setIsLoggedIn(false);
          navigate("/login", { replace: true });
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Your Profile</h3>

      {/* User Information */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">General Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={type}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Driver Details */}
      {type === "driver" && driverDetails && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Driver Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Card
              </label>
              <img
                src={`http://localhost:5001/${driverDetails.id_card}`}
                alt="ID Card"
                className="mt-1 w-full h-80 object-contain border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Driver License
              </label>
              <img
                src={`http://localhost:5001/${driverDetails.driver_license}`}
                alt="Driver License"
                className="mt-1 w-full h-80 object-contain border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Insurance Document
              </label>
              <img
                src={`http://localhost:5001/${driverDetails.insurance_document}`}
                alt="Insurance Document"
                className="mt-1 w-full h-80 object-contain border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Plate
              </label>
              <input
                type="text"
                value={driverDetails.license_plate}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <input
                type="text"
                value={driverDetails.vehicle_type}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Color
              </label>
              <input
                type="text"
                value={driverDetails.vehicle_color}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verification Status
              </label>
              <input
                type="text"
                value={driverDetails.is_verified ? "Verified" : "Not Verified"}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Changes and Delete Account Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
