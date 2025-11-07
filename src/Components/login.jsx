import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ onLogin, onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // 'user', 'restaurant', or 'admin'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const previousRoleRef = useRef("user");
  const [slideDirection, setSlideDirection] = useState("to-left");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (role) => {
    const previousRole = previousRoleRef.current;
    if (previousRole !== role) {
      // Determine slide direction based on role order: user -> restaurant -> admin
      const roles = ["user", "restaurant", "admin"];
      const prevIndex = roles.indexOf(previousRole);
      const newIndex = roles.indexOf(role);
      setSlideDirection(newIndex > prevIndex ? "to-right" : "to-left");
      previousRoleRef.current = role;
    }
    setFormData((prev) => ({ ...prev, role }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      // Call backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log("Login successful:", data);
        
        // Pass role to App.jsx
        onLogin(formData.role);
      } else {
        // Show error message
        setErrors({
          ...errors,
          general: data.message || 'Login failed. Please try again.',
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.name === 'AbortError') {
        setErrors({
          ...errors,
          general: 'Backend server is not responding. Please make sure the backend server is running on port 5000.',
        });
      } else {
        setErrors({
          ...errors,
          general: 'Network error. Please check your connection and try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Login component rendering", { formData, errors, isLoading });
  
  return (
    <div className="login-container" style={{ minHeight: '100vh', background: '#6B8E23' }}>
      <div className="login-form-container" style={{ background: 'white', padding: '1.5rem', borderRadius: '23px', maxWidth: '400px', position: 'relative' }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: '23px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #6B8E23',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              <p style={{ color: '#6B8E23', fontWeight: 'bold' }}>Signing in...</p>
            </div>
          </div>
        )}
        
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="app-title">SafeBytes</h1>
          <p className="app-tagline">Your allergy-safe dining companion</p>
        </div>

        {/* Role Selector */}
        <div className="role-selector">
          <div
            className={`role-option ${
              formData.role === "user" ? "active" : ""
            }`}
            onClick={() => handleRoleChange("user")}
          >
            👤 User
          </div>
          <div
            className={`role-option ${
              formData.role === "restaurant" ? "active" : ""
            }`}
            onClick={() => handleRoleChange("restaurant")}
          >
            🏪 Restaurant Owner
          </div>
          <div
            className={`role-option ${
              formData.role === "admin" ? "active" : ""
            }`}
            onClick={() => handleRoleChange("admin")}
          >
            🔐 Admin
          </div>
        </div>

        {/* Sliding Forms */}
        <div className={`form-slider`}>
          <div
            className={`form-track ${
              formData.role === "user" ? "user-active" : 
              formData.role === "restaurant" ? "restaurant-active" : "admin-active"
            } ${slideDirection}`}
          >
            {/* User Slide */}
            <div className="slide">
              <h2 className="form-title">User Sign In</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email-user">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email-user"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required={formData.role === "user"}
                      style={{ padding: '0.8rem' }}
                    />
                  </div>
                  {errors.email && formData.role === "user" && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-user">Password</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="password-user"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required={formData.role === "user"}
                      style={{ padding: '0.8rem' }}
                    />
                  </div>
                  {errors.password && formData.role === "user" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                {/* General error message */}
                {errors.general && formData.role === "user" && (
                  <div className="error-message general-error" style={{
                    color: '#ff4444',
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    {errors.general}
                  </div>
                )}

                <div className="form-options">
                  <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>

                  {/* ✅ Signup section kept */}
                  <div className="signup-section">
                    <div className="signup-prompt">Don't have an account?</div>
                    <button
                      type="button"
                      className="signup-button"
                      onClick={() => navigate('/signup')} 
                    >
                      Sign up instead
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Restaurant Slide */}
            <div className="slide">
              <h2 className="form-title">Restaurant Owner Sign In</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email-restaurant">Business Email</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email-restaurant"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your business email"
                      required={formData.role === "restaurant"}
                      style={{ padding: '0.8rem' }}
                    />
                  </div>
                  {errors.email && formData.role === "restaurant" && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-restaurant">Password</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="password-restaurant"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required={formData.role === "restaurant"}
                      style={{ padding: '0.8rem' }}
                    />
                  </div>
                  {errors.password && formData.role === "restaurant" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                {/* General error message */}
                {errors.general && formData.role === "restaurant" && (
                  <div className="error-message general-error" style={{
                    color: '#ff4444',
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    {errors.general}
                  </div>
                )}

                <div className="form-options">
                  <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>

                  {/* ✅ Signup section kept */}
                  <div className="signup-section">
                    <div className="signup-prompt">Don't have an account?</div>
                    <button
                      type="button"
                      className="signup-button"
                      onClick={() => navigate('/signup')}
                    >
                      Sign up instead
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Admin Slide */}
            <div className="slide">
              <h2 className="form-title">Admin Sign In</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email-admin">Admin Email</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email-admin"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter admin email"
                      required={formData.role === "admin"}
                      style={{ padding: '0.8rem' }}
                    />
                  </div>
                  {errors.email && formData.role === "admin" && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-admin">Password</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="password-admin"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      required={formData.role === "admin"}
                      style={{ padding: '0.8rem' }}
                    />
                  </div>
                  {errors.password && formData.role === "admin" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                {/* General error message */}
                {errors.general && formData.role === "admin" && (
                  <div className="error-message general-error" style={{
                    color: '#ff4444',
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    {errors.general}
                  </div>
                )}

                <div className="form-options">
                  <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>

                  {/* ✅ Signup section for admin */}
                  <div className="signup-section">
                    <div className="signup-prompt">Don't have an account?</div>
                    <button
                      type="button"
                      className="signup-button"
                      onClick={() => navigate('/signup')}
                    >
                      Sign up instead
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
