import React, { useState } from "react";
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/login";
import Home from "./Components/Home";
import './App.css';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowHome(true);
  };

  const handleLogout = () => {
    setShowHome(false);
    setShowLogin(true);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : showLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : showHome ? (
        <Home onLogout={handleLogout} />
      ) : (
        <div className="main-content">
          <h2>Welcome to the Menu Tagging System!</h2>
        </div>
      )}
    </>
  );
};

export default App;
