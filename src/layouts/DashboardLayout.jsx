// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PassengerDashboard from "../pages/dashboard/PassengerDashboard";
import DriverDashboard from "../pages/dashboard/DriverDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";



const DashboardLayout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!username || !role) {
      navigate("/login");
    } else {
      setUser({ username, role });
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
