import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout as logout } from '../utils/authUtils';
import LogoutConfirmModal from './LogoutConfirmModal';
import './ContactUs.css'; // Reusing the same CSS
import '../styles/responsive.css';
import Footer from './Footer';

function RestaurantContactUs() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('Contact');

    // Messages from users
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Reply functionality
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    
    // Contact Admin Form
    const [contactForm, setContactForm] = useState({
        subject: '',
        message: ''
    });
    const [sendingMessage, setSendingMessage] = useState(false);
    
    // Admin Replies (Inbox)
    const [adminReplies, setAdminReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(true);
    const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'inbox'
    
    // Toast notification
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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


    // Fetch messages and admin replies from backend
    useEffect(() => {
        fetchMessages();
        fetchAdminReplies();
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

    const fetchAdminReplies = async () => {
        try {
            setLoadingReplies(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No auth token found');
                setLoadingReplies(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/my-replies', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Admin replies data:', data);
            
            if (data.debug) {
                console.log('=== ID MATCHING DEBUG ===');
                console.log('Searched restaurant ID:', data.debug.searchedId);
                console.log('Searched ID type:', data.debug.searchedIdType);
                console.log('Total replies in DB:', data.debug.totalRepliesInDb);
                console.log('All restaurant IDs in database:', data.debug.allIds);
                console.log('Match found:', data.debug.allIds?.includes(data.debug.searchedId));
                
                if (!data.debug.allIds?.includes(data.debug.searchedId)) {
                    console.error('❌ NO MATCH! Your ID:', data.debug.searchedId);
                    console.error('Available IDs:', data.debug.allIds);
                }
            }
            
            if (data.success) {
                setAdminReplies(data.replies || []);
            } else {
                console.error('Failed to fetch replies:', data.message);
            }
        } catch (error) {
            console.error('Error fetching admin replies:', error);
        } finally {
            setLoadingReplies(false);
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

    // Handle reply submission
    const handleSendReply = async (messageId) => {
        if (!replyText.trim()) {
            alert('Please enter a reply message');
            return;
        }

        try {
            setSendingReply(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/message-replies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    originalMessageId: messageId,
                    replyMessage: replyText
                })
            });

            const data = await response.json();

            if (data.success) {
                // Show success toast
                setToastMessage('✅ Reply sent successfully! The user will see your response in their inbox.');
                setToastType('success');
                setShowToast(true);
                
                setReplyingTo(null);
                setReplyText('');
                
                // Refresh messages to update status
                fetchMessages();
                
                // Hide toast after 5 seconds
                setTimeout(() => setShowToast(false), 5000);
            } else {
                // Show error toast
                setToastMessage('❌ ' + (data.message || 'Failed to send reply. Please try again.'));
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            setToastMessage('❌ Error sending reply. Please try again.');
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        } finally {
            setSendingReply(false);
        }
    };

    // Handle contact form input changes
    const handleContactFormChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle contact form submission
    const handleContactSubmit = async (e) => {
        e.preventDefault();

        if (!contactForm.subject.trim() || !contactForm.message.trim()) {
            setToastMessage('❌ Please fill in all fields');
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        try {
            setSendingMessage(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/restaurant-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: contactForm.subject,
                    message: contactForm.message
                })
            });

            const data = await response.json();

            if (data.success) {
                setToastMessage('✅ Message sent successfully to admin!');
                setToastType('success');
                setShowToast(true);
                
                // Reset form
                setContactForm({
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
            setSendingMessage(false);
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
                        className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div 
                className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Mobile Navigation Menu */}
            <nav className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <button 
                    className="mobile-nav-close"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    ×
                </button>
                
                <div className="mobile-nav-items">
                    {navItems.map(function (item) {
                        return (
                            <a 
                                key={item.id}
                                href={item.path || '#'}
                                className={`mobile-nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                                onClick={function (e) {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
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
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                >
                    🚪 Logout
                </button>
            </nav>

            {/* Modern Hero Section */}
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
                        <span style={{ fontSize: '2rem' }}>📬</span>
                        <span style={{ color: '#ffffffff', fontWeight: '700', fontSize: '1.1rem' }}>Your Inbox</span>
                    </div>
                    <h1 style={{
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                        animation: 'fadeInUp 0.6s ease-out'
                    }}>
                        Messages from Customers
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                        animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
                    }}>
                        View, manage, and respond to customer inquiries in real-time
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '2rem',
                        animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>{messages.length}</div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Total Messages</div>
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>{messages.filter(m => m.status === 'unread').length}</div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Unread</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Messages Section */}
            <div className="contact-content-wrapper" style={{ padding: '4rem 2rem' }}>
                <div className="contact-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="messages-section" style={{ marginBottom: '4rem' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            marginBottom: '2.5rem',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            <button 
                                onClick={() => setFilterStatus('all')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: filterStatus === 'all' ? '2px solid #6B8E23' : '2px solid #e0e0e0',
                                    background: filterStatus === 'all' ? 'linear-gradient(135deg, #6B8E23, #8FBC8F)' : 'white',
                                    color: filterStatus === 'all' ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: filterStatus === 'all' ? '0 4px 12px rgba(107, 142, 35, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseOver={(e) => {
                                    if (filterStatus !== 'all') {
                                        e.target.style.borderColor = '#6B8E23';
                                        e.target.style.color = '#6B8E23';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (filterStatus !== 'all') {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.color = '#666';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                📊 All ({messages.length})
                            </button>
                            <button 
                                onClick={() => setFilterStatus('unread')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: filterStatus === 'unread' ? '2px solid #ff9800' : '2px solid #e0e0e0',
                                    background: filterStatus === 'unread' ? 'linear-gradient(135deg, #ff9800, #ff6b35)' : 'white',
                                    color: filterStatus === 'unread' ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: filterStatus === 'unread' ? '0 4px 12px rgba(255, 152, 0, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseOver={(e) => {
                                    if (filterStatus !== 'unread') {
                                        e.target.style.borderColor = '#ff9800';
                                        e.target.style.color = '#ff9800';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (filterStatus !== 'unread') {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.color = '#666';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                🔔 Unread ({messages.filter(m => m.status === 'unread').length})
                            </button>
                            <button 
                                onClick={() => setFilterStatus('read')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: filterStatus === 'read' ? '2px solid #2196F3' : '2px solid #e0e0e0',
                                    background: filterStatus === 'read' ? 'linear-gradient(135deg, #2196F3, #1976D2)' : 'white',
                                    color: filterStatus === 'read' ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: filterStatus === 'read' ? '0 4px 12px rgba(33, 150, 243, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseOver={(e) => {
                                    if (filterStatus !== 'read') {
                                        e.target.style.borderColor = '#2196F3';
                                        e.target.style.color = '#2196F3';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (filterStatus !== 'read') {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.color = '#666';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                ✓ Read ({messages.filter(m => m.status === 'read').length})
                            </button>
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
                                        className="message-card-hover"
                                        style={{
                                            background: message.status === 'unread' 
                                                ? 'linear-gradient(to right, #ffffff, #fff8f0)' 
                                                : 'white',
                                            border: message.status === 'unread' ? '2px solid #ff9800' : '2px solid #e8e8e8',
                                            borderRadius: '16px',
                                            padding: '2rem',
                                            boxShadow: message.status === 'unread' 
                                                ? '0 4px 16px rgba(255, 152, 0, 0.15)' 
                                                : '0 2px 12px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = message.status === 'unread' 
                                                ? '0 4px 16px rgba(255, 152, 0, 0.15)' 
                                                : '0 2px 12px rgba(0,0,0,0.08)';
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
                                                            padding: '0.5rem 1.2rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                                    >
                                                        📖 Mark as Read
                                                    </button>
                                                )}
                                                {message.status !== 'replied' && message.userId && (
                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(message._id);
                                                            setReplyText('');
                                                        }}
                                                        style={{
                                                            padding: '0.5rem 1.2rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: 'linear-gradient(135deg, #6B8E23, #8FBC8F)',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            boxShadow: '0 2px 8px rgba(107, 142, 35, 0.3)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                                    >
                                                        💬 Reply
                                                    </button>
                                                )}
                                                {message.status !== 'replied' && !message.userId && (
                                                    <span style={{
                                                        padding: '0.5rem 1.2rem',
                                                        borderRadius: '8px',
                                                        background: '#f0f0f0',
                                                        color: '#999',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        ⚠️ Anonymous Message
                                                    </span>
                                                )}
                                                {message.status === 'replied' && (
                                                    <span style={{
                                                        padding: '0.5rem 1.2rem',
                                                        borderRadius: '8px',
                                                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                                                        color: 'white',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        ✓ Replied
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Reply Box */}
                                        {replyingTo === message._id && (
                                            <div style={{
                                                marginTop: '1rem',
                                                padding: '1.5rem',
                                                background: 'linear-gradient(135deg, #f0f8f0 0%, #e8f5e9 100%)',
                                                borderRadius: '12px',
                                                animation: 'slideDown 0.3s ease-out'
                                            }}>
                                                <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', fontSize: '1rem' }}>
                                                    ✍️ Write your reply
                                                </h4>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type your response here..."
                                                    style={{
                                                        width: '100%',
                                                        minHeight: '120px',
                                                        padding: '1rem',
                                                        border: '2px solid #ddd',
                                                        borderRadius: '8px',
                                                        fontSize: '0.95rem',
                                                        fontFamily: 'inherit',
                                                        resize: 'vertical',
                                                        marginBottom: '1rem',
                                                        transition: 'border-color 0.3s ease'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#6B8E23'}
                                                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                                />
                                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyText('');
                                                        }}
                                                        style={{
                                                            padding: '0.6rem 1.5rem',
                                                            borderRadius: '8px',
                                                            border: '2px solid #ddd',
                                                            background: 'white',
                                                            color: '#666',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSendReply(message._id)}
                                                        disabled={sendingReply || !replyText.trim()}
                                                        style={{
                                                            padding: '0.6rem 1.5rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: sendingReply || !replyText.trim() 
                                                                ? '#ccc' 
                                                                : 'linear-gradient(135deg, #6B8E23, #8FBC8F)',
                                                            color: 'white',
                                                            cursor: sendingReply || !replyText.trim() ? 'not-allowed' : 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600',
                                                            boxShadow: '0 4px 12px rgba(107, 142, 35, 0.4)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        {sendingReply ? '📤 Sending...' : '📨 Send Reply'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div style={{
                        marginTop: '4rem',
                        paddingTop: '4rem',
                        borderTop: '2px solid #e8e8e8'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '3rem'
                        }}>
                            <button
                                onClick={() => setActiveTab('contact')}
                                style={{
                                    padding: '1rem 2rem',
                                    background: activeTab === 'contact' 
                                        ? 'linear-gradient(135deg, #6B8E23, #556B2F)' 
                                        : 'white',
                                    color: activeTab === 'contact' ? 'white' : '#666',
                                    border: activeTab === 'contact' ? 'none' : '2px solid #e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === 'contact' 
                                        ? '0 4px 15px rgba(107, 142, 35, 0.3)' 
                                        : 'none'
                                }}
                            >
                                📧 Contact Admin
                            </button>
                            <button
                                onClick={() => setActiveTab('inbox')}
                                style={{
                                    padding: '1rem 2rem',
                                    background: activeTab === 'inbox' 
                                        ? 'linear-gradient(135deg, #6B8E23, #556B2F)' 
                                        : 'white',
                                    color: activeTab === 'inbox' ? 'white' : '#666',
                                    border: activeTab === 'inbox' ? 'none' : '2px solid #e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === 'inbox' 
                                        ? '0 4px 15px rgba(107, 142, 35, 0.3)' 
                                        : 'none',
                                    position: 'relative'
                                }}
                            >
                                📬 Inbox
                                {adminReplies.length > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: '#dc3545',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: '700'
                                    }}>
                                        {adminReplies.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Contact Admin Form Section */}
                    {activeTab === 'contact' && (
                    <div style={{ 
                        marginTop: '2rem'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '3rem'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'linear-gradient(135deg, rgba(107, 142, 35, 0.1), rgba(107, 142, 35, 0.05))',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '50px',
                                marginBottom: '1rem'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>📧</span>
                                <span style={{ color: '#6B8E23', fontWeight: '700', fontSize: '1rem' }}>Contact Admin</span>
                            </div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#2c3e50',
                                margin: '0 0 0.5rem 0'
                            }}>
                                Send Message to Admin
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#666',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}>
                                Have questions or need support? Send a message directly to the admin team
                            </p>
                        </div>

                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '3rem',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                            border: '2px solid rgba(107, 142, 35, 0.1)',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            <form onSubmit={handleContactSubmit}>
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
                                        value={contactForm.subject}
                                        onChange={handleContactFormChange}
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
                                        value={contactForm.message}
                                        onChange={handleContactFormChange}
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
                                    disabled={sendingMessage}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem 2rem',
                                        background: sendingMessage 
                                            ? 'linear-gradient(135deg, #9e9e9e, #757575)' 
                                            : 'linear-gradient(135deg, #6B8E23, #556B2F)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        cursor: sendingMessage ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(107, 142, 35, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!sendingMessage) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(107, 142, 35, 0.4)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!sendingMessage) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(107, 142, 35, 0.3)';
                                        }
                                    }}
                                >
                                    {sendingMessage ? (
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
                                    <li>The admin team will respond as soon as possible</li>
                                    <li>Check your messages regularly for updates</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Inbox Section */}
                    {activeTab === 'inbox' && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '3rem'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'linear-gradient(135deg, rgba(107, 142, 35, 0.1), rgba(107, 142, 35, 0.05))',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '50px',
                                marginBottom: '1rem'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>📬</span>
                                <span style={{ color: '#6B8E23', fontWeight: '700', fontSize: '1rem' }}>Admin Replies</span>
                            </div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#2c3e50',
                                margin: '0 0 0.5rem 0'
                            }}>
                                Your Inbox
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#666',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}>
                                View messages and replies from the admin team
                            </p>
                        </div>

                        {loadingReplies ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#666'
                            }}>
                                Loading inbox...
                            </div>
                        ) : adminReplies.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '4rem 2rem',
                                background: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                border: '2px solid rgba(107, 142, 35, 0.1)'
                            }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>No Messages Yet</h3>
                                <p style={{ color: '#666' }}>You haven't received any replies from the admin yet</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '1.5rem',
                                maxWidth: '900px',
                                margin: '0 auto'
                            }}>
                                {adminReplies.map((reply) => (
                                    <div key={reply._id} style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '2px solid rgba(107, 142, 35, 0.1)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '1.5rem',
                                            paddingBottom: '1rem',
                                            borderBottom: '2px solid rgba(107, 142, 35, 0.1)'
                                        }}>
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        fontSize: '1.5rem',
                                                        background: 'linear-gradient(135deg, #6B8E23, #556B2F)',
                                                        borderRadius: '50%',
                                                        width: '40px',
                                                        height: '40px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>👨‍💼</span>
                                                    <div>
                                                        <h4 style={{
                                                            margin: 0,
                                                            color: '#2c3e50',
                                                            fontSize: '1.1rem',
                                                            fontWeight: '700'
                                                        }}>
                                                            {reply.adminName}
                                                        </h4>
                                                        <p style={{
                                                            margin: 0,
                                                            color: '#666',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            Admin Team
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                color: '#999',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <strong style={{
                                                color: '#2c3e50',
                                                fontSize: '0.95rem'
                                            }}>
                                                Subject:
                                            </strong>
                                            <span style={{
                                                marginLeft: '0.5rem',
                                                color: '#666'
                                            }}>
                                                {reply.subject}
                                            </span>
                                        </div>

                                        <div style={{
                                            background: 'rgba(107, 142, 35, 0.05)',
                                            padding: '1.5rem',
                                            borderRadius: '12px',
                                            borderLeft: '4px solid #6B8E23'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                color: '#2c3e50',
                                                lineHeight: '1.8',
                                                fontSize: '1rem'
                                            }}>
                                                {reply.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    )}

                    {/* Contact Information */}
                    <div style={{ 
                        marginTop: '4rem',
                        paddingTop: '4rem',
                        borderTop: '2px solid #e8e8e8'
                    }}>
                        <div className="info-header">
                            <h2 className="info-title">Contact Information</h2>
                            <p className="info-subtitle">
                                Reach out to us through any of these channels
                            </p>
                        </div>

                        <div className="info-cards-container">
                            {/* Address */}
                            <div className="info-card-horizontal">
                                <div className="card-left">
                                    <div className="card-icon-circle">
                                        <span className="card-icon">📍</span>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title-horizontal">Visit Us</h3>
                                        <p className="card-text-horizontal">123 SafeBytes Street, Food District</p>
                                    </div>
                                </div>
                                <a href="#map" className="card-action-button">
                                    Map →
                                </a>
                            </div>

                            {/* Phone */}
                            <div className="info-card-horizontal">
                                <div className="card-left">
                                    <div className="card-icon-circle">
                                        <span className="card-icon">📞</span>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title-horizontal">Call Us</h3>
                                        <p className="card-text-horizontal">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <a href="tel:+15551234567" className="card-action-button">
                                    Call →
                                </a>
                            </div>

                            {/* Email */}
                            <div className="info-card-horizontal">
                                <div className="card-left">
                                    <div className="card-icon-circle">
                                        <span className="card-icon">✉️</span>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title-horizontal">Email Us</h3>
                                        <p className="card-text-horizontal">partners@safebytes.com</p>
                                    </div>
                                </div>
                                <a href="mailto:partners@safebytes.com" className="card-action-button">
                                    Send →
                                </a>
                            </div>

                            {/* Business Hours */}
                            <div className="info-card-horizontal">
                                <div className="card-left">
                                    <div className="card-icon-circle">
                                        <span className="card-icon">🕒</span>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title-horizontal">Business Hours</h3>
                                        <p className="card-text-horizontal">Mon-Fri, 9:00 AM - 6:00 PM EST</p>
                                    </div>
                                </div>
                                <span className="card-status-badge">
                                    ● Open
                                </span>
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
