import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    { id: 'My Allergies', icon: '', label: 'My Allergies' },
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
    <motion.div 
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="floating-elements">
        <motion.div 
          className="floating-icon"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🥗
        </motion.div>
        <motion.div 
          className="floating-icon"
          animate={{ y: [0, 15, 0], rotate: [0, -360] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          🍎
        </motion.div>
        <motion.div 
          className="floating-icon"
          animate={{ y: [0, -25, 0], rotate: [0, 180] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        >
          🥑
        </motion.div>
      </div>

      <motion.nav 
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/images/green_logo.jpg" 
              alt="SafeBytes Logo" 
              className="logo-image"
            />
            <span className="logo-text">SafeBytes</span>
          </motion.div>

          <div className="nav-links">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {activeNavItem === item.id && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            className="logout-button"
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
           
            <span className="logout-text">Logout</span>
          </motion.button>
        </div>
      </motion.nav>

      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="hero-content">
          <div className="hero-text">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Safe Dining, 
              <span className="highlight"> Everywhere</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Your trusted companion for allergy-safe dining experiences
            </motion.p>

            <motion.div 
              className="quote-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.div
                key={currentQuoteIndex}
                className="quote-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                "{quotes[currentQuoteIndex]}"
              </motion.div>
            </motion.div>

            <motion.div 
              className="cta-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                className="cta-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="cta-icon">🍽️</span>
                Explore Restaurants
              </motion.button>
              
              <motion.button
                className="cta-button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="cta-icon">⚠️</span>
                Check My Allergies
              </motion.button>
            </motion.div>
          </div>

          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
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
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="stats-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="stats-container">
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="stat-icon">🏪</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Allergy-Safe Restaurants</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="stat-icon">👥</div>
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Users</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="stat-icon">🛡️</div>
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Safety Rate</div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default UserDashboard;
