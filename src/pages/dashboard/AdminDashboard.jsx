import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, LogOut, BarChart3, Users2, ShieldCheck } from "lucide-react";

const AdminDashboard = ({ user, onLogout }) => {
  const { email, username, role, phone_number } = user;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <p className="text-sm mb-6 text-gray-400">Welcome, {username}</p>

          <nav className="flex flex-col space-y-4">
            <Link
              to="/dashboard/admin/users"
              className="flex items-center space-x-2 hover:text-blue-400"
            >
              <Users2 size={18} /> <span>Manage Users</span>
            </Link>
            <Link
              to="/dashboard/admin/reports"
              className="flex items-center space-x-2 hover:text-blue-400"
            >
              <BarChart3 size={18} /> <span>Reports / Analytics</span>
            </Link>
            <Link
              to="/dashboard/admin/approvals"
              className="flex items-center space-x-2 hover:text-blue-400"
            >
              <ShieldCheck size={18} /> <span>Driver Approvals</span>
            </Link>
            <Link
              to="/dashboard/notifications"
              className="flex items-center space-x-2 hover:text-blue-400"
            >
              <Bell size={18} /> <span>Notifications</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-red-500 hover:text-red-400"
        >
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
