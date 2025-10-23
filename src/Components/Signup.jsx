import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // reuse the same login CSS for consistency

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // 'user' or 'restaurant'
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Signup attempt:", formData);
      setIsLoading(false);

      // Navigate to dashboards based on role
      if (formData.role === "user") {
        navigate("/user-dashboard");
      } else {
        navigate("/restaurant-dashboard");
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
        </div>

        {/* Sliding Forms */}
        <div className={`form-slider`}>
          <div
            className={`form-track ${
              formData.role === "user" ? "user-active" : "restaurant-active"
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
                      onClick={() => navigate("/login")}
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
                      onClick={() => navigate("/login")}
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
        <div className="switch-section">
          <div className="switch-prompt">Already have an account?</div>
          <button
            type="button"
            className="switch-button"
            onClick={() => onSwitchToLogin && onSwitchToLogin()}
          >
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
