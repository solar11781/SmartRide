import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./DashboardLayout";
import BookRidePage from "./pages/BookRidePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      console.log("LOCK TF IN");
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/dashboard/book-ride" />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard/book-ride" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route path="book-ride" element={<BookRidePage />} />
          <Route
            path="profile"
            element={<ProfilePage setIsLoggedIn={setIsLoggedIn} />} // Pass setIsLoggedIn to ProfilePage
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
