import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Store,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import "./login.css";

const AuthCard = ({
  initialMode = "login",
  onLogin,
  onSignup,
  onSwitchToSignup,
  onSwitchToLogin
}) => {
  const navigate = useNavigate();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname.includes("signup") ? "signup" : initialMode;
    }
    return initialMode;
  });

  // Keep state in sync with browser back/forward without unmounting
  useEffect(() => {
    const handlePopState = () => {
      const isSignup = window.location.pathname.includes("signup");
      setMode(isSignup ? "signup" : "login");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Shared active role: 'user' | 'restaurant' | 'admin'
  const [role, setRole] = useState("user");

  // Sign In Form State
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form State
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Mobile touch swipe support
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50 && mode === "login") {
      switchMode("signup");
    } else if (distance < -50 && mode === "signup") {
      switchMode("login");
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Fluid switch without unmounting DOM so the swiper animation ALWAYS triggers smoothly
  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setLoginErrors({});
    setSignupErrors({});

    // Update browser URL without route unmount so CSS transitions play
    const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : "/";
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    const targetPath = newMode === "signup" ? `${cleanBase}signup` : `${cleanBase}login`;
    window.history.pushState(null, "", targetPath);

    if (newMode === "signup" && typeof onSwitchToSignup === "function") {
      onSwitchToSignup();
    } else if (newMode === "login" && typeof onSwitchToLogin === "function") {
      onSwitchToLogin();
    }
  };

  // Sign In Handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginData.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!loginData.password) {
      errs.password = "Password is required";
    } else if (loginData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoginLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch("https://safebytes-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          role: role,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);
        localStorage.setItem("isLoggedIn", "true");

        if (typeof onLogin === "function") {
          onLogin(role);
        } else {
          const dest = role === "user" ? "/dashboard" : role === "restaurant" ? "/restaurant-dashboard" : "/admin-dashboard";
          navigate(dest);
        }
      } else {
        setLoginErrors({
          general: data.message || "Invalid email or password. Please try again.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.name === "AbortError") {
        setLoginErrors({
          general: "Server response timed out. Please try again.",
        });
      } else {
        setLoginErrors({
          general: "Network connection error. Please check your connection.",
        });
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Sign Up Handlers
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (signupErrors[name]) {
      setSignupErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupData.name.trim()) {
      errs.name = role === "restaurant" ? "Business name is required" : "Full name is required";
    }
    if (!signupData.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!signupData.password) {
      errs.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setIsSignupLoading(true);
    try {
      const response = await fetch("https://safebytes-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);
        localStorage.setItem("isLoggedIn", "true");

        if (typeof onSignup === "function") {
          onSignup({ name: signupData.name, email: signupData.email, role: role });
        } else if (typeof onLogin === "function") {
          onLogin(role);
        } else {
          const dest = role === "user" ? "/dashboard" : role === "restaurant" ? "/restaurant-dashboard" : "/admin-dashboard";
          navigate(dest);
        }
      } else {
        setSignupErrors({
          general: data.message || "Signup failed. This email may already be registered.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setSignupErrors({
        general: "Network connection error. Please try again.",
      });
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Main Dual-Sliding Auth Card */}
      <div
        className={`auth-card ${mode === "signup" ? "right-panel-active" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Segmented Swiper Toggle */}
        <div className="mobile-auth-switcher">
          <div
            className="mobile-slider-pill"
            style={{
              transform: mode === "login" ? "translateX(0%)" : "translateX(100%)",
            }}
          />
          <button
            type="button"
            className={`mobile-switch-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`mobile-switch-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Sliding Form Panels Container */}
        <div className="auth-card-body">
          {/* -------------------- SIGN IN PANEL -------------------- */}
          <div className="form-panel sign-in-panel">
            <div className="form-panel-content">
              <div className="auth-brand-header">
                <div className="auth-logo-badge">
                  <img
                    src={`${import.meta.env.BASE_URL}images/green_logo.jpg`}
                    alt="SafeBytes"
                    className="auth-logo-img"
                    onError={(e) => {
                      e.currentTarget.src = `${import.meta.env.BASE_URL}images/greelogo.png`;
                    }}
                  />
                  <span className="auth-brand-name">SafeBytes</span>
                </div>
                <h2 className="auth-title">Sign In</h2>
              </div>

              {/* Role Glider with Lucide Icons */}
              <div className="role-glider-container">
                <div
                  className="role-glider-pill"
                  style={{
                    left: role === "user" ? "3px" : role === "restaurant" ? "calc(33.333% + 1px)" : "calc(66.666% + 1px)",
                    width: "calc(33.333% - 4px)",
                  }}
                />
                <button
                  type="button"
                  className={`role-tab-btn ${role === "user" ? "active" : ""}`}
                  onClick={() => setRole("user")}
                >
                  <User size={14} className="role-icon-lucide" />
                  <span>User</span>
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${role === "restaurant" ? "active" : ""}`}
                  onClick={() => setRole("restaurant")}
                >
                  <Store size={14} className="role-icon-lucide" />
                  <span>Restaurant</span>
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${role === "admin" ? "active" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  <ShieldCheck size={14} className="role-icon-lucide" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Error Banner */}
              {loginErrors.general && (
                <div className="auth-alert-banner">
                  <AlertCircle size={16} className="alert-icon-lucide" />
                  <span>{loginErrors.general}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
                {/* Email Input */}
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="login-email">
                    {role === "restaurant" ? "Business Email" : role === "admin" ? "Admin Email" : "Email Address"}
                  </label>
                  <div className={`auth-input-box ${loginErrors.email ? "has-error" : ""}`}>
                    <Mail size={17} className="input-icon-lucide" />
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder={
                        role === "restaurant"
                          ? "business@restaurant.com"
                          : role === "admin"
                          ? "admin@safebytes.com"
                          : "name@example.com"
                      }
                      autoComplete="email"
                    />
                  </div>
                  {loginErrors.email && <span className="auth-field-error">{loginErrors.email}</span>}
                </div>

                {/* Password Input */}
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="login-password">
                    Password
                  </label>
                  <div className={`auth-input-box ${loginErrors.password ? "has-error" : ""}`}>
                    <Lock size={17} className="input-icon-lucide" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      id="login-password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      tabIndex="-1"
                      title={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                  </div>
                  {loginErrors.password && <span className="auth-field-error">{loginErrors.password}</span>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="auth-submit-btn" disabled={isLoginLoading}>
                  {isLoginLoading ? (
                    <>
                      <span className="auth-spinner" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={17} className="btn-arrow-lucide" />
                    </>
                  )}
                </button>

                {/* Mobile Switch Prompt */}
                <div className="mobile-switch-footer">
                  <span>Don't have an account?</span>
                  <button type="button" className="text-link-btn" onClick={() => switchMode("signup")}>
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* -------------------- SIGN UP PANEL -------------------- */}
          <div className="form-panel sign-up-panel">
            <div className="form-panel-content">
              <div className="auth-brand-header">
                <div className="auth-logo-badge">
                  <img
                    src={`${import.meta.env.BASE_URL}images/green_logo.jpg`}
                    alt="SafeBytes"
                    className="auth-logo-img"
                    onError={(e) => {
                      e.currentTarget.src = `${import.meta.env.BASE_URL}images/greelogo.png`;
                    }}
                  />
                  <span className="auth-brand-name">SafeBytes</span>
                </div>
                <h2 className="auth-title">Create Account</h2>
              </div>

              {/* Role Glider with Lucide Icons */}
              <div className="role-glider-container">
                <div
                  className="role-glider-pill"
                  style={{
                    left: role === "user" ? "3px" : role === "restaurant" ? "calc(33.333% + 1px)" : "calc(66.666% + 1px)",
                    width: "calc(33.333% - 4px)",
                  }}
                />
                <button
                  type="button"
                  className={`role-tab-btn ${role === "user" ? "active" : ""}`}
                  onClick={() => setRole("user")}
                >
                  <User size={14} className="role-icon-lucide" />
                  <span>User</span>
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${role === "restaurant" ? "active" : ""}`}
                  onClick={() => setRole("restaurant")}
                >
                  <Store size={14} className="role-icon-lucide" />
                  <span>Restaurant</span>
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${role === "admin" ? "active" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  <ShieldCheck size={14} className="role-icon-lucide" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Error Banner */}
              {signupErrors.general && (
                <div className="auth-alert-banner">
                  <AlertCircle size={16} className="alert-icon-lucide" />
                  <span>{signupErrors.general}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="auth-form" noValidate>
                {/* Name Input */}
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="signup-name">
                    {role === "restaurant" ? "Restaurant / Owner Name" : role === "admin" ? "Admin Name" : "Full Name"}
                  </label>
                  <div className={`auth-input-box ${signupErrors.name ? "has-error" : ""}`}>
                    <User size={17} className="input-icon-lucide" />
                    <input
                      type="text"
                      id="signup-name"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      placeholder={role === "restaurant" ? "Restaurant or Owner Name" : "Your Name"}
                      autoComplete="name"
                    />
                  </div>
                  {signupErrors.name && <span className="auth-field-error">{signupErrors.name}</span>}
                </div>

                {/* Email Input */}
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="signup-email">
                    {role === "restaurant" ? "Business Email" : role === "admin" ? "Admin Email" : "Email Address"}
                  </label>
                  <div className={`auth-input-box ${signupErrors.email ? "has-error" : ""}`}>
                    <Mail size={17} className="input-icon-lucide" />
                    <input
                      type="email"
                      id="signup-email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder={
                        role === "restaurant"
                          ? "business@restaurant.com"
                          : role === "admin"
                          ? "admin@safebytes.com"
                          : "name@example.com"
                      }
                      autoComplete="email"
                    />
                  </div>
                  {signupErrors.email && <span className="auth-field-error">{signupErrors.email}</span>}
                </div>

                {/* Password Input */}
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="signup-password">
                    Password
                  </label>
                  <div className={`auth-input-box ${signupErrors.password ? "has-error" : ""}`}>
                    <Lock size={17} className="input-icon-lucide" />
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      id="signup-password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      tabIndex="-1"
                      title={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                  </div>
                  {signupErrors.password && <span className="auth-field-error">{signupErrors.password}</span>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="auth-submit-btn" disabled={isSignupLoading}>
                  {isSignupLoading ? (
                    <>
                      <span className="auth-spinner" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <ArrowRight size={17} className="btn-arrow-lucide" />
                    </>
                  )}
                </button>

                {/* Mobile Switch Prompt */}
                <div className="mobile-switch-footer">
                  <span>Already have an account?</span>
                  <button type="button" className="text-link-btn" onClick={() => switchMode("login")}>
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* -------------------- SLIDING OVERLAY CONTAINER (DESKTOP) -------------------- */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Left Overlay (Revealed during Sign Up mode) */}
            <div className="overlay-panel overlay-left">
              <h2 className="overlay-title">Welcome Back!</h2>
              <p className="overlay-text">
                Already registered with SafeBytes? Sign in to access your allergy card, safe menus, and track favorites.
              </p>
              <button
                type="button"
                className="overlay-swipe-btn"
                onClick={() => switchMode("login")}
              >
                <ArrowLeft size={16} />
                <span>Sign In</span>
              </button>
            </div>

            {/* Right Overlay (Revealed during Sign In mode) */}
            <div className="overlay-panel overlay-right">
              <h2 className="overlay-title">New Here?</h2>
              <p className="overlay-text">
                Create a SafeBytes account to personalize your dietary needs and explore certified allergy-safe dining.
              </p>
              <button
                type="button"
                className="overlay-swipe-btn"
                onClick={() => switchMode("signup")}
              >
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
