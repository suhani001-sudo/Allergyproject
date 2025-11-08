import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDeleteModal from './AdminDeleteModal';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
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
  
  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });
  
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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
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

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Admin created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setNewAdmin({ name: '', email: '', password: '' });
        fetchAllAdmins();
        fetchAdminStats();
      } else {
        setError(data.message || 'Failed to create admin');
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('Network error. Please try again.');
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
          <button onClick={handleLogout} className="admin-logout-btn">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

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
              {/* Statistics Cards */}
              <div className="stats-grid">
                <div className="stat-card stat-users">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                  </div>
                </div>

                <div className="stat-card stat-restaurants">
                  <div className="stat-icon">🏪</div>
                  <div className="stat-content">
                    <h3>Total Restaurants</h3>
                    <p className="stat-number">{stats.totalRestaurants}</p>
                  </div>
                </div>

                <div className="stat-card stat-admins">
                  <div className="stat-icon">👨‍💼</div>
                  <div className="stat-content">
                    <h3>Total Admins</h3>
                    <p className="stat-number">{allAdmins.length}</p>
                  </div>
                </div>

                <div className="stat-card stat-messages">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <h3>Total Messages</h3>
                    <p className="stat-number">{userMessages.length + restaurantMessages.length}</p>
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
                  className={`admin-tab ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admins')}
                >
                  👨‍💼 Admins ({allAdmins.length})
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

              {/* Admins Tab */}
              {activeTab === 'admins' && (
                <div className="admin-section">
                  <h3 className="section-title">Admin Management</h3>
                  
                  {/* Create New Admin Form */}
                  <div className="create-admin-form">
                    <h4 className="form-title">Create New Admin</h4>
                    <form onSubmit={handleCreateAdmin} className="admin-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            value={newAdmin.name}
                            onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                            placeholder="Enter admin name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                            placeholder="Enter admin email"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            type="password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                            placeholder="Enter password"
                            required
                          />
                        </div>
                        <button type="submit" className="create-btn">➕ Create Admin</button>
                      </div>
                    </form>
                  </div>

                  {/* All Admins List */}
                  <h4 className="subsection-title">All Admins ({allAdmins.length})</h4>
                  {allAdmins.length > 0 ? (
                    <div className="cards-container">
                      {allAdmins.map((admin) => (
                        <div key={admin._id} className="info-card info-card-with-action">
                          <div className="card-field">
                            <span className="field-label">ID</span>
                            <span className="field-value id-value">{admin._id.substring(0, 10)}...</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Name</span>
                            <span className="field-value">{admin.name}</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Email</span>
                            <span className="field-value">{admin.email}</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Joined Date</span>
                            <span className="field-value">{formatDate(admin.createdAt)}</span>
                          </div>
                          <div className="card-actions">
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteClick('Admin', admin._id, admin.name)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No admins found.</p>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="admin-section">
                  <h3 className="section-title">Messages & Feedback</h3>
                  
                  {/* User Messages */}
                  <div className="messages-subsection">
                    <h4 className="subsection-title">Messages from Users ({userMessages.length})</h4>
                    {userMessages.length > 0 ? (
                      <div className="messages-container">
                        {userMessages.map((msg) => (
                          <div key={msg._id} className="message-card">
                            <div className="message-header">
                              <div className="message-sender">
                                <span className="sender-icon">👤</span>
                                <div>
                                  <strong>{msg.name}</strong>
                                  <span className="sender-email">{msg.email}</span>
                                </div>
                              </div>
                              <span className="message-date">{formatDate(msg.createdAt)}</span>
                            </div>
                            <div className="message-subject">
                              <strong>Subject:</strong> {msg.subject}
                            </div>
                            <div className="message-body">
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No messages from users.</p>
                    )}
                  </div>

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
                            </div>
                            <div className="message-body">
                              {msg.message}
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
