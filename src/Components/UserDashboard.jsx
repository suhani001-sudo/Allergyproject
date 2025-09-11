import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');

  const quotes = [
    "Good food is the foundation of genuine happiness",
    "Let food be thy medicine and medicine be thy food",
    "The only time to eat diet food is while you're waiting for the steak to cook",
    "Life is uncertain. Eat dessert first",
    "Food brings people together on many different levels"
  ];

  const navItems = [
    { id: 'Restaurants', icon: '', label: 'Restaurants' },
    { id: 'My Allergies', icon: '', label: 'Allergies' },
    { id: 'Profile', icon: '', label: 'Contact' },
    { id: 'Profile', label: 'About us' },
    { id: 'Profile', icon: '👤', label: 'Profile' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleNavClick = (itemId) => {
    setActiveNavItem(itemId);
  };

  return (
    <div className="home-container">
      <div className="floating-elements">
        <div className="floating-icon">🥗</div>
        <div className="floating-icon">🍎</div>
        <div className="floating-icon">🥑</div>
      </div>

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img 
              src="/images/green_logo.jpg" 
              alt="SafeBytes Logo" 
              className="logo-image"
            />
            <span className="logo-text">SafeBytes</span>
          </div>

          <div className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {activeNavItem === item.id && (
                  <div className="active-indicator" />
                )}
              </button>
            ))}
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Safe Dining, 
              <span className="highlight"> Everywhere</span>
            </h1>

            <p className="hero-subtitle">
              Your trusted companion for allergy-safe dining experiences
            </p>

            <div className="quote-container">
              <div className="quote-text">
                "{quotes[currentQuoteIndex]}"
              </div>
            </div>

            <div className="cta-buttons">
              <button className="cta-button primary">
                <span className="cta-icon">🍽️</span>
                Explore Restaurants
              </button>
              
              <button className="cta-button secondary">
                <span className="cta-icon">⚠️</span>
                Check My Allergies
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-container">
              <img 
                src="/images/homepic2.jpg" 
                alt="Healthy Food" 
                className="hero-food-image"
              />
              <div className="image-overlay">
                <span className="overlay-icon"></span>
                <p>Fresh & Healthy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Allergy-Safe Restaurants</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Safety Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
