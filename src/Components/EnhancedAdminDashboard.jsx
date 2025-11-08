import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnhancedAdminDashboard.css';
import AdminDeleteModal from './AdminDeleteModal';

function EnhancedAdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Data states
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalAdmins: 0,
        totalMessages: 0
    });
    
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const [restaurantMessages, setRestaurantMessages] = useState([]);
    
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Search states
    const [userSearch, setUserSearch] = useState('');
    const [restaurantSearch, setRestaurantSearch] = useState('');
    const [adminSearch, setAdminSearch] = useState('');
    
    // Modal states
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        type: '',
        id: '',
        name: ''
    });
    
    // Edit states
    const [editingUser, setEditingUser] = useState(null);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);
    
    // Create admin state
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
    
    // Toast notification
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Fetch stats
            const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = await statsRes.json();
            
            if (statsData.success) {
                setStats({
                    totalUsers: statsData.data.totalUsers || 0,
                    totalRestaurants: statsData.data.totalRestaurants || 0,
                    totalAdmins: statsData.data.totalAdmins || 0,
                    totalMessages: statsData.data.totalMessages || 0
                });
            }
            
            // Fetch users
            const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersRes.json();
            if (usersData.success) setUsers(usersData.data || []);
            
            // Fetch restaurants
            const restaurantsRes = await fetch('http://localhost:5000/api/admin/restaurants', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const restaurantsData = await restaurantsRes.json();
            if (restaurantsData.success) setRestaurants(restaurantsData.data || []);
            
            // Fetch admins
            const adminsRes = await fetch('http://localhost:5000/api/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const adminsData = await adminsRes.json();
            if (adminsData.success) setAdmins(adminsData.data || []);
            
            // Fetch user messages
            const userMsgRes = await fetch('http://localhost:5000/api/admin/user-messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userMsgData = await userMsgRes.json();
            if (userMsgData.success) setUserMessages(userMsgData.data || []);
            
            // Fetch restaurant messages
            const restMsgRes = await fetch('http://localhost:5000/api/admin/restaurant-messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const restMsgData = await restMsgRes.json();
            if (restMsgData.success) setRestaurantMessages(restMsgData.data || []);
            
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Delete handlers
    const handleDeleteClick = (type, id, name) => {
        setDeleteModal({ isOpen: true, type, id, name });
    };

    const confirmDelete = async () => {
        const { type, id } = deleteModal;
        const token = localStorage.getItem('token');
        
        try {
            const endpoint = type === 'User' ? 'users' : type === 'Restaurant' ? 'restaurants' : 'admins';
            const response = await fetch(`http://localhost:5000/api/admin/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast(`${type} deleted successfully`, 'success');
                fetchAllData();
            } else {
                showToast(data.message || 'Failed to delete', 'error');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            showToast('Error deleting item', 'error');
        }
        
        setDeleteModal({ isOpen: false, type: '', id: '', name: '' });
    };

    // Create admin handler
    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('http://localhost:5000/api/admin/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAdmin)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast('Admin created successfully', 'success');
                setNewAdmin({ name: '', email: '', password: '' });
                fetchAllData();
            } else {
                showToast(data.message || 'Failed to create admin', 'error');
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            showToast('Error creating admin', 'error');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter functions
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
        restaurant.email?.toLowerCase().includes(restaurantSearch.toLowerCase())
    );

    const filteredAdmins = admins.filter(admin =>
        admin.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
        admin.email?.toLowerCase().includes(adminSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="enhanced-admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="enhanced-admin-dashboard">
            {/* Delete Modal */}
            <AdminDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
                onConfirm={confirmDelete}
                itemType={deleteModal.type}
                itemName={deleteModal.name}
            />

            {/* Toast Notification */}
            {toast.show && (
                <div className={`enhanced-toast enhanced-toast-${toast.type}`}>
                    <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
                    <span className="toast-message">{toast.message}</span>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`enhanced-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <img src="/images/green_logo.jpg" alt="Logo" className="sidebar-logo" />
                    {sidebarOpen && <h2 className="sidebar-title">SafeBytes Admin</h2>}
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="sidebar-icon">📊</span>
                        {sidebarOpen && <span className="sidebar-label">Dashboard</span>}
                    </button>

                    <button
                        className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span className="sidebar-icon">👥</span>
                        {sidebarOpen && <span className="sidebar-label">Users</span>}
                    </button>

                    <button
                        className={`sidebar-item ${activeTab === 'restaurants' ? 'active' : ''}`}
                        onClick={() => setActiveTab('restaurants')}
                    >
                        <span className="sidebar-icon">🏪</span>
                        {sidebarOpen && <span className="sidebar-label">Restaurants</span>}
                    </button>

                    <button
                        className={`sidebar-item ${activeTab === 'admins' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admins')}
                    >
                        <span className="sidebar-icon">👨‍💼</span>
                        {sidebarOpen && <span className="sidebar-label">Admins</span>}
                    </button>

                    <button
                        className={`sidebar-item ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <span className="sidebar-icon">💬</span>
                        {sidebarOpen && <span className="sidebar-label">Messages</span>}
                    </button>

                    <button
                        className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="sidebar-icon">⚙️</span>
                        {sidebarOpen && <span className="sidebar-label">Settings</span>}
                    </button>
                </nav>

                <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span className="toggle-icon">{sidebarOpen ? '◀' : '▶'}</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="enhanced-main">
                {/* Header */}
                <header className="enhanced-header">
                    <div className="header-left">
                        <h1 className="header-title">
                            {activeTab === 'overview' && '📊 Dashboard Overview'}
                            {activeTab === 'users' && '👥 User Management'}
                            {activeTab === 'restaurants' && '🏪 Restaurant Management'}
                            {activeTab === 'admins' && '👨‍💼 Admin Management'}
                            {activeTab === 'messages' && '💬 Messages & Feedback'}
                            {activeTab === 'settings' && '⚙️ Settings'}
                        </h1>
                    </div>
                    <div className="header-right">
                        <button className="header-logout-btn" onClick={handleLogout}>
                            <span className="logout-icon">🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="enhanced-content">
                    {/* Dashboard Overview */}
                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            <div className="stats-grid">
                                <div className="stat-card stat-users">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-details">
                                        <h3 className="stat-label">Total Users</h3>
                                        <p className="stat-value">{stats.totalUsers}</p>
                                    </div>
                                </div>

                                <div className="stat-card stat-restaurants">
                                    <div className="stat-icon">🏪</div>
                                    <div className="stat-details">
                                        <h3 className="stat-label">Total Restaurants</h3>
                                        <p className="stat-value">{stats.totalRestaurants}</p>
                                    </div>
                                </div>

                                <div className="stat-card stat-admins">
                                    <div className="stat-icon">👨‍💼</div>
                                    <div className="stat-details">
                                        <h3 className="stat-label">Total Admins</h3>
                                        <p className="stat-value">{stats.totalAdmins}</p>
                                    </div>
                                </div>

                                <div className="stat-card stat-messages">
                                    <div className="stat-icon">💬</div>
                                    <div className="stat-details">
                                        <h3 className="stat-label">Total Messages</h3>
                                        <p className="stat-value">{userMessages.length + restaurantMessages.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="overview-grid">
                                <div className="overview-card">
                                    <h3 className="overview-card-title">Recent Users</h3>
                                    <div className="overview-list">
                                        {users.slice(0, 5).map(user => (
                                            <div key={user._id} className="overview-item">
                                                <span className="item-name">{user.name}</span>
                                                <span className="item-date">{formatDate(user.createdAt)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="overview-card">
                                    <h3 className="overview-card-title">Recent Restaurants</h3>
                                    <div className="overview-list">
                                        {restaurants.slice(0, 5).map(restaurant => (
                                            <div key={restaurant._id} className="overview-item">
                                                <span className="item-name">{restaurant.name}</span>
                                                <span className="item-date">{formatDate(restaurant.createdAt)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Management - Continuing in next message due to length */}
                </div>
            </main>
        </div>
    );
}

export default EnhancedAdminDashboard;
