import { Link, Outlet } from "react-router-dom";
import {
  FaCarSide,
  FaListAlt,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";

const DriverDashboard = ({ user, onLogout }) => {
  const username = user?.username || "Unknown Driver";
  const role = user?.role || "driver";
  const user_id = user?.user_id || localStorage.getItem("user_id");

  const [manualLocation, setManualLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveLocation = async () => {
    if (!manualLocation.trim()) return alert("❌ Please enter a location.");
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:5001/api/driver/location/${user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: manualLocation.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        alert("📍 Location saved!");
      } else {
        alert("❌ Failed to save location.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r p-5 shadow-lg">
        <div className="text-center mb-6">
          <FaUserCircle size={50} className="mx-auto text-blue-500" />
          <h2 className="text-lg font-semibold mt-2">{username}</h2>
          <p className="text-sm text-gray-500">{role.toUpperCase()}</p>
        </div>

        <nav className="flex flex-col gap-4">
          <Link
            to="/dashboard/my-rides"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <FaListAlt /> My Assigned Rides
          </Link>

          <Link
            to="/dashboard/register-vehicle"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <FaCarSide /> Register Vehicle
          </Link>

          <Link
            to="/dashboard/notifications"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <FaBell /> Notifications
          </Link>

          <Link
            to="/dashboard/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <FaUserCircle /> Profile
          </Link>

          {/* Manual Location Input */}
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-gray-600">
              <FaMapMarkerAlt className="inline-block mr-2" />
              Set My Location
            </label>
            <input
              type="text"
              placeholder="Enter your city (e.g. Ha Noi)"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={handleSaveLocation}
              disabled={saving}
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            >
              {saving ? "Saving..." : "Save Location"}
            </button>
          </div>

          <button
            onClick={onLogout}
            className="flex cursor-pointer items-center gap-2 text-red-500 hover:text-red-700 mt-10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DriverDashboard;
