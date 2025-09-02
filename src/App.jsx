import React, { useState, useEffect } from "react";
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/login";
import Home from "./Components/Home";
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check localStorage for login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    // show splash only for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // Decide what to show
  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return <Home onLogout={handleLogout} />;
}

export default App;
