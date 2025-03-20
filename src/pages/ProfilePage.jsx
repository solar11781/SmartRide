import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Get user data from localStorage
  const user_id = localStorage.getItem("user_id");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [phone_number, setPhoneNumber] = useState(
    localStorage.getItem("phone_number")
  );
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const raw_type = localStorage.getItem("role");
  const type =
    String(raw_type).charAt(0).toUpperCase() + String(raw_type).slice(1);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost/apis.php/user_id/${user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            phone_number,
          }),
        }
      );

      const data = await response.json();
      console.log("Update Response:", data);

      if (data == 1) {
        // Update localStorage with new values
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("phone_number", phone_number);

        console.log("Profile updated successfully!");
      } else {
        console.error(
          "Failed to update profile:",
          data.message || "Unknown error."
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return; // Stop execution if user cancels deletion
    }

    try {
      const response = await fetch(
        `http://localhost/apis.php/user_id/${user_id}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            user_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Delete Response:", data);

      if (data == 1) {
        console.log("Your account has been deleted.");
        localStorage.clear();
        setIsLoggedIn(false);

        // Redirect to login page
        navigate("/login");
      } else {
        console.error(
          "Failed to delete account:",
          data.message || "Unknown error."
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Profile</h3>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter your username"
        />
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter your phone number"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter your email"
        />
      </div>

      {/* User's Role */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          User's Role
        </label>
        <input
          type="text"
          value={type}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          placeholder="User's role (customer, driver, admin)"
        />
      </div>

      {/* Save Changes Button */}
      <button
        type="button"
        onClick={handleSaveChanges}
        className="w-full py-2 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
      >
        Save Changes
      </button>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2 cursor-pointer mt-4 bg-red-500 hover:bg-red-700 text-white rounded-lg"
      >
        Log Out
      </button>

      {/* Delete account Button */}
      <button
        type="button"
        onClick={handleDeleteAccount}
        className="w-full py-2 cursor-pointer mt-4 bg-red-500 hover:bg-red-700 text-white rounded-lg"
      >
        Delete account
      </button>
    </div>
  );
};

export default ProfilePage;
