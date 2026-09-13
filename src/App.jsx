import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // <-- no Router here
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/login";
import Signup from "./Components/Signup";
import UserDashboard from "./Components/UserDashboard";
import ResturantDashboard from "./Components/ResturantDashboard";
import UserRestaurantPage from "./Components/UserRestaurantPage";
import AllergyInfo from "./Components/AllergyInfo";
import { CartProvider } from "./Components/CartContext";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/ContactUs";
import Profile from "./Components/Profile";
import RestaurantAboutUs from "./Components/RestaurantAboutUs";
import RestaurantProfile from "./Components/RestaurantProfile";
import RestaurantContactUs from "./Components/RestaurantContactUs";
import UserInbox from "./Components/UserInbox";
import AdminDashboard from "./Components/AdminDashboard";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  function handleLogin(userRole) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole);
    setIsLoggedIn(true);
    setRole(userRole);
    setIsSignup(false);
  }

  function handleSignup(formData) {
    console.log("User signed up:", formData);
    handleLogin(formData.role);
    setIsSignup(false);
  }

  function handleLogout() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggedIn(false);
      setRole(null);
      setIsSignup(false);
    } finally {
      const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
      window.location.href = `${base}login`;
    }
  }

  function handleSwitchToLogin() {
    setIsSignup(false);
  }

  if (showSplash) return <SplashScreen />;

  return (
    <CartProvider>
      <Routes>
        {/* Public pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Login & Signup */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} onSignup={handleSignup} onSwitchToSignup={() => setIsSignup(true)} />
            ) : (
              <Navigate
                to={
                  role === "user"
                    ? "/dashboard"
                    : role === "restaurant"
                    ? "/restaurant-dashboard"
                    : "/admin-dashboard"
                }
                replace
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isLoggedIn ? (
              <Signup onSignup={handleSignup} onLogin={handleLogin} onSwitchToLogin={handleSwitchToLogin} />
            ) : (
              <Navigate
                to={
                  role === "user"
                    ? "/dashboard"
                    : role === "restaurant"
                    ? "/restaurant-dashboard"
                    : "/admin-dashboard"
                }
                replace
              />
            )
          }
        />

        {/* User routes */}
        <Route
          path="/dashboard"
          element={isLoggedIn && role === "user" ? <UserDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/restaurants"
          element={isLoggedIn && role === "user" ? <UserRestaurantPage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/allergy-info"
          element={isLoggedIn && role === "user" ? <AllergyInfo /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn && role === "user" ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/inbox"
          element={isLoggedIn && role === "user" ? <UserInbox /> : <Navigate to="/login" replace />}
        />

        {/* Restaurant routes */}
        <Route
          path="/restaurant-dashboard"
          element={isLoggedIn && role === "restaurant" ? <ResturantDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/restaurant-about"
          element={isLoggedIn && role === "restaurant" ? <RestaurantAboutUs onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/restaurant-profile"
          element={isLoggedIn && role === "restaurant" ? <RestaurantProfile onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/restaurant-contact"
          element={isLoggedIn && role === "restaurant" ? <RestaurantContactUs onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />

        {/* Admin routes */}
        <Route
          path="/admin-dashboard"
          element={isLoggedIn && role === "admin" ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  role === "user"
                    ? "/dashboard"
                    : role === "restaurant"
                    ? "/restaurant-dashboard"
                    : "/admin-dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
