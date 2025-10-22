import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./Components/Splashscreen";
import Login from "./Components/login";
import Signup from "./Components/Signup";
import UserDashboard from "./Components/UserDashboard";
import ResturantDashboard from "./Components/ResturantDashboard";
import UserRestaurantPage from "./Components/UserRestaurantPage";
import { CartProvider } from "./Components/CartContext";
import AboutUs from "./Components/AboutUs";
import "./App.css";

function App() {
  // STEP 1: Set up state variables for the app
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(function() {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [role, setRole] = useState(function() {
    return localStorage.getItem("role") || null;
  }); 
  const [isSignup, setIsSignup] = useState(false); 

  // STEP 2: Check if user is already logged in when app starts
  useEffect(function() {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(function() {
      setShowSplash(false);
    }, 2000);

    // Clean up timer when component unmounts
    return function() {
      clearTimeout(timer);
    };
  }, []);

  // STEP 3: Function to handle user login
  function handleLogin(userRole) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole);
    setIsLoggedIn(true);
    setRole(userRole);
    setIsSignup(false); // Reset signup state after login
  }

  // STEP 4: Function to handle user signup
  function handleSignup(formData) {
    console.log("User signed up:", formData);
    handleLogin(formData.role);
    setIsSignup(false); // Reset signup state after successful signup
  }

  // STEP 5: Function to handle user logout
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    setIsSignup(false); // Reset signup state on logout
  }

  // STEP 5.1: Function to handle switching back to login from signup
  function handleSwitchToLogin() {
    setIsSignup(false);
  }

  // STEP 6: Show splash screen if needed
  if (showSplash) {
    return <SplashScreen />;
  }

  // STEP 6.1: Show signup page if needed
  if (isSignup && !isLoggedIn) {
    return (
      <CartProvider>
        <Router>
          <Routes>
            {/* Public About page */}
            <Route 
              path="/about-us" 
              element={<AboutUs />} 
            />
            <Route 
              path="/signup" 
              element={
                <Signup 
                  onSignup={handleSignup} 
                  onSwitchToLogin={handleSwitchToLogin}
                />
              } 
            />
            <Route 
              path="*" 
              element={<Navigate to="/signup" replace />} 
            />
          </Routes>
        </Router>
      </CartProvider>
    );
  }

  // STEP 6.2: Show login page if not logged in and not in signup mode
  if (!isLoggedIn && !isSignup) {
    return (
      <CartProvider>
        <Router>
          <Routes>
            {/* Public About page */}
            <Route 
              path="/about-us" 
              element={<AboutUs />} 
            />
            <Route 
              path="/login" 
              element={
                <Login 
                  onLogin={handleLogin} 
                  onSwitchToSignup={function() { setIsSignup(true); }} 
                />
              }
            />
            <Route 
              path="*" 
              element={<Navigate to="/login" replace />} 
            />
          </Routes>
        </Router>
      </CartProvider>
    );
  }

  // STEP 7: Return the main app with routing
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public About page */}
          <Route 
            path="/about-us" 
            element={<AboutUs />} 
          />
          {/* STEP 8: Login page route */}
          <Route 
            path="/login" 
            element={
              !isLoggedIn ? (
                <Login 
                  onLogin={handleLogin} 
                  onSwitchToSignup={function() { setIsSignup(true); }} 
                />
              ) : (
                <Navigate to={role === "user" ? "/dashboard" : "/restaurant-dashboard"} replace />
              )
            } 
          />
          
          {/* STEP 9: Signup page route */}
          <Route 
            path="/signup" 
            element={
              !isLoggedIn ? (
                <Signup 
                  onSignup={handleSignup} 
                  onSwitchToLogin={handleSwitchToLogin}
                />
              ) : (
                <Navigate to={role === "user" ? "/dashboard" : "/restaurant-dashboard"} replace />
              )
            } 
          />

          {/* STEP 10: User dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn && role === "user" ? (
                <UserDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* STEP 11: Restaurant page route for users */}
          <Route 
            path="/restaurants" 
            element={
              isLoggedIn && role === "user" ? (
                <UserRestaurantPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* STEP 12: Restaurant dashboard route for restaurant owners */}
          <Route 
            path="/restaurant-dashboard" 
            element={
              isLoggedIn && role === "restaurant" ? (
                <ResturantDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* STEP 13: Default route - redirect to appropriate page */}
          <Route 
            path="/" 
            element={
              <Navigate to={isLoggedIn ? (role === "user" ? "/dashboard" : "/restaurant-dashboard") : "/login"} replace />
            } 
          />
          
          {/* STEP 14: Catch all other routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
