import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout as logout } from '../utils/authUtils';
import './UserInbox.css';
import Footer from './Footer';

function UserInbox() {
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('Inbox');
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRead, setFilterRead] = useState('all'); // 'all', 'unread', 'read'

    // Navigation items
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', path: '/dashboard' },
        { id: 'Restaurants', label: 'Restaurants', path: '/restaurants' },
        { id: 'Allergy', label: 'Allergy Info', path: '/allergy-info' },
        { id: 'About', label: 'About us', path: '/about-us' },
        { id: 'Contact', label: 'Contact', path: '/contact' },
        { id: 'Inbox', label: 'Inbox', path: '/inbox' },
        { id: 'Profile', label: 'Profile', path: '/profile' }
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
        logout(navigate);
    }

    // Fetch replies from backend
    useEffect(() => {
        fetchReplies();
    }, []);

    const fetchReplies = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
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
            setLoading(false);
        }
    };

    // Mark reply as read
    const markAsRead = async (replyId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:5000/api/message-replies/${replyId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                // Refresh replies
                fetchReplies();
            }
        } catch (error) {
            console.error('Error marking reply as read:', error);
        }
    };

    // Filter replies
    const filteredReplies = filterRead === 'all' 
        ? replies 
        : replies.filter(r => filterRead === 'read' ? r.isRead : !r.isRead);

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
        <div className="inbox-page">
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
            <section className="inbox-hero" style={{
                background: 'linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)'
            }}>
                <div className="hero-pattern"></div>
                <div className="inbox-hero-content">
                    <div className="hero-badge">
                        <span className="hero-icon">📬</span>
                        <span className="hero-badge-text">Your Messages</span>
                    </div>
                    <h1 className="inbox-hero-title">Restaurant Replies</h1>
                    <p className="inbox-hero-subtitle">
                        View responses from restaurants to your inquiries
                    </p>
                    <div className="inbox-stats">
                        <div className="stat-card">
                            <div className="stat-number">{replies.length}</div>
                            <div className="stat-label">Total Replies</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{replies.filter(r => !r.isRead).length}</div>
                            <div className="stat-label">Unread</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inbox Content */}
            <div className="inbox-content-wrapper">
                <div className="inbox-container">
                    {/* Filter Buttons */}
                    <div className="inbox-filters">
                        <button 
                            className={`filter-btn ${filterRead === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterRead('all')}
                        >
                            All ({replies.length})
                        </button>
                        <button 
                            className={`filter-btn ${filterRead === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilterRead('unread')}
                        >
                            Unread ({replies.filter(r => !r.isRead).length})
                        </button>
                        <button 
                            className={`filter-btn ${filterRead === 'read' ? 'active' : ''}`}
                            onClick={() => setFilterRead('read')}
                        >
                            Read ({replies.filter(r => r.isRead).length})
                        </button>
                    </div>

                    {/* Messages List */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading your messages...</p>
                        </div>
                    ) : filteredReplies.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No messages yet</h3>
                            <p>When restaurants reply to your messages, they'll appear here</p>
                        </div>
                    ) : (
                        <div className="messages-grid">
                            {filteredReplies.map((reply) => (
                                <div 
                                    key={reply._id}
                                    className={`message-card ${!reply.isRead ? 'unread' : ''}`}
                                >
                                    <div className="message-header">
                                        <div className="restaurant-info">
                                            <div className="restaurant-avatar">
                                                {reply.restaurantName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="restaurant-name">{reply.restaurantName}</h3>
                                                <p className="message-date">
                                                    <span className="date-icon">🕒</span>
                                                    {formatDate(reply.replyDate)}
                                                </p>
                                            </div>
                                        </div>
                                        {!reply.isRead && (
                                            <span className="unread-badge">New</span>
                                        )}
                                    </div>

                                    <div className="message-body">
                                        <div className="original-message">
                                            <div className="message-label">Your Message:</div>
                                            <p className="message-text">{reply.originalMessage}</p>
                                        </div>

                                        <div className="reply-message">
                                            <div className="message-label">Restaurant Reply:</div>
                                            <p className="message-text">{reply.replyMessage}</p>
                                        </div>
                                    </div>

                                    {!reply.isRead && (
                                        <div className="message-actions">
                                            <button 
                                                className="mark-read-btn"
                                                onClick={() => markAsRead(reply._id)}
                                            >
                                                ✓ Mark as Read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default UserInbox;
