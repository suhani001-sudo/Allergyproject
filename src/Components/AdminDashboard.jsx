import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalRestaurantProfiles: 0,
    recentUsers: [],
    recentRestaurants: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
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
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <h1>🔐 SafeBytes Admin Panel</h1>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          <h2 className="admin-title">Dashboard Overview</h2>

          {loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading statistics...</p>
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

                <div className="stat-card stat-profiles">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <h3>Restaurant Profiles</h3>
                    <p className="stat-number">{stats.totalRestaurantProfiles}</p>
                  </div>
                </div>
              </div>

              {/* Recent Users Section */}
              <div className="admin-section">
                <h3 className="section-title">Recent Users</h3>
                {stats.recentUsers.length > 0 ? (
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentUsers.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{formatDate(user.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No users registered yet.</p>
                )}
              </div>

              {/* Recent Restaurants Section */}
              <div className="admin-section">
                <h3 className="section-title">Recent Restaurants</h3>
                {stats.recentRestaurants.length > 0 ? (
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Owner Name</th>
                          <th>Email</th>
                          <th>Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentRestaurants.map((restaurant) => (
                          <tr key={restaurant._id}>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.email}</td>
                            <td>{formatDate(restaurant.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No restaurants registered yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
