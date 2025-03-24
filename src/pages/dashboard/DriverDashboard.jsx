import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCarSide, FaListAlt, FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (role !== "Driver") navigate("/login");
    setUser({ username, role });
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r p-5 shadow-lg">
        <div className="text-center mb-6">
          <FaUserCircle size={50} className="mx-auto text-blue-500" />
          <h2 className="text-lg font-semibold mt-2">{user.username}</h2>
          <p className="text-sm text-gray-500">Driver</p>
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

          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-10"
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
