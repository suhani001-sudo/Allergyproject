import React, { useState, useEffect } from "react";
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/login";
import Signup from "./Components/Signup";
import UserDashboard from "./Components/UserDashboard";
import ResturantDashboard from "./Components/ResturantDashboard";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); 
  const [isSignup, setIsSignup] = useState(false); 

  useEffect(() => {
    // Check localStorage for login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedRole = localStorage.getItem("role");
    setIsLoggedIn(loggedIn);
    setRole(savedRole);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Handle login
  const handleLogin = (userRole) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole);
    setIsLoggedIn(true);
    setRole(userRole);
    setIsSignup(false); // after signup/login, reset
  };

  // ✅ Handle signup (same as login after registration)
  const handleSignup = (formData) => {
    console.log("Signed up:", formData);
    handleLogin(formData.role);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return isSignup ? (
      <Signup onSignup={handleSignup} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setIsSignup(true)} />
    );
  }

  if (role === "user") {
    return <UserDashboard onLogout={handleLogout} />;
  } else if (role === "restaurant") {
    return <ResturantDashboard onLogout={handleLogout} />;
  }

  return null;
}

export default App;
