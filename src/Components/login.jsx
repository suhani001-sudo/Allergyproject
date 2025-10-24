import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ onLogin, onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // 'user' or 'restaurant'
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
      setSlideDirection(
        previousRole === "user" && role === "restaurant"
          ? "to-right"
          : "to-left"
      );
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

    // Simulate API call
    setTimeout(() => {
      console.log("Login attempt:", formData);
      setIsLoading(false);

      // ✅ Pass role to App.jsx
      if (formData.email && formData.password) {
        onLogin(formData.role);
      }
    }, 1500);
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
        </div>

        {/* Sliding Forms */}
        <div className={`form-slider`}>
          <div
            className={`form-track ${
              formData.role === "user" ? "user-active" : "restaurant-active"
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
                    />
                  </div>
                  {errors.password && formData.role === "user" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

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
                      onClick={() => onSwitchToSignup && onSwitchToSignup()} 
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
                    />
                  </div>
                  {errors.password && formData.role === "restaurant" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

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
                      onClick={() => onSwitchToSignup()}
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
