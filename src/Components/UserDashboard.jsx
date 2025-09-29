import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

function UserDashboard(props) {
  // STEP 1: Get the onLogout function from props
  const onLogout = props.onLogout;
  
  // STEP 2: Initialize navigation and cart hooks
  const navigate = useNavigate();
  
  
  // STEP 3: Set up state variables
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState('Restaurants');

  // STEP 4: Create array of inspirational quotes
  const quotes = [
    "Good food is the foundation of genuine happiness",
    "Let food be thy medicine and medicine be thy food",
    "The only time to eat diet food is while you're waiting for the steak to cook",
    "Life is uncertain. Eat dessert first",
    "Food brings people together on many different levels"
  ];

  // STEP 5: Create array of navigation items
  const navItems = [
  	{ id: 'Restaurants', label: 'Restaurants' },
  	{ id: 'My Allergies', label: 'Allergies' },
  	{ id: 'Contact', label: 'Contact' },
  	{ id: 'About', label: 'About us' },
  	{ id: 'Profile', label: 'Profile' }
  ];

  // STEP 6: Set up timer to change quotes every 4 seconds
  useEffect(function() {
    const interval = setInterval(function() {
      setCurrentQuoteIndex(function(prev) {
        return (prev + 1) % quotes.length;
      });
    }, 4000);
    
    // Clean up interval when component unmounts
    return function() {
      clearInterval(interval);
    };
  }, [quotes.length]);

  // STEP 7: Function to handle navigation clicks
  function handleNavClick(itemId) {
    setActiveNavItem(itemId);
    if (itemId === 'Restaurants') {
      // Navigate to restaurant page
      navigate('/restaurants');
    }
    // Add other navigation logic as needed
  }

  return (
    <div className="home-container">
      

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
            {navItems.map(function(item) {
              return (
                <button
                  key={item.id}
                  className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                  onClick={function() { handleNavClick(item.id); }}
                >
                  <span className="nav-label">{item.label}</span>
                  {activeNavItem === item.id && (
                    <div className="active-indicator" />
                  )}
                </button>
              );
            })}
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
              <button className="cta-button primary" onClick={function() { navigate('/restaurants'); }}>
                Explore Restaurants
              </button>
              
              <button className="cta-button secondary">
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
            <div className="stat-number">50+</div>
            <div className="stat-label">Allergy-Safe Restaurants</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Safety Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
