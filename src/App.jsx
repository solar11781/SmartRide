import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./pages/ProfilePage";
import MyRides from "./pages/driver/MyRides";
import RegisterVehicle from "./pages/driver/RegisterVehicle";
import Notifications from "./pages/Notifications";
import BookRidePage from "./pages/passenger/BookRidePage";
import RideHistoryPage from "./pages/passenger/RideHistoryPage";
import PaymentsPage from "./pages/passenger/PaymentsPage";
import ManageUsers from "./pages/admin/ManageUsers";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import DriverApprovals from "./pages/admin/DriverApprovals";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      setIsLoggedIn(true); // user is logged in
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users away from login page */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route path="/register" element={<RegisterPage />} />

        {/* Default route */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
           <Route path="ride-history" element={<RideHistoryPage />} />

        {/* Dashboard layout with role-based nested rendering */}
        <Route
          path="/dashboard/*"
          element={<DashboardLayout setIsLoggedIn={setIsLoggedIn} />}
        >
          <Route path="my-rides" element={<MyRides />} />
          <Route path="register-vehicle" element={<RegisterVehicle />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="book-ride" element={<BookRidePage />} />
          <Route path="ride-history" element={<RideHistoryPage />} />
          <Route path="payment/:ride_id" element={<PaymentsPage />} />
          {/* Admin Dashboard nested routes */}
          <Route path="admin">
            <Route path="users" element={<ManageUsers />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="approvals" element={<DriverApprovals />} />
          </Route>
        </Route>

        {/* Fallback route (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
