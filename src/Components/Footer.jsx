import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <div className="footer-logo">
            <img 
              src="/images/green_logo.jpg" 
              alt="SafeBytes Logo" 
              className="footer-logo-image"
            />
            <span className="footer-logo-text">SafeBytes</span>
          </div>
          <p className="footer-description">
            Your trusted companion for allergy-safe dining experiences. 
            Making every meal safe and enjoyable.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon">f</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon">𝕏</span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span className="social-icon instagram-icon"></span>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <span className="social-icon">in</span>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><button onClick={() => handleLinkClick('/restaurants')} className="footer-link">Restaurants</button></li>
            <li><button onClick={() => handleLinkClick('/dashboard')} className="footer-link">Dashboard</button></li>
            <li><button onClick={() => handleLinkClick('/restaurant-dashboard')} className="footer-link">Restaurant Dashboard</button></li>
            <li><button onClick={() => handleLinkClick('/login')} className="footer-link">Login</button></li>
            <li><button onClick={() => handleLinkClick('/signup')} className="footer-link">Sign Up</button></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-section">
          <h3 className="footer-title">Support</h3>
          <ul className="footer-links">
            <li><button onClick={() => handleLinkClick('/dashboard')} className="footer-link">Contact Us</button></li>
            <li><button onClick={() => handleLinkClick('/dashboard')} className="footer-link">FAQ</button></li>
            <li><button onClick={() => handleLinkClick('/dashboard')} className="footer-link">Report Issue</button></li>
            <li><button onClick={() => handleLinkClick('/dashboard')} className="footer-link">Feedback</button></li>
            <li><button onClick={() => handleLinkClick('/dashboard')} className="footer-link">Terms of Service</button></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="footer-section">
          <h3 className="footer-title">Contact Info</h3>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon">✉</span>
              <span className="contact-text">support@safebytes.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">☎</span>
              <span className="contact-text">+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span className="contact-text">123 Food Safety St, Health City, HC 12345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © 2024 SafeBytes. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <button onClick={() => handleLinkClick('/dashboard')} className="footer-bottom-link">Privacy Policy</button>
            <button onClick={() => handleLinkClick('/dashboard')} className="footer-bottom-link">Terms of Use</button>
            <button onClick={() => handleLinkClick('/dashboard')} className="footer-bottom-link">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
