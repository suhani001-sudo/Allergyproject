import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout as logout } from '../utils/authUtils';
import LogoutConfirmModal from './LogoutConfirmModal';
import './AboutUs.css'; // Reusing the same CSS
import '../styles/responsive.css';
import Footer from './Footer';

function RestaurantAboutUs() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('About');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Navigation items for Restaurant Dashboard
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard' },
        { id: 'Contact', label: 'Contact' },
        { id: 'About', label: 'About us' },
        { id: 'Profile', label: 'Profile' }
    ];

    // Handle navigation clicks
    function handleNavClick(itemId) {
        setActiveNavItem(itemId);
        if (itemId === 'Dashboard') {
            navigate('/restaurant-dashboard');
        } else if (itemId === 'Contact') {
            navigate('/restaurant-contact');
        } else if (itemId === 'About') {
            navigate('/restaurant-about');
        } else if (itemId === 'Profile') {
            navigate('/restaurant-profile');
        }
    }

    // Handle logout
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    function handleLogout() {
        setShowLogoutModal(true);
    }
    
    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout(navigate);
    };
    
    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    // Scroll animation effect
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />

            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo" onClick={() => navigate('/restaurant-dashboard')}>
                        <img
                            src="/images/green_logo.jpg"
                            alt="SafeBytes Logo"
                            className="logo-image"
                        />
                        <span className="logo-text">SafeBytes</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-links desktop-nav">
                        {navItems.map(function (item) {
                            return (
                                <button
                                    key={item.id}
                                    className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                                    onClick={function () { handleNavClick(item.id); }}
                                >
                                    <span className="nav-label">{item.label}</span>
                                    {activeNavItem === item.id && (
                                        <div className="active-indicator" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop Logout Button */}
                    <button className="logout-button desktop-nav" onClick={handleLogout}>
                        <span className="logout-text">Logout</span>
                    </button>

                    {/* Hamburger Menu */}
                    <div 
                        className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div 
                className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Mobile Navigation Menu */}
            <nav className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <button 
                    className="mobile-nav-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    ×
                </button>
                
                <div className="mobile-nav-items">
                    {navItems.map(function (item) {
                        return (
                            <a 
                                key={item.id}
                                href="#"
                                className={`mobile-nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                                onClick={function (e) {
                                    e.preventDefault();
                                    setIsMobileMenuOpen(false);
                                    handleNavClick(item.id);
                                }}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </div>

                <button 
                    className="mobile-nav-logout"
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                >
                    🚪 Logout
                </button>
            </nav>

            {/* Hero Section - Premium Design */}
            <section className="premium-hero">
                <div className="hero-background">
                    <div className="floating-icon float-1">🍽️</div>
                    <div className="floating-icon float-2">🥗</div>
                    <div className="floating-icon float-3">🍕</div>
                    <div className="floating-icon float-4">🌿</div>
                </div>
                <div className="hero-content-wrapper">
                    <div className="hero-text-content">
                        <h1 className="hero-main-title">Restaurant Partner Portal</h1>
                        <h2 className="hero-subtitle">Safe Dining, Together</h2>
                        <p className="hero-tagline">
                            Partnering with SafeBytes to provide allergy-safe dining experiences
                        </p>
                        <div className="hero-decorative-line"></div>
                    </div>
                    <div className="hero-illustration">
                        <div className="illustration-circle">
                            <div className="inner-circle">
                                <span className="illustration-icon">🏪</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="wave-divider">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                </svg>
            </div>

            {/* Mission & Vision - Split Layout */}
            <section className="mission-vision-split">
                <div className="split-container animate-on-scroll">
                    {/* Mission Side */}
                    <div className="split-side mission-side">
                        <div className="side-content">
                            <div className="side-icon-badge">🎯</div>
                            <h2 className="side-title">Our Mission</h2>
                            <p className="side-text">
                                Our goal is to provide allergy-safe dining experiences for all users by maintaining 
                                accurate, up-to-date allergen information. We collaborate with SafeBytes to ensure 
                                every dish is properly labeled, giving customers confidence in their food choices and 
                                helping them dine without worry.
                            </p>
                            <div className="side-decorative-element"></div>
                        </div>
                        <div className="side-graphic">
                            <div className="graphic-circle mission-circle">
                                <span className="graphic-emoji">🍽️</span>
                            </div>
                        </div>
                    </div>

                    {/* Vision Side */}
                    <div className="split-side vision-side">
                        <div className="side-graphic">
                            <div className="graphic-circle vision-circle">
                                <span className="graphic-emoji">🌟</span>
                            </div>
                        </div>
                        <div className="side-content">
                            <div className="side-icon-badge">🌟</div>
                            <h2 className="side-title">Our Vision</h2>
                            <p className="side-text">
                                We envision a future where restaurants and technology work hand-in-hand to create 
                                inclusive dining environments. By partnering with SafeBytes, we aim to set new standards 
                                in food safety transparency, making every meal a safe and enjoyable experience for 
                                customers with dietary restrictions.
                            </p>
                            <div className="side-decorative-element"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Highlights - Interactive Cards */}
            <section className="highlights-section">
                <div className="highlights-header animate-on-scroll">
                    <h2 className="highlights-title">Why Partner With SafeBytes?</h2>
                    <p className="highlights-subtitle">Premium features for restaurant partners</p>
                </div>

                <div className="highlights-grid animate-on-scroll">
                    <div className="highlight-card card-1">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">📋</div>
                        </div>
                        <h3 className="card-title">Easy Menu Management</h3>
                        <p className="card-description">Effortlessly add, edit, and manage your menu items with detailed allergen information</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-2">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">🛡️</div>
                        </div>
                        <h3 className="card-title">Allergen Accuracy</h3>
                        <p className="card-description">Ensure customer safety with comprehensive allergen tracking and labeling</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-3">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">👥</div>
                        </div>
                        <h3 className="card-title">Reach More Customers</h3>
                        <p className="card-description">Connect with health-conscious diners actively seeking safe dining options</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-4">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">📊</div>
                        </div>
                        <h3 className="card-title">Real-Time Analytics</h3>
                        <p className="card-description">Track menu performance and customer preferences with detailed insights</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-5">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">⚡</div>
                        </div>
                        <h3 className="card-title">Instant Updates</h3>
                        <p className="card-description">Update menu availability and information in real-time across the platform</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-6">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">🤝</div>
                        </div>
                        <h3 className="card-title">Dedicated Support</h3>
                        <p className="card-description">Get assistance from our team to optimize your restaurant profile</p>
                        <div className="card-glow"></div>
                    </div>
                </div>
            </section>

            {/* Diagonal Divider */}
            <div className="diagonal-divider"></div>

            {/* Benefits Section */}
            <section className="team-section">
                <div className="team-header animate-on-scroll">
                    <h2 className="team-title">Partnership Benefits</h2>
                    <p className="team-subtitle">What you get as a SafeBytes restaurant partner</p>
                    <div className="title-underline"></div>
                </div>

                <div className="team-cards-container animate-on-scroll">
                    <div className="team-card">
                        <div className="team-card-inner">
                            <div className="team-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-initial">✓</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Verified Badge</h3>
                            <div className="team-decorative-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-card-inner">
                            <div className="team-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-initial">🎯</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Priority Listing</h3>
                            <div className="team-decorative-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-card-inner">
                            <div className="team-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-initial">📈</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Growth Insights</h3>
                            <div className="team-decorative-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-card-inner">
                            <div className="team-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-initial">💬</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Customer Feedback</h3>
                            <div className="team-decorative-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-card-inner">
                            <div className="team-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-initial">🔒</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Data Security</h3>
                            <div className="team-decorative-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technologies Section - Modern Badges */}
            <section className="tech-section animate-on-scroll">
                <div className="tech-header">
                    <h2 className="tech-title">Powered By Modern Technology</h2>
                    <p className="tech-subtitle">Reliable, secure, and scalable platform</p>
                </div>

                <div className="tech-badges-container">
                    <div className="tech-badge" style={{ animationDelay: '0.1s' }}>
                        <span className="badge-text">React</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.2s' }}>
                        <span className="badge-text">Node.js</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.3s' }}>
                        <span className="badge-text">MongoDB</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.4s' }}>
                        <span className="badge-text">Express</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.5s' }}>
                        <span className="badge-text">Cloud Hosting</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.6s' }}>
                        <span className="badge-text">SSL Secure</span>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="about-section fade-in">
                <div className="cta-container">
                    <h2 className="cta-title">Ready to Get Started?</h2>
                    <p className="cta-text">
                        Manage your menu and reach more customers with SafeBytes
                    </p>
                    <button className="cta-button" onClick={() => navigate('/restaurant-dashboard')}>
                        Go to Dashboard
                    </button>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default RestaurantAboutUs;
