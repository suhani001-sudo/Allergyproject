import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';
import Footer from './Footer';

function AboutUs() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('About');

    // Navigation items
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard' },
        { id: 'Restaurants', label: 'Restaurants' },
        { id: 'Allergies', label: 'Allergies' },
        { id: 'Contact', label: 'Contact' },
        { id: 'About', label: 'About us' },
        { id: 'Profile', label: 'Profile' }
    ];

    // Handle navigation clicks
    function handleNavClick(itemId) {
        setActiveNavItem(itemId);
        if (itemId === 'Dashboard') {
            navigate('/dashboard');
        } else if (itemId === 'Restaurants') {
            navigate('/restaurants');
        } else if (itemId === 'Allergies') {
            navigate('/allergy-info');
        } else if (itemId === 'Contact') {
            navigate('/contact');
        } else if (itemId === 'About') {
            navigate('/about-us');
        } else if (itemId === 'Profile') {
            navigate('/profile');
        }
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

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
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo" onClick={() => navigate('/dashboard')}>
                        <img
                            src="/images/green_logo.jpg"
                            alt="SafeBytes Logo"
                            className="logo-image"
                        />
                        <span className="logo-text">SafeBytes</span>
                    </div>

                    <div className="nav-links">
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

                    <button className="logout-button" onClick={handleLogout}>
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section - Premium Design */}
            <section className="premium-hero">
                <div className="hero-background">
                    <div className="floating-icon float-1">🥗</div>
                    <div className="floating-icon float-2">🍎</div>
                    <div className="floating-icon float-3">🥑</div>
                    <div className="floating-icon float-4">🌿</div>
                </div>
                <div className="hero-content-wrapper">
                    <div className="hero-text-content">
                        <h1 className="hero-main-title">About SafeBytes</h1>
                        <h2 className="hero-subtitle">Eat Smart, Stay Safe</h2>
                        <p className="hero-tagline">
                            Empowering safe dining for everyone with food allergies
                        </p>
                        <div className="hero-decorative-line"></div>
                    </div>
                    <div className="hero-illustration">
                        <div className="illustration-circle">
                            <div className="inner-circle">
                                <span className="illustration-icon">🛡️</span>
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
                                Our mission is to promote food safety and awareness by empowering users with clear
                                allergen information and healthy eating choices. We strive to make dining worry-free
                                for individuals with food allergies by providing accurate, accessible, and actionable
                                information at their fingertips.
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
                                <span className="graphic-emoji">🌱</span>
                            </div>
                        </div>
                        <div className="side-content">
                            <div className="side-icon-badge">🌟</div>
                            <h2 className="side-title">Our Vision</h2>
                            <p className="side-text">
                                We aim to create a world where no one has to worry about hidden allergens — where
                                technology ensures safe and confident dining experiences for everyone. Through innovation
                                and awareness, we envision a future where food allergies are no longer a barrier to
                                enjoying meals with peace of mind.
                            </p>
                            <div className="side-decorative-element"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Highlights - Interactive Cards */}
            <section className="highlights-section">
                <div className="highlights-header animate-on-scroll">
                    <h2 className="highlights-title">Why Choose SafeBytes?</h2>
                    <p className="highlights-subtitle">Premium features designed for your safety</p>
                </div>

                <div className="highlights-grid animate-on-scroll">
                    <div className="highlight-card card-1">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">👤</div>
                        </div>
                        <h3 className="card-title">Personalized Allergy Profiles</h3>
                        <p className="card-description">Customize your profile with detailed allergy information and severity levels</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-2">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">🥗</div>
                        </div>
                        <h3 className="card-title">Safe Food Recommendations</h3>
                        <p className="card-description">Discover allergy-friendly meals and alternatives tailored to you</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-3">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">🧠</div>
                        </div>
                        <h3 className="card-title">Awareness & Education</h3>
                        <p className="card-description">Stay informed with comprehensive allergen data and safety tips</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-4">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">🏥</div>
                        </div>
                        <h3 className="card-title">Health-Focused Approach</h3>
                        <p className="card-description">Medical-grade accuracy in allergen detection and reporting</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-5">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">📱</div>
                        </div>
                        <h3 className="card-title">Responsive Design</h3>
                        <p className="card-description">Seamless experience across all devices and screen sizes</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="highlight-card card-6">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">🔍</div>
                        </div>
                        <h3 className="card-title">Smart Search</h3>
                        <p className="card-description">Quickly find safe restaurants and dishes in your area</p>
                        <div className="card-glow"></div>
                    </div>
                </div>
            </section>

            {/* Diagonal Divider */}
            <div className="diagonal-divider"></div>

            {/* Team Section - Premium Cards */}
            <section className="team-section">
                <div className="team-header animate-on-scroll">
                    <h2 className="team-title">Meet Our Team</h2>
                    <p className="team-subtitle">Dedicated to building a safer dining future</p>
                    <div className="title-underline"></div>
                </div>

                <div className="team-cards-container animate-on-scroll">
                    <div className="team-card">
                        <div className="team-card-inner">
                            <div className="team-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-initial">S</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Suhani </h3>
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
                                    <span className="avatar-initial">P</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Prince</h3>
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
                                    <span className="avatar-initial">R</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Radhika</h3>
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
                                    <span className="avatar-initial">A</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Ayush</h3>
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
                                    <span className="avatar-initial">S</span>
                                </div>
                                <div className="avatar-glow"></div>
                            </div>
                            <h3 className="team-member-name">Sabia</h3>
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
                    <h2 className="tech-title">Built With Modern Technologies</h2>
                    <p className="tech-subtitle">Powered by industry-leading tools</p>
                </div>

                <div className="tech-badges-container">
                    <div className="tech-badge" style={{ animationDelay: '0.1s' }}>
                        <span className="badge-text">HTML</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.2s' }}>
                        <span className="badge-text">CSS</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.3s' }}>
                        <span className="badge-text">JavaScript</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.4s' }}>
                        <span className="badge-text">React</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.5s' }}>
                        <span className="badge-text">Node.js</span>
                    </div>
                    <div className="tech-badge" style={{ animationDelay: '0.6s' }}>
                        <span className="badge-text">MongoDB</span>
                    </div>
                </div>
            </section>

            {/* Call to Action - Keep As-Is */}
            <section className="about-section fade-in">
                <div className="cta-container">
                    <h2 className="cta-title">Ready to Dine Safely?</h2>
                    <p className="cta-text">
                        Join thousands of users who trust SafeBytes for their food safety needs
                    </p>
                    <button className="cta-button" onClick={() => navigate('/restaurants')}>
                        Explore Restaurants
                    </button>
                </div>
            </section>

            {/* Footer - Keep As-Is */}
            <Footer />
        </div>
    );
}

export default AboutUs;
