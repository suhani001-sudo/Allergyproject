import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // reuse the same login CSS for consistency

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // 'user', 'restaurant', or 'admin'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const previousRoleRef = useRef("user");
  const [slideDirection, setSlideDirection] = useState("to-left");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

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

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log("Signup successful:", data);
        
        // Call onSignup callback to update App.jsx state
        onSignup(formData);
      } else {
        // Show error message
        setErrors({
          ...errors,
          general: data.message || 'Signup failed. Please try again.',
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        ...errors,
        general: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="app-title">SafeBytes</h1>
          <p className="app-tagline">Your allergy-safe dining companion</p>
        </div>

        {/* Role Selector */}
        <div className="role-selector">
          <div
            className={`role-option ${formData.role === "user" ? "active" : ""}`}
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
            {/* User Signup */}
            <div className="slide">
              <h2 className="form-title">User Sign Up</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="name-user">Full Name</label>
                  <input
                    type="text"
                    id="name-user"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required={formData.role === "user"}
                  />
                  {errors.name && formData.role === "user" && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email-user">Email Address</label>
                  <input
                    type="email"
                    id="email-user"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required={formData.role === "user"}
                  />
                  {errors.email && formData.role === "user" && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-user">Password</label>
                  <input
                    type="password"
                    id="password-user"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required={formData.role === "user"}
                  />
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
                    className="signup-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>

                  <div className="signup-section">
                    <div className="signup-prompt">Already have an account?</div>
                    <button
                      type="button"
                      className="login-switch"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Restaurant Signup */}
            <div className="slide">
              <h2 className="form-title">Restaurant Owner Sign Up</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="name-restaurant">Owner Name</label>
                  <input
                    type="text"
                    id="name-restaurant"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required={formData.role === "restaurant"}
                  />
                  {errors.name && formData.role === "restaurant" && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email-restaurant">Business Email</label>
                  <input
                    type="email"
                    id="email-restaurant"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your business email"
                    required={formData.role === "restaurant"}
                  />
                  {errors.email && formData.role === "restaurant" && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-restaurant">Password</label>
                  <input
                    type="password"
                    id="password-restaurant"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required={formData.role === "restaurant"}
                  />
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
                    className="signup-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>

                  <div className="signup-section">
                    <div className="signup-prompt">Already have an account?</div>
                    <button
                      type="button"
                      className="login-switch"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Admin Signup */}
            <div className="slide">
              <h2 className="form-title">Admin Sign Up</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="name-admin">Admin Name</label>
                  <input
                    type="text"
                    id="name-admin"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required={formData.role === "admin"}
                  />
                  {errors.name && formData.role === "admin" && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email-admin">Admin Email</label>
                  <input
                    type="email"
                    id="email-admin"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your admin email"
                    required={formData.role === "admin"}
                  />
                  {errors.email && formData.role === "admin" && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-admin">Password</label>
                  <input
                    type="password"
                    id="password-admin"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required={formData.role === "admin"}
                  />
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
                    className="signup-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>

                  <div className="signup-section">
                    <div className="signup-prompt">Already have an account?</div>
                    <button
                      type="button"
                      className="login-switch"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Back to Login Section */}
        {/* <div className="switch-section">
          <div className="switch-prompt">Already have an account?</div>
          <button
            type="button"
            className="switch-button"
            onClick={() => onSwitchToLogin && onSwitchToLogin()}
          >
            Sign in instead
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Signup;
