import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css'; // Reusing the same CSS
import Footer from './Footer';

function RestaurantContactUs() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('Contact');

    // Messages from users
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

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

    // Navigation items for Restaurant Dashboard
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', path: '/restaurant-dashboard' },
        { id: 'Contact', label: 'Contact', path: '/restaurant-contact' },
        { id: 'About', label: 'About us', path: '/restaurant-about' },
        { id: 'Profile', label: 'Profile', path: '/restaurant-profile' }
    ];

    // Handle navigation clicks
    function handleNavClick(item) {
        setActiveNavItem(item.id);
        if (item.path) {
            navigate(item.path);
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Here you can add API call to send the contact form
            console.log('Restaurant Contact Form Data:', formData);
            
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
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Fetch messages from backend
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/contact-messages');
            const data = await response.json();
            
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update message status
    const updateMessageStatus = async (messageId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/contact-messages/${messageId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh messages
                fetchMessages();
            }
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    // Filter messages based on status
    const filteredMessages = filterStatus === 'all' 
        ? messages 
        : messages.filter(msg => msg.status === filterStatus);

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

    return (
        <div className="contact-page">
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

                    <div className="nav-links">
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

                    <button className="logout-button" onClick={handleLogout}>
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <div className="hero-icon">📧</div>
                    <h1 className="contact-hero-title">User Messages</h1>
                    <p className="contact-hero-subtitle">
                        View and manage messages from your customers
                    </p>
                </div>
            </section>

            {/* Messages Section */}
            <div className="contact-content-wrapper">
                <div className="contact-container">
                    <div className="messages-section" style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="section-title">Customer Messages</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                    onClick={() => setFilterStatus('all')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: filterStatus === 'all' ? '2px solid #6B8E23' : '1px solid #ddd',
                                        background: filterStatus === 'all' ? '#6B8E23' : 'white',
                                        color: filterStatus === 'all' ? 'white' : '#333',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    All ({messages.length})
                                </button>
                                <button 
                                    onClick={() => setFilterStatus('unread')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: filterStatus === 'unread' ? '2px solid #ff9800' : '1px solid #ddd',
                                        background: filterStatus === 'unread' ? '#ff9800' : 'white',
                                        color: filterStatus === 'unread' ? 'white' : '#333',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Unread ({messages.filter(m => m.status === 'unread').length})
                                </button>
                                <button 
                                    onClick={() => setFilterStatus('read')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: filterStatus === 'read' ? '2px solid #2196F3' : '1px solid #ddd',
                                        background: filterStatus === 'read' ? '#2196F3' : 'white',
                                        color: filterStatus === 'read' ? 'white' : '#333',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Read ({messages.filter(m => m.status === 'read').length})
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                <p>Loading messages...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', background: '#f5f5f5', borderRadius: '12px' }}>
                                <p style={{ fontSize: '1.2rem', color: '#666' }}>📭 No messages found</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {filteredMessages.map((message) => (
                                    <div 
                                        key={message._id}
                                        style={{
                                            background: 'white',
                                            border: message.status === 'unread' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1.2rem' }}>
                                                    {message.subject}
                                                </h3>
                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                                    <span>👤 {message.name}</span>
                                                    <span>📧 {message.email}</span>
                                                    {message.phone && <span>📞 {message.phone}</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span style={{
                                                    padding: '0.3rem 0.8rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    background: message.status === 'unread' ? '#ff9800' : message.status === 'read' ? '#2196F3' : '#4CAF50',
                                                    color: 'white'
                                                }}>
                                                    {message.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p style={{ margin: '1rem 0', lineHeight: '1.6', color: '#555' }}>
                                            {message.message}
                                        </p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                                🕒 {formatDate(message.createdAt)}
                                            </span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {message.status === 'unread' && (
                                                    <button
                                                        onClick={() => updateMessageStatus(message._id, 'read')}
                                                        style={{
                                                            padding: '0.4rem 1rem',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            background: '#2196F3',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}
                                                {message.status === 'read' && (
                                                    <button
                                                        onClick={() => updateMessageStatus(message._id, 'replied')}
                                                        style={{
                                                            padding: '0.4rem 1rem',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            background: '#4CAF50',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Mark as Replied
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2 className="section-title">Send Us a Message</h2>
                        <p className="section-description">
                            Fill out the form below and our support team will get back to you within 24 hours.
                        </p>

                        {showSuccess && (
                            <div className="success-message">
                                <span className="success-icon">✓</span>
                                <p>Thank you for contacting us! We'll get back to you soon.</p>
                            </div>
                        )}

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Restaurant/Owner Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={errors.name ? 'error' : ''}
                                        placeholder="Enter your name"
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className={errors.subject ? 'error' : ''}
                                        placeholder="What is this about?"
                                    />
                                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={errors.message ? 'error' : ''}
                                    rows="6"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                                {errors.message && <span className="error-message">{errors.message}</span>}
                            </div>

                            <button type="submit" className="submit-button">
                                <span>Send Message</span>
                                <span className="button-icon">→</span>
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="contact-info-section">
                        <h2 className="section-title">Contact Information</h2>
                        <p className="section-description">
                            Reach out to us through any of these channels
                        </p>

                        <div className="contact-info-cards">
                            <div className="info-card">
                                <div className="info-icon">📍</div>
                                <h3>Visit Us</h3>
                                <p>123 SafeBytes Street<br />Food District, City 12345</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">📞</div>
                                <h3>Call Us</h3>
                                <p>Restaurant Support:<br />+1 (555) 123-4567</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">✉️</div>
                                <h3>Email Us</h3>
                                <p>Restaurant Partners:<br />partners@safebytes.com</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">🕒</div>
                                <h3>Business Hours</h3>
                                <p>Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="faq-section">
                            <h3 className="faq-title">Common Questions</h3>
                            <div className="faq-list">
                                <div className="faq-item">
                                    <div className="faq-question">❓ How do I update my menu?</div>
                                    <div className="faq-answer">Go to Dashboard and use the menu management section.</div>
                                </div>
                                <div className="faq-item">
                                    <div className="faq-question">❓ How do I add allergen information?</div>
                                    <div className="faq-answer">When adding/editing menu items, select allergens from the checklist.</div>
                                </div>
                                <div className="faq-item">
                                    <div className="faq-question">❓ Can I update my restaurant profile?</div>
                                    <div className="faq-answer">Yes! Visit the Profile page to update your information.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default RestaurantContactUs;
