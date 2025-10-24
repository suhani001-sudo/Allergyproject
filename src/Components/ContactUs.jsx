import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';
import Footer from './Footer';

function ContactUs() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('Contact');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Show success message
            setShowSuccess(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

            // Log form data (for demonstration)
            console.log('Form submitted:', formData);
        }
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
        <div className="contact-page">
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

            {/* Hero Section */}
            <section className="contact-hero">
                <div className="hero-background">
                    <div className="floating-icon float-1">💬</div>
                    <div className="floating-icon float-2">📧</div>
                    <div className="floating-icon float-3">📱</div>
                    <div className="floating-icon float-4">💡</div>
                </div>
                <div className="hero-content-wrapper">
                    <div className="hero-text-content">
                        <h1 className="hero-main-title">We'd Love to Hear from You!</h1>
                        <p className="hero-description">
                            Have questions, feedback, or suggestions about food allergies or our platform?
                            Reach out to us and we'll respond promptly. Your safety and satisfaction are our top priorities.
                        </p>
                        <div className="hero-decorative-line"></div>
                    </div>
                    <div className="hero-illustration">
                        <div className="illustration-circle">
                            <div className="inner-circle">
                                <span className="illustration-icon">💌</span>
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

            {/* Success Message */}
            {showSuccess && (
                <div className="success-message animate-on-scroll visible">
                    <div className="success-content">
                        <span className="success-icon">✓</span>
                        <span className="success-text">Your message has been sent successfully!</span>
                    </div>
                </div>
            )}

            {/* Contact Form Section */}
            <section className="contact-form-section">
                <div className="form-container animate-on-scroll">
                    <div className="form-header">
                        <h2 className="form-title">Send Us a Message</h2>
                        <p className="form-subtitle">Fill out the form below and we'll get back to you soon</p>
                    </div>

                    <form className="premium-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.subject ? 'error' : ''}`}
                                    placeholder="What is this about?"
                                />
                                {errors.subject && <span className="error-message">{errors.subject}</span>}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Message *</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                className={`form-textarea ${errors.message ? 'error' : ''}`}
                                placeholder="Tell us more about your inquiry..."
                                rows="6"
                            ></textarea>
                            {errors.message && <span className="error-message">{errors.message}</span>}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-button">
                                <span className="button-text">Send Message</span>
                                <span className="button-icon">→</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="contact-info-section">
                <div className="info-header animate-on-scroll">
                    <h2 className="info-title">Get in Touch</h2>
                    <p className="info-subtitle">Reach us through any of these channels</p>
                </div>

                <div className="info-cards-grid animate-on-scroll">
                    <div className="info-card">
                        <div className="card-icon-wrapper">
                            <span className="card-icon">📧</span>
                        </div>
                        <h3 className="card-title">Email</h3>
                        <p className="card-text">support@safebytes.com</p>
                        <a href="mailto:support@safebytes.com" className="card-link">Send Email</a>
                    </div>

                    <div className="info-card">
                        <div className="card-icon-wrapper">
                            <span className="card-icon">📞</span>
                        </div>
                        <h3 className="card-title">Phone</h3>
                        <p className="card-text">+91 9876543210</p>
                        <a href="tel:+919876543210" className="card-link">Call Now</a>
                    </div>

                    <div className="info-card">
                        <div className="card-icon-wrapper">
                            <span className="card-icon">📍</span>
                        </div>
                        <h3 className="card-title">Address</h3>
                        <p className="card-text">Sensation Software Solutions, Indore, India</p>
                        <a href="#map" className="card-link">View Map</a>
                    </div>

                    <div className="info-card">
                        <div className="card-icon-wrapper">
                            <span className="card-icon">⏰</span>
                        </div>
                        <h3 className="card-title">Working Hours</h3>
                        <p className="card-text">Mon–Fri, 9 AM – 6 PM</p>
                        <span className="card-badge">Available Now</span>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section animate-on-scroll" id="map">
                <div className="map-container">
                    <h2 className="map-title">Find Us Here</h2>
                    <div className="map-wrapper">
                        <iframe
                            title="Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.206475342288!2d75.85728731495986!3d22.719569685104853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd4e2345f59f%3A0x8e6e3c4c4e4c4e4c!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Team Quick Contact Section */}
            <section className="team-contact-section animate-on-scroll">
                <div className="team-header">
                    <h2 className="team-title">Connect with Our Team</h2>
                    <p className="team-subtitle">Dedicated to your food safety</p>
                </div>

                <div className="team-cards-container">
                    <div className="team-contact-card">
                        <div className="team-avatar">
                            <div className="avatar-circle">
                                <span className="avatar-initial">S</span>
                            </div>
                        </div>
                        <h3 className="team-member-name">Suhani </h3>
                        <a href="mailto:suhani@safebytes.com" className="contact-button">
                            <span className="button-icon">✉️</span>
                            <span>Email</span>
                        </a>
                    </div>

                    <div className="team-contact-card">
                        <div className="team-avatar">
                            <div className="avatar-circle">
                                <span className="avatar-initial">P</span>
                            </div>
                        </div>
                        <h3 className="team-member-name">Prince</h3>
                        <a href="mailto:prince@safebytes.com" className="contact-button">
                            <span className="button-icon">✉️</span>
                            <span>Email</span>
                        </a>
                    </div>

                    <div className="team-contact-card">
                        <div className="team-avatar">
                            <div className="avatar-circle">
                                <span className="avatar-initial">R</span>
                            </div>
                        </div>
                        <h3 className="team-member-name">Radhika</h3>
                        <a href="mailto:radhika@safebytes.com" className="contact-button">
                            <span className="button-icon">✉️</span>
                            <span>Email</span>
                        </a>
                    </div>

                    <div className="team-contact-card">
                        <div className="team-avatar">
                            <div className="avatar-circle">
                                <span className="avatar-initial">A</span>
                            </div>
                        </div>
                        <h3 className="team-member-name">Ayush</h3>
                        <a href="mailto:ayush@safebytes.com" className="contact-button">
                            <span className="button-icon">✉️</span>
                            <span>Email</span>
                        </a>
                    </div>

                    <div className="team-contact-card">
                        <div className="team-avatar">
                            <div className="avatar-circle">
                                <span className="avatar-initial">S</span>
                            </div>
                        </div>
                        <h3 className="team-member-name">Sabia</h3>
                        <a href="mailto:sabia@safebytes.com" className="contact-button">
                            <span className="button-icon">✉️</span>
                            <span>Email</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default ContactUs;
