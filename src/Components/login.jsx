import React, { useEffect, useRef, useState } from 'react';
import './login.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user' // 'user' or 'restaurant'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const previousRoleRef = useRef('user');
  const [slideDirection, setSlideDirection] = useState('to-left');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role) => {
    const previousRole = previousRoleRef.current;
    if (previousRole !== role) {
      setSlideDirection(previousRole === 'user' && role === 'restaurant' ? 'to-right' : 'to-left');
      previousRoleRef.current = role;
    }
    setFormData(prev => ({ ...prev, role }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      console.log('Login attempt:', formData);
      setIsLoading(false);
      
      // Simulate successful login
      if (formData.email && formData.password) {
        onLoginSuccess();
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
            className={`role-option ${formData.role === 'user' ? 'active' : ''}`}
            onClick={() => handleRoleChange('user')}
          >
            👤 User
          </div>
          <div 
            className={`role-option ${formData.role === 'restaurant' ? 'active' : ''}`}
            onClick={() => handleRoleChange('restaurant')}
          >
            🏪 Restaurant Owner
          </div>
        </div>

        {/* Sliding Forms */}
        <div className={`form-slider`}>
          <div
            className={`form-track ${formData.role === 'user' ? 'user-active' : 'restaurant-active'} ${slideDirection}`}
          >
            {/* User Slide */}
            <div className="slide">
              <h2 className="form-title">User Sign In</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email-user">Email Address</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      type="email"
                      id="email-user"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required={formData.role === 'user'}
                    />
                  </div>
                  {errors.email && formData.role === 'user' && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password-user">Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      type="password"
                      id="password-user"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required={formData.role === 'user'}
                    />
                  </div>
                  {errors.password && formData.role === 'user' && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-options">
                  <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                  
                  <div className="signup-section">
                    <div className="signup-prompt">
                      Don't have an account?
                    </div>
                    <button 
                      type="button" 
                      className="signup-button"
                      onClick={() => console.log('Sign up clicked')}
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
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      type="email"
                      id="email-restaurant"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your business email"
                      required={formData.role === 'restaurant'}
                    />
                  </div>
                  {errors.email && formData.role === 'restaurant' && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password-restaurant">Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      type="password"
                      id="password-restaurant"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required={formData.role === 'restaurant'}
                    />
                  </div>
                  {errors.password && formData.role === 'restaurant' && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-options">
                  <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                  
                  <div className="signup-section">
                    <div className="signup-prompt">
                      Don't have an account?
                    </div>
                    <button 
                      type="button" 
                      className="signup-button"
                      onClick={() => console.log('Sign up clicked')}
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