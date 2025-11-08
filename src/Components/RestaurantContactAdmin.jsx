import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout as logout } from '../utils/authUtils';
import LogoutConfirmModal from './LogoutConfirmModal';
import './ContactUs.css';
import '../styles/responsive.css';
import Footer from './Footer';

function RestaurantContactAdmin() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('Contact');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    
    const [sending, setSending] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    // Navigation items
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', path: '/restaurant-dashboard' },
        { id: 'Contact', label: 'Contact Admin', path: '/restaurant-contact-admin' },
        { id: 'Messages', label: 'Messages', path: '/restaurant-contact' },
        { id: 'About', label: 'About us', path: '/restaurant-about' },
        { id: 'Profile', label: 'Profile', path: '/restaurant-profile' }
    ];

    function handleNavClick(item) {
        setActiveNavItem(item.id);
        if (item.path) {
            navigate(item.path);
        }
    }

    // Logout handlers
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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject.trim() || !formData.message.trim()) {
            setToastMessage('❌ Please fill in all fields');
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        try {
            setSending(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/restaurant-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: formData.subject,
                    message: formData.message
                })
            });

            const data = await response.json();

            if (data.success) {
                setToastMessage('✅ Message sent successfully to admin!');
                setToastType('success');
                setShowToast(true);
                
                // Reset form
                setFormData({
                    subject: '',
                    message: ''
                });
                
                setTimeout(() => setShowToast(false), 5000);
            } else {
                setToastMessage('❌ ' + (data.message || 'Failed to send message'));
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setToastMessage('❌ Error sending message. Please try again.');
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />

            {/* Toast Notification */}
            {showToast && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    right: '20px',
                    zIndex: 9999,
                    background: toastType === 'success' 
                        ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                        : 'linear-gradient(135deg, #f44336, #e53935)',
                    color: 'white',
                    padding: '1.25rem 2rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    minWidth: '350px',
                    animation: 'slideInRight 0.4s ease-out, fadeOut 0.5s ease-in 4.5s forwards',
                    fontSize: '1rem',
                    fontWeight: '600'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        {toastType === 'success' ? '✓' : '✕'}
                    </div>
                    <div style={{ flex: 1 }}>
                        {toastMessage}
                    </div>
                    <button
                        onClick={() => setShowToast(false)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        ×
                    </button>
                </div>
            )}
            
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
                                    onClick={function () { handleNavClick(item); }}
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
                                    handleNavClick(item);
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

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)',
                padding: '4rem 2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.3
                }}></div>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        marginBottom: '1.5rem',
                        animation: 'fadeInDown 0.6s ease-out'
                    }}>
                        <span style={{ fontSize: '2rem' }}>📧</span>
                        <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.1rem' }}>Contact Admin</span>
                    </div>
                    <h1 style={{
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                        animation: 'fadeInUp 0.6s ease-out'
                    }}>
                        Send Message to Admin
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                        animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
                    }}>
                        Have questions or need support? Send a message directly to the admin team
                    </p>
                </div>
            </section>

            {/* Contact Form Section */}
            <div className="contact-content-wrapper" style={{ padding: '4rem 2rem' }}>
                <div className="contact-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '3rem',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        border: '2px solid rgba(107, 142, 35, 0.1)'
                    }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '600',
                                    color: '#2c3e50',
                                    fontSize: '1rem'
                                }}>
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Enter the subject of your message"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1.25rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6B8E23'}
                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '600',
                                    color: '#2c3e50',
                                    fontSize: '1rem'
                                }}>
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your message here..."
                                    required
                                    rows="8"
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1.25rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        resize: 'vertical',
                                        fontFamily: 'inherit',
                                        lineHeight: '1.6'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6B8E23'}
                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 2rem',
                                    background: sending 
                                        ? 'linear-gradient(135deg, #9e9e9e, #757575)' 
                                        : 'linear-gradient(135deg, #6B8E23, #556B2F)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: sending ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(107, 142, 35, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                                onMouseOver={(e) => {
                                    if (!sending) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(107, 142, 35, 0.4)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!sending) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(107, 142, 35, 0.3)';
                                    }
                                }}
                            >
                                {sending ? (
                                    <>
                                        <span style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            borderTop: '3px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span style={{ fontSize: '1.3rem' }}>📤</span>
                                        Send Message to Admin
                                    </>
                                )}
                            </button>
                        </form>

                        <div style={{
                            marginTop: '2.5rem',
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #f0f8f0 0%, #e8f5e9 100%)',
                            borderRadius: '12px',
                            border: '1px solid rgba(107, 142, 35, 0.2)'
                        }}>
                            <h3 style={{
                                margin: '0 0 1rem 0',
                                color: '#2c3e50',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>💡</span>
                                Quick Tips
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: '1.5rem',
                                color: '#555',
                                lineHeight: '1.8'
                            }}>
                                <li>Be clear and specific about your inquiry</li>
                                <li>Include relevant details to help us assist you better</li>
                                <li>The admin team will respond to your message as soon as possible</li>
                                <li>You can check your message history in the Messages section</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default RestaurantContactAdmin;
