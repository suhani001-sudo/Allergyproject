import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout as logout } from '../utils/authUtils';
import LogoutConfirmModal from './LogoutConfirmModal';
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
    
    // Inbox replies state
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    // Navigation items
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard' },
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

    // Logout modal state
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    // Handle logout
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Get user info from localStorage
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                // Send message to backend
                const response = await fetch('http://localhost:5000/api/contact-messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify({
                        ...formData,
                        userType: 'user',
                        userId: user._id || user.id
                    })
                });

                const data = await response.json();

                if (data.success) {
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
                } else {
                    alert('Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('An error occurred. Please try again later.');
            }
        }
    };

    // Fetch user replies
    useEffect(() => {
        fetchReplies();
    }, []);

    const fetchReplies = async () => {
        try {
            setLoadingReplies(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setLoadingReplies(false);
                return;
            }
            
            const response = await fetch('http://localhost:5000/api/message-replies/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setReplies(data.data);
            }
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />

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

            {/* Inbox Section - Restaurant Replies */}
            {replies.length > 0 && (
                <section className="inbox-section" style={{
                    padding: '4rem 2rem',
                    background: 'linear-gradient(135deg, #f0f8f0 0%, #e8f5e9 100%)',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '50px',
                                marginBottom: '1rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>📬</span>
                                <span style={{ fontWeight: '700', color: '#6B8E23', fontSize: '1.1rem' }}>Your Inbox</span>
                            </div>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: '#2c3e50',
                                marginBottom: '0.5rem'
                            }}>
                                Restaurant Replies
                            </h2>
                            <p style={{ color: '#666', fontSize: '1.1rem' }}>
                                {replies.filter(r => !r.isRead).length} unread message{replies.filter(r => !r.isRead).length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {loadingReplies ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '4px solid #f3f3f3',
                                    borderTop: '4px solid #6B8E23',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto'
                                }}></div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {replies.slice(0, 3).map((reply) => (
                                    <div 
                                        key={reply._id}
                                        style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            padding: '2rem',
                                            boxShadow: reply.isRead ? '0 2px 12px rgba(0,0,0,0.08)' : '0 4px 16px rgba(107, 142, 35, 0.2)',
                                            border: reply.isRead ? '2px solid #e8e8e8' : '2px solid #6B8E23',
                                            transition: 'all 0.3s ease',
                                            position: 'relative'
                                        }}
                                    >
                                        {!reply.isRead && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                                                color: 'white',
                                                padding: '0.4rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                animation: 'pulse 2s infinite'
                                            }}>
                                                New
                                            </div>
                                        )}
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6B8E23, #8FBC8F)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)'
                                            }}>
                                                {reply.restaurantName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: '700', color: '#2c3e50' }}>
                                                    {reply.restaurantName}
                                                </h3>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#999', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span>🕒</span>
                                                    {formatDate(reply.replyDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            borderLeft: '4px solid #dee2e6',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                                Your Message
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.6' }}>
                                                {reply.originalMessage}
                                            </p>
                                        </div>

                                        <div style={{
                                            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%)',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            borderLeft: '4px solid #6B8E23'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6B8E23', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                                Restaurant Reply
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#555', lineHeight: '1.7' }}>
                                                {reply.replyMessage}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {replies.length > 3 && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <button
                                    onClick={() => navigate('/inbox')}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: 'linear-gradient(135deg, #6B8E23, #8FBC8F)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    View All Messages ({replies.length})
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Contact Information Section */}
            <section className="contact-info-section">
                <div className="info-header animate-on-scroll">
                    <h2 className="info-title">Get in Touch</h2>
                    <p className="info-subtitle">Reach us through any of these channels</p>
                </div>

                <div className="info-cards-container animate-on-scroll">
                    {/* Email */}
                    <div className="info-card-horizontal">
                        <div className="card-left">
                            <div className="card-icon-circle">
                                <span className="card-icon">📧</span>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title-horizontal">Email</h3>
                                <p className="card-text-horizontal">support@safebytes.com</p>
                            </div>
                        </div>
                        <a href="mailto:support@safebytes.com" className="card-action-button">
                            Send →
                        </a>
                    </div>

                    {/* Phone */}
                    <div className="info-card-horizontal">
                        <div className="card-left">
                            <div className="card-icon-circle">
                                <span className="card-icon">📞</span>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title-horizontal">Phone</h3>
                                <p className="card-text-horizontal">+91 9876543210</p>
                            </div>
                        </div>
                        <a href="tel:+919876543210" className="card-action-button">
                            Call →
                        </a>
                    </div>

                    {/* Address */}
                    <div className="info-card-horizontal">
                        <div className="card-left">
                            <div className="card-icon-circle">
                                <span className="card-icon">📍</span>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title-horizontal">Address</h3>
                                <p className="card-text-horizontal">Ludhiana, Punjab</p>
                            </div>
                        </div>
                        <a href="#map" className="card-action-button">
                            Map →
                        </a>
                    </div>

                    {/* Working Hours */}
                    <div className="info-card-horizontal">
                        <div className="card-left">
                            <div className="card-icon-circle">
                                <span className="card-icon">⏰</span>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title-horizontal">Working Hours</h3>
                                <p className="card-text-horizontal">Mon–Fri, 9 AM – 6 PM</p>
                            </div>
                        </div>
                        <span className="card-status-badge">
                            ● Available
                        </span>
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

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default ContactUs;
