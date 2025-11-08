import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDeleteModal from './AdminDeleteModal';
import SimpleLogoutModal from './SimpleLogoutModal';
import { handleLogout as logout } from '../utils/authUtils';
import './AdminDashboard.css';
import '../styles/responsive.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  
  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalRestaurantProfiles: 0,
    totalAdmins: 0,
    recentUsers: [],
    recentRestaurants: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [restaurantMessages, setRestaurantMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemType: '',
    itemId: '',
    itemName: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Reply modal state
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    messageId: '',
    restaurantEmail: '',
    restaurantName: '',
    originalSubject: ''
  });
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    websiteName: 'SafeBytes',
    contactEmail: 'admin@safebytes.com',
    contactPhone: '+1 (555) 123-4567'
  });

  useEffect(() => {
    fetchAdminStats();
    fetchAllUsers();
    fetchAllRestaurants();
    fetchAllAdmins();
    fetchMessages();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
    logout(navigate);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching all users:', err);
    }
  };

  const fetchAllRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/restaurants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAllRestaurants(data.restaurants);
      }
    } catch (err) {
      console.error('Error fetching all restaurants:', err);
    }
  };

  const fetchAllAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/admins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAllAdmins(data.admins || []);
      }
    } catch (err) {
      console.error('Error fetching all admins:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user messages
      const userMsgResponse = await fetch('http://localhost:5000/api/admin/user-messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const userMsgData = await userMsgResponse.json();
      if (userMsgResponse.ok && userMsgData.success) {
        setUserMessages(userMsgData.messages || []);
      }
      
      // Fetch restaurant messages
      const restMsgResponse = await fetch('http://localhost:5000/api/restaurant-messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const restMsgData = await restMsgResponse.json();
      if (restMsgResponse.ok && restMsgData.success) {
        setRestaurantMessages(restMsgData.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleDeleteClick = (itemType, itemId, itemName) => {
    setDeleteModal({
      isOpen: true,
      itemType,
      itemId,
      itemName
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint;
      
      if (deleteModal.itemType === 'User') {
        endpoint = `http://localhost:5000/api/admin/users/${deleteModal.itemId}`;
      } else if (deleteModal.itemType === 'Restaurant') {
        endpoint = `http://localhost:5000/api/admin/restaurants/${deleteModal.itemId}`;
      } else if (deleteModal.itemType === 'Admin') {
        endpoint = `http://localhost:5000/api/admin/admins/${deleteModal.itemId}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message
        setSuccessMessage(`${deleteModal.itemType} deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);

        // Refresh data
        fetchAdminStats();
        if (deleteModal.itemType === 'User') {
          fetchAllUsers();
        } else if (deleteModal.itemType === 'Restaurant') {
          fetchAllRestaurants();
        } else if (deleteModal.itemType === 'Admin') {
          fetchAllAdmins();
        }
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeleteModal({ isOpen: false, itemType: '', itemId: '', itemName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, itemType: '', itemId: '', itemName: '' });
  };

  // Reply handlers
  const handleOpenReply = (message) => {
    setReplyModal({
      isOpen: true,
      messageId: message._id,
      restaurantEmail: message.email,
      restaurantName: message.restaurantName,
      originalSubject: message.subject
    });
    setReplyText('');
  };

  const handleCloseReply = () => {
    setReplyModal({
      isOpen: false,
      messageId: '',
      restaurantEmail: '',
      restaurantName: '',
      originalSubject: ''
    });
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      setSendingReply(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/admin/reply-to-restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: replyModal.messageId,
          restaurantEmail: replyModal.restaurantEmail,
          restaurantName: replyModal.restaurantName,
          subject: `Re: ${replyModal.originalSubject}`,
          message: replyText
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Reply sent successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleCloseReply();
        fetchMessages();
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Network error. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Logout Confirmation Modal */}
      <SimpleLogoutModal 
        show={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="modal-overlay" onClick={handleCloseReply}>
          <div className="modal-content reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reply to {replyModal.restaurantName}</h3>
              <button className="modal-close" onClick={handleCloseReply}>×</button>
            </div>
            <div className="modal-body">
              <div className="reply-info">
                <p><strong>To:</strong> {replyModal.restaurantEmail}</p>
                <p><strong>Subject:</strong> Re: {replyModal.originalSubject}</p>
              </div>
              <div className="form-group">
                <label>Your Reply</label>
                <textarea
                  className="reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="8"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseReply}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSendReply}
                disabled={sendingReply}
              >
                {sendingReply ? 'Sending...' : '📤 Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemType={deleteModal.itemType}
        itemName={deleteModal.itemName}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="admin-success-alert">
          ✓ {successMessage}
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <img src="/images/green_logo.jpg" alt="SafeBytes Logo" className="admin-logo-image" />
            <h1>SafeBytes Admin</h1>
          </div>
          
          {/* Desktop Logout Button */}
          <button onClick={handleLogout} className="admin-logout-btn desktop-nav">
            <span>🚪</span>
            <span>Logout</span>
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
      </header>

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
          <a 
            href="#overview" 
            className={`mobile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            📊 Overview
          </a>
          <a 
            href="#users" 
            className={`mobile-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
          >
            👥 Users
          </a>
          <a 
            href="#restaurants" 
            className={`mobile-nav-item ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => { setActiveTab('restaurants'); setMobileMenuOpen(false); }}
          >
            🏪 Restaurants
          </a>
          <a 
            href="#messages" 
            className={`mobile-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }}
          >
            💬 Messages
          </a>
          <a 
            href="#settings" 
            className={`mobile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
          >
            ⚙️ Settings
          </a>
        </div>

        <button 
          className="mobile-nav-logout"
          onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
        >
          🚪 Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          <h2 className="admin-title">Admin Dashboard</h2>

          {loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : error ? (
            <div className="admin-error">
              <p>{error}</p>
              <button onClick={fetchAdminStats} className="retry-btn">
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Statistics Cards - Compact */}
              <div className="stats-grid stats-grid-compact">
                <div className="stat-card stat-card-compact stat-users">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                  </div>
                </div>

                <div className="stat-card stat-card-compact stat-restaurants">
                  <div className="stat-icon">🏪</div>
                  <div className="stat-content">
                    <h3>Total Restaurants</h3>
                    <p className="stat-number">{stats.totalRestaurants}</p>
                  </div>
                </div>

                <div className="stat-card stat-card-compact stat-messages">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <h3>Total Messages</h3>
                    <p className="stat-number">{restaurantMessages.length}</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="admin-tabs">
                <button 
                  className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
                <button 
                  className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  👥 All Users ({allUsers.length})
                </button>
                <button 
                  className={`admin-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
                  onClick={() => setActiveTab('restaurants')}
                >
                  🏪 All Restaurants ({allRestaurants.length})
                </button>
                <button 
                  className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  💬 Messages ({userMessages.length + restaurantMessages.length})
                </button>
                <button 
                  className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  ⚙️ Settings
                </button>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Recent Users Section */}
                  <div className="admin-section">
                    <h3 className="section-title">Recent Users</h3>
                    {stats.recentUsers.length > 0 ? (
                      <div className="cards-container">
                        {stats.recentUsers.map((user) => (
                          <div key={user._id} className="info-card">
                            <div className="card-field">
                              <span className="field-label">ID</span>
                              <span className="field-value id-value">{user._id.substring(0, 10)}...</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Name</span>
                              <span className="field-value">{user.name}</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Email</span>
                              <span className="field-value">{user.email}</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Joined Date</span>
                              <span className="field-value">{formatDate(user.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No users registered yet.</p>
                    )}
                  </div>

                  {/* Recent Restaurants Section */}
                  <div className="admin-section">
                    <h3 className="section-title">Recent Restaurants</h3>
                    {stats.recentRestaurants.length > 0 ? (
                      <div className="cards-container">
                        {stats.recentRestaurants.map((restaurant) => (
                          <div key={restaurant._id} className="info-card">
                            <div className="card-field">
                              <span className="field-label">ID</span>
                              <span className="field-value id-value">{restaurant._id.substring(0, 10)}...</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Owner Name</span>
                              <span className="field-value">{restaurant.name}</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Email</span>
                              <span className="field-value">{restaurant.email}</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Joined Date</span>
                              <span className="field-value">{formatDate(restaurant.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No restaurants registered yet.</p>
                    )}
                  </div>
                </>
              )}

              {/* All Users Tab */}
              {activeTab === 'users' && (
                <div className="admin-section">
                  <h3 className="section-title">All Registered Users</h3>
                  {allUsers.length > 0 ? (
                    <div className="cards-container">
                      {allUsers.map((user) => (
                        <div key={user._id} className="info-card info-card-with-action">
                          <div className="card-field">
                            <span className="field-label">ID</span>
                            <span className="field-value id-value">{user._id.substring(0, 10)}...</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Name</span>
                            <span className="field-value">{user.name}</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Email</span>
                            <span className="field-value">{user.email}</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Joined Date</span>
                            <span className="field-value">{formatDate(user.createdAt)}</span>
                          </div>
                          <div className="card-actions">
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteClick('User', user._id, user.name)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No users found.</p>
                  )}
                </div>
              )}

              {/* All Restaurants Tab */}
              {activeTab === 'restaurants' && (
                <div className="admin-section">
                  <h3 className="section-title">All Registered Restaurants</h3>
                  {allRestaurants.length > 0 ? (
                    <div className="cards-container">
                      {allRestaurants.map((restaurant) => (
                        <div key={restaurant._id} className="info-card info-card-with-action">
                          <div className="card-field">
                            <span className="field-label">ID</span>
                            <span className="field-value id-value">{restaurant._id.substring(0, 10)}...</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Owner Name</span>
                            <span className="field-value">{restaurant.name}</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Email</span>
                            <span className="field-value">{restaurant.email}</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Joined Date</span>
                            <span className="field-value">{formatDate(restaurant.createdAt)}</span>
                          </div>
                          <div className="card-actions">
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteClick('Restaurant', restaurant._id, restaurant.name)}
                            >
                               Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No restaurants found.</p>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="admin-section">
                  <h3 className="section-title">Restaurant Messages</h3>
                  
                  {/* Restaurant Messages */}
                  <div className="messages-subsection">
                    <h4 className="subsection-title">Messages from Restaurants ({restaurantMessages.length})</h4>
                    {restaurantMessages.length > 0 ? (
                      <div className="messages-container">
                        {restaurantMessages.map((msg) => (
                          <div key={msg._id} className="message-card">
                            <div className="message-header">
                              <div className="message-sender">
                                <span className="sender-icon">🏪</span>
                                <div>
                                  <strong>{msg.restaurantName || 'Restaurant'}</strong>
                                  <span className="sender-email">{msg.email}</span>
                                </div>
                              </div>
                              <span className="message-date">{formatDate(msg.createdAt)}</span>
                            </div>
                            <div className="message-subject">
                              <strong>Subject:</strong> {msg.subject}
                              {msg.status === 'replied' && (
                                <span style={{
                                  marginLeft: '1rem',
                                  padding: '0.25rem 0.75rem',
                                  background: 'linear-gradient(135deg, #6B8E23, #556B2F)',
                                  color: 'white',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600'
                                }}>
                                  ✓ Replied
                                </span>
                              )}
                            </div>
                            <div className="message-body">
                              {msg.message}
                            </div>
                            <div className="message-actions">
                              <button 
                                className="reply-btn"
                                onClick={() => handleOpenReply(msg)}
                                disabled={msg.status === 'replied'}
                                style={{
                                  opacity: msg.status === 'replied' ? 0.6 : 1,
                                  cursor: msg.status === 'replied' ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {msg.status === 'replied' ? '✓ Replied' : '↩️ Reply'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No messages from restaurants.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="admin-section">
                  <h3 className="section-title">Settings</h3>
                  
                  <div className="settings-form">
                    <h4 className="form-title">Website Configuration</h4>
                    <form className="admin-form">
                      <div className="form-group">
                        <label>Website Name</label>
                        <input
                          type="text"
                          value={settings.websiteName}
                          onChange={(e) => setSettings({...settings, websiteName: e.target.value})}
                          placeholder="Enter website name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Contact Email</label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                          placeholder="Enter contact email"
                        />
                      </div>
                      <div className="form-group">
                        <label>Contact Phone</label>
                        <input
                          type="tel"
                          value={settings.contactPhone}
                          onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                          placeholder="Enter contact phone"
                        />
                      </div>
                      <button type="button" className="save-btn" onClick={() => {
                        setSuccessMessage('Settings saved successfully!');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}>
                        💾 Save Settings
                      </button>
                    </form>
                  </div>

                  <div className="settings-info">
                    <h4 className="form-title">System Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Platform:</span>
                        <span className="info-value">SafeBytes Admin Panel</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Version:</span>
                        <span className="info-value">1.0.0</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Last Updated:</span>
                        <span className="info-value">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
