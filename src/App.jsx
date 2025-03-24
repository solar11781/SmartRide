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

import BookRidePage from "./pages/BookRidePage";
import ProfilePage from "./pages/ProfilePage";

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

        {/* Dashboard layout with role-based nested rendering */}
        <Route
          path="/dashboard/*"
          element={<DashboardLayout setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Fallback route (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
