import React, { useState, useEffect } from "react";
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/login";
import UserDashboard from "./Components/UserDashboard";
import ResturantDashboard from "./Components/ResturantDashboard";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // check localStorage for login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedRole = localStorage.getItem("role");

    if (loggedIn && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (userRole) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole);
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  // Splashscreen
  if (showSplash) {
    return <SplashScreen />;
  }

  // If not logged in → show Login
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // If logged in → show dashboard by role
  return role === "user" ? (
    <UserDashboard onLogout={handleLogout} />
  ) : (
    <ResturantDashboard onLogout={handleLogout} />
  );
}

export default App;
