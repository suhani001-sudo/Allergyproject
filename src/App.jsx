import React, { useState, useEffect } from "react";
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/Login";
import UserDashboard from "./Components/UserDashboard";
import ResturantDashboard from "./Components/ResturantDashboard";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("splash");

  // Splash → Login after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage("login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (role) => {
    if (role === "user") {
      setCurrentPage("user");
    } else if (role === "restaurant") {
      setCurrentPage("restaurant");
    }
  };

  const handleLogout = () => {
    setCurrentPage("login");
  };

  // Page switcher
  const renderPage = () => {
    switch (currentPage) {
      case "splash":
        return <SplashScreen />;
      case "login":
        return <Login onLogin={handleLogin} />;
      case "user":
        return <UserDashboard onLogout={handleLogout} />;
      case "restaurant":
        return <ResturantDashboard onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
