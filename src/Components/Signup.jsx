import React, { useState, useRef } from "react";


const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // 'user' or 'restaurant'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const previousRoleRef = useRef("user");
  const [slideDirection, setSlideDirection] = useState("to-left");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        previousRole === "user" && role === "restaurant" ? "to-right" : "to-left"
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Signup attempt:", formData);
      setIsLoading(false);

      if (onSignup) {
        onSignup(formData);
      }
    }, 1500);
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="app-title">SafeBytes</h1>
          <p className="app-tagline">Join our allergy-safe dining community</p>
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
              formData.role === "user"
                ? "user-active"
                : "restaurant-active"
            } ${slideDirection}`}
          >
            {/* User Signup */}
            <div className="slide">
              <h2 className="form-title">User Sign Up</h2>
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="name-user">Full Name</label>
                  <input
                    type="text"
                    id="name-user"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
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
                    placeholder="Enter password"
                  />
                  {errors.password && formData.role === "user" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword-user">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword-user"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && formData.role === "user" && (
                    <span className="error-message">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <button type="submit" className="signup-button" disabled={isLoading}>
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>

            {/* Restaurant Signup */}
            <div className="slide">
              <h2 className="form-title">Restaurant Owner Sign Up</h2>
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="name-restaurant">Restaurant Name</label>
                  <input
                    type="text"
                    id="name-restaurant"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your restaurant name"
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
                    placeholder="Enter password"
                  />
                  {errors.password && formData.role === "restaurant" && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword-restaurant">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword-restaurant"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword &&
                    formData.role === "restaurant" && (
                      <span className="error-message">
                        {errors.confirmPassword}
                      </span>
                    )}
                </div>

                <button type="submit" className="signup-button" disabled={isLoading}>
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
