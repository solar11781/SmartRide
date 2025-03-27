// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PassengerDashboard from "../pages/passenger/PassengerDashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

const DashboardLayout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const phone_number = localStorage.getItem("phone_number");

    if (!username || !role) {
      navigate("/login");
    } else {
      setUser({ email, username, role, phone_number });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // trigger logout state
    navigate("/login");
  };

  if (!user) return null;

  switch (user.role) {
    case "customer":
      return <PassengerDashboard user={user} onLogout={handleLogout} />;
    case "driver":
      return <DriverDashboard user={user} onLogout={handleLogout} />;
    case "admin":
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    default:
      return <p className="text-center mt-10">Invalid role.</p>;
  }
};




export default DashboardLayout;
