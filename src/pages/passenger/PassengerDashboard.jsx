import { Link, Outlet } from "react-router-dom";
import {
  FaRoute,
  FaHistory,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaExclamationCircle,
} from "react-icons/fa";

const PassengerDashboard = ({ user, onLogout }) => {
  const { username } = user;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">
          🚕 SmartRide - Passenger Dashboard
        </h1>
        <div className="text-sm">
          Welcome, <span className="font-semibold">{username}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-5 space-y-6">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/dashboard/book-ride"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaRoute /> <span>Book a Ride</span>
            </Link>

            <Link
              to="/dashboard/ride-history"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaHistory /> <span>Ride History</span>
            </Link>

            <Link
              to="/dashboard/notifications"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaBell /> <span>Notifications</span>
            </Link>

            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaUser /> <span>Profile</span>
            </Link>

            <Link
              to="/dashboard/report-problem"
              className="flex items-center space-x-2 text-red-500 hover:text-red-700"
            >
              <FaExclamationCircle /> <span>Report a Problem</span>
            </Link>
          </nav>

          <button
            onClick={onLogout}
            className="flex cursor-pointer items-center space-x-2 text-red-500 hover:text-red-700 mt-10"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
