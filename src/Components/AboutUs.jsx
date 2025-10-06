import React from 'react';
import './AboutUs.css';
import { useNavigate } from 'react-router-dom';

// STEP 1: Page structure - simple functional component for About Us
function AboutUs() {
  const navigate = useNavigate();

  const navItems = [
    { id: 'Restaurants', label: 'Restaurants', path: '/restaurants' },
    { id: 'My Allergies', label: 'Allergies', path: '/allergies' },
    { id: 'Contact', label: 'Contact', path: '/contact' },
    { id: 'About', label: 'About us', path: '/about-us' },
    { id: 'Profile', label: 'Profile', path: '/profile' }
  ];

  function handleNavClick(item) {
    if (item && item.path) {
      navigate(item.path);
    }
  }

  return (
    <div className="aboutus-page">
      {/* Dashboard-style Navbar (lightweight copy) */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/') }>
            <img 
              src="/images/green_logo.jpg" 
              alt="SafeBytes Logo" 
              className="logo-image"
            />
            <span className="logo-text">SafeBytes</span>
          </div>

          <div className="nav-links">
            {navItems.map(function(item) {
              const isActive = item.id === 'About';
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  <span className="nav-label">{item.label}</span>
                  {isActive && <div className="active-indicator" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* STEP 2: Header section */}
      <header className="aboutus-header fade-in-up">
        <h1 className="aboutus-title">About SafeBytes</h1>
        <p className="aboutus-tagline">Your Health, Our Priority</p>
        <p className="aboutus-desc">
          SafeBytes is a student-built Food Allergy Management System that helps users manage food allergies,
          discover safe restaurant menus, and promote allergy awareness. Our goal is to make choosing what to eat
          safer, simpler, and more confident for everyone.
        </p>
      </header>

      {/* STEP 3: Mission section */}
      <section className="aboutus-section fade-in-up">
        <h2 className="section-title">Our Mission</h2>
        <p className="section-text">
          To make dining safer for everyone with food allergies by providing clear information, user-friendly tools,
          and a supportive platform that connects people with restaurants offering safe options.
        </p>
        <div className="pill-row">
          <div className="pill">🔍 Clear Allergen Info</div>
          <div className="pill">🛡️ Safety First</div>
          <div className="pill">🤝 Community</div>
        </div>
      </section>

      {/* STEP 4: Vision section */}
      <section className="aboutus-section fade-in-up">
        <h2 className="section-title">Our Vision</h2>
        <p className="section-text">
          We aim to build AI-powered allergen detection, partner with restaurants to maintain accurate menus,
          and expand SafeBytes into a trusted global community resource.
        </p>
        <div className="mini-stats">
          <div className="mini-card"><div className="num">50+</div><div className="lbl">Safe Spots</div></div>
          <div className="mini-card"><div className="num">10K+</div><div className="lbl">Users</div></div>
          <div className="mini-card"><div className="num">99.9%</div><div className="lbl">Reliability</div></div>
        </div>
      </section>

      {/* STEP 5: Team section */}
      <section className="aboutus-section fade-in-up">
        <h2 className="section-title">Meet Our Team</h2>

        {/* STEP 5.1: Simple responsive grid of team members */}
        <div className="team-grid">
          {/* Each card uses very simple HTML with an optional placeholder image */}
          <div className="team-card">
            <img
              className="team-photo"
              src="https://via.placeholder.com/100"
              alt="Kumari Suhani"
            />
            <h3 className="team-name">Kumari Suhani</h3>
            <p className="team-role">Lead • UX & QA</p>
          </div>

          <div className="team-card">
            <img
              className="team-photo"
              src="https://via.placeholder.com/100"
              alt="Prince Khatri"
            />
            <h3 className="team-name">Prince Khatri</h3>
            <p className="team-role">Frontend • React</p>
          </div>

          <div className="team-card">
            <img
              className="team-photo"
              src="https://via.placeholder.com/100"
              alt="Radhika"
            />
            <h3 className="team-name">Radhika</h3>
            <p className="team-role">Content • Outreach</p>
          </div>

          <div className="team-card">
            <img
              className="team-photo"
              src="https://via.placeholder.com/100"
              alt="Sabiya Gupta"
            />
            <h3 className="team-name">Sabiya Gupta</h3>
            <p className="team-role">Research • Data</p>
          </div>

          <div className="team-card">
            <img
              className="team-photo"
              src="https://via.placeholder.com/100"
              alt="Ayush Sharma"
            />
            <h3 className="team-name">Ayush Sharma</h3>
            <p className="team-role">Backend • APIs</p>
          </div>
        </div>
      </section>

      {/* STEP 6: Footer note */}
      <footer className="aboutus-footer fade-in">
        <p>© 2025 SafeBytes Project | Developed by Team SafeBytes</p>
      </footer>
    </div>
  );
}

export default AboutUs;


