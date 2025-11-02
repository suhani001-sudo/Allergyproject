import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Reusing the same CSS
import Footer from './Footer';

function RestaurantProfile() {
    const navigate = useNavigate();

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const [activeSection, setActiveSection] = useState('basic');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Restaurant data
    const [restaurantData, setRestaurantData] = useState({
        restaurantName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        cuisineType: '',
        description: '',
        openingHours: '',
        closingHours: '',
        memberSince: 'January 2025'
    });

    const [tempRestaurantData, setTempRestaurantData] = useState({ ...restaurantData });
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isEditingBusiness, setIsEditingBusiness] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);

    // ========================================
    // LOAD DATA FROM BACKEND
    // ========================================
    useEffect(() => {
        async function fetchRestaurantProfile() {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    
                    // Fetch full restaurant profile from backend
                    const response = await fetch('http://localhost:5000/api/restaurant-profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const data = result.data || result;
                        const loadedData = {
                            restaurantName: data.restaurantName || parsedUser.restaurantName || '',
                            ownerName: data.ownerName || data.name || parsedUser.name || '',
                            email: data.email || parsedUser.email || '',
                            phone: data.phone || '',
                            address: data.address || '',
                            city: data.city || '',
                            state: data.state || '',
                            country: data.country || '',
                            zipCode: data.zipCode || '',
                            cuisineType: data.cuisineType || '',
                            description: data.description || '',
                            openingHours: data.openingHours || '09:00',
                            closingHours: data.closingHours || '22:00',
                            memberSince: data.memberSince || 'January 2025'
                        };
                        setRestaurantData(loadedData);
                        setTempRestaurantData(loadedData);
                    } else {
                        // Fallback to localStorage data
                        const loadedData = {
                            ...restaurantData,
                            restaurantName: parsedUser.restaurantName || '',
                            ownerName: parsedUser.name || '',
                            email: parsedUser.email || ''
                        };
                        setRestaurantData(loadedData);
                        setTempRestaurantData(loadedData);
                    }
                }
            } catch (error) {
                console.error('Error loading restaurant profile:', error);
                showErrorMessage('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        }

        fetchRestaurantProfile();
    }, []);

    // ========================================
    // HANDLER FUNCTIONS - BASIC PROFILE
    // ========================================
    const handleEdit = () => {
        setTempRestaurantData({ ...restaurantData });
        setIsEditing(true);
    };

    const handleSave = async () => {
        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(tempRestaurantData.email)) {
            showErrorMessage('Please enter a valid email address');
            return;
        }

        if (!tempRestaurantData.restaurantName.trim()) {
            showErrorMessage('Restaurant name is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/restaurant-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempRestaurantData)
            });

            if (response.ok) {
                const result = await response.json();
                setRestaurantData({ ...tempRestaurantData });
                setIsEditing(false);
                
                // Update localStorage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({
                    ...storedUser,
                    name: tempRestaurantData.ownerName,
                    email: tempRestaurantData.email,
                    restaurantName: tempRestaurantData.restaurantName
                }));
                
                showSuccessMessage('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                showErrorMessage(errorData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showErrorMessage('Network error. Please try again.');
        }
    };

    const handleCancel = () => {
        setTempRestaurantData({ ...restaurantData });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setTempRestaurantData(prev => ({ ...prev, [field]: value }));
    };

    // ========================================
    // CONTACT INFO HANDLERS
    // ========================================
    const handleSaveContact = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/restaurant-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempRestaurantData)
            });

            if (response.ok) {
                setRestaurantData({ ...tempRestaurantData });
                setIsEditingContact(false);
                showSuccessMessage('Contact information updated successfully!');
            } else {
                showErrorMessage('Failed to update contact information');
            }
        } catch (error) {
            console.error('Error updating contact info:', error);
            showErrorMessage('Network error. Please try again.');
        }
    };

    // ========================================
    // BUSINESS INFO HANDLERS
    // ========================================
    const handleSaveBusinessInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/restaurant-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempRestaurantData)
            });

            if (response.ok) {
                setRestaurantData({ ...tempRestaurantData });
                setIsEditingBusiness(false);
                showSuccessMessage('Business information updated successfully!');
            } else {
                showErrorMessage('Failed to update business information');
            }
        } catch (error) {
            console.error('Error updating business info:', error);
            showErrorMessage('Network error. Please try again.');
        }
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    const showSuccessMessage = (message) => {
        setAlertMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const showErrorMessage = (message) => {
        setAlertMessage(message);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3000);
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
                showSuccessMessage('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ========================================
    // NAVIGATION DATA
    // ========================================
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', path: '/restaurant-dashboard' },
        { id: 'Contact', label: 'Contact', path: '/restaurant-contact' },
        { id: 'About', label: 'About us', path: '/restaurant-about' },
        { id: 'Profile', label: 'Profile', path: '/restaurant-profile' }
    ];

    const profileSections = [
        { id: 'basic', label: 'Basic Information', icon: '🏪' },
        { id: 'contact', label: 'Contact Information', icon: '📧' },
        { id: 'business', label: 'Business Details', icon: '🍽️' },
        { id: 'settings', label: 'Account Settings', icon: '⚙️' }
    ];

    function handleNavClick(item) {
        if (item && item.path) {
            navigate(item.path);
        }
    }

    // ========================================
    // RENDER
    // ========================================
    if (loading) {
        return (
            <div className="profile-page">
                <nav className="navbar">
                    <div className="nav-container">
                        <div className="nav-logo">
                            <img src="/images/green_logo.jpg" alt="SafeBytes Logo" className="logo-image" />
                            <span className="logo-text">SafeBytes</span>
                        </div>
                    </div>
                </nav>
                <div style={{ padding: '4rem', textAlign: 'center', color: '#6B8E23' }}>
                    <h2>Loading profile...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo" onClick={() => navigate('/restaurant-dashboard')}>
                        <img src="/images/green_logo.jpg" alt="SafeBytes Logo" className="logo-image" />
                        <span className="logo-text">SafeBytes</span>
                    </div>

                    <div className="nav-links">
                        {navItems.map(function (item) {
                            const isActive = item.id === 'Profile';
                            return (
                                <button key={item.id} className={`nav-link ${isActive ? 'active' : ''}`} onClick={() => handleNavClick(item)}>
                                    <span className="nav-label">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <button className="logout-button" onClick={handleLogout}>
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Success Alert */}
            {showSuccessAlert && (
                <div className="success-alert">
                    {alertMessage}
                </div>
            )}

            {/* Error Alert */}
            {showErrorAlert && (
                <div className="success-alert" style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', color: 'white' }}>
                    {alertMessage}
                </div>
            )}

            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header-bar">
                    <div className="profile-header-content">
                        <div className="profile-avatar-small">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="avatar-img-small" />
                            ) : (
                                <div className="avatar-placeholder-small">{restaurantData.restaurantName.charAt(0).toUpperCase() || 'R'}</div>
                            )}
                        </div>
                        <div className="profile-header-info">
                            <h2 className="profile-header-name">{restaurantData.restaurantName || 'Restaurant Name'}</h2>
                            <p className="profile-header-welcome">Welcome back, {restaurantData.ownerName}!</p>
                            <p className="profile-header-email">{restaurantData.email}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-layout">
                    {/* Left Navigation Panel */}
                    <div className="profile-nav-panel">
                        <h3 className="nav-panel-title">Profile Sections</h3>
                        <div className="profile-nav-list">
                            {profileSections.map((section) => (
                                <button key={section.id} className={`profile-nav-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => setActiveSection(section.id)}>
                                    <span className="nav-item-icon">{section.icon}</span>
                                    <span className="nav-item-label">{section.label}</span>
                                    <span className="nav-item-arrow">›</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="profile-content-area">
                        {/* BASIC INFORMATION SECTION */}
                        {activeSection === 'basic' && (
                            <div className="section-content fade-in">
                                <div className="section-header-row">
                                    <h2 className="section-title">Basic Information</h2>
                                    {!isEditing ? (
                                        <button className="btn-edit-section" onClick={handleEdit}>Edit</button>
                                    ) : (
                                        <div className="edit-actions-header">
                                            <button className="btn-save-section" onClick={handleSave}>Save Changes</button>
                                            <button className="btn-cancel-section" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    )}
                                </div>

                                <div className="profile-picture-section">
                                    <div className="profile-picture-wrapper">
                                        {profilePicture ? (
                                            <img src={profilePicture} alt="Profile" className="profile-picture" />
                                        ) : (
                                            <div className="profile-picture-placeholder">{restaurantData.restaurantName.charAt(0).toUpperCase() || 'R'}</div>
                                        )}
                                    </div>
                                    <label htmlFor="profile-upload" className="btn-upload-picture">Change Picture</label>
                                    <input type="file" id="profile-upload" accept="image/*" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <label className="info-label">Restaurant Name</label>
                                        {isEditing ? (
                                            <input type="text" value={tempRestaurantData.restaurantName} onChange={(e) => handleInputChange('restaurantName', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.restaurantName}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Owner Name</label>
                                        {isEditing ? (
                                            <input type="text" value={tempRestaurantData.ownerName} onChange={(e) => handleInputChange('ownerName', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.ownerName}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Email Address</label>
                                        {isEditing ? (
                                            <input type="email" value={tempRestaurantData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.email}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Member Since</label>
                                        <div className="info-value">{restaurantData.memberSince}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTACT INFORMATION SECTION */}
                        {activeSection === 'contact' && (
                            <div className="section-content fade-in">
                                <div className="section-header-row">
                                    <h2 className="section-title">Contact Information</h2>
                                    {!isEditingContact ? (
                                        <button className="btn-edit-section" onClick={() => { setTempRestaurantData({ ...restaurantData }); setIsEditingContact(true); }}>Edit</button>
                                    ) : (
                                        <div className="edit-actions-header">
                                            <button className="btn-save-section" onClick={handleSaveContact}>Save Changes</button>
                                            <button className="btn-cancel-section" onClick={() => { setTempRestaurantData({ ...restaurantData }); setIsEditingContact(false); }}>Cancel</button>
                                        </div>
                                    )}
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <label className="info-label">Phone Number</label>
                                        {isEditingContact ? (
                                            <input type="tel" value={tempRestaurantData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="edit-input" placeholder="+1 (555) 123-4567" />
                                        ) : (
                                            <div className="info-value">{restaurantData.phone || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Address</label>
                                        {isEditingContact ? (
                                            <input type="text" value={tempRestaurantData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="edit-input" placeholder="Street address" />
                                        ) : (
                                            <div className="info-value">{restaurantData.address || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">City</label>
                                        {isEditingContact ? (
                                            <input type="text" value={tempRestaurantData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.city || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">State</label>
                                        {isEditingContact ? (
                                            <input type="text" value={tempRestaurantData.state} onChange={(e) => handleInputChange('state', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.state || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Country</label>
                                        {isEditingContact ? (
                                            <input type="text" value={tempRestaurantData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.country || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">ZIP Code</label>
                                        {isEditingContact ? (
                                            <input type="text" value={tempRestaurantData.zipCode} onChange={(e) => handleInputChange('zipCode', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.zipCode || 'Not provided'}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BUSINESS DETAILS SECTION */}
                        {activeSection === 'business' && (
                            <div className="section-content fade-in">
                                <div className="section-header-row">
                                    <h2 className="section-title">Business Details</h2>
                                    {!isEditingBusiness ? (
                                        <button className="btn-edit-section" onClick={() => { setTempRestaurantData({ ...restaurantData }); setIsEditingBusiness(true); }}>Edit</button>
                                    ) : (
                                        <div className="edit-actions-header">
                                            <button className="btn-save-section" onClick={handleSaveBusinessInfo}>Save Changes</button>
                                            <button className="btn-cancel-section" onClick={() => { setTempRestaurantData({ ...restaurantData }); setIsEditingBusiness(false); }}>Cancel</button>
                                        </div>
                                    )}
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <label className="info-label">Cuisine Type</label>
                                        {isEditingBusiness ? (
                                            <select value={tempRestaurantData.cuisineType} onChange={(e) => handleInputChange('cuisineType', e.target.value)} className="edit-input">
                                                <option value="">Select cuisine type</option>
                                                <option value="Italian">Italian</option>
                                                <option value="Chinese">Chinese</option>
                                                <option value="Indian">Indian</option>
                                                <option value="Mexican">Mexican</option>
                                                <option value="Japanese">Japanese</option>
                                                <option value="American">American</option>
                                                <option value="Mediterranean">Mediterranean</option>
                                                <option value="Thai">Thai</option>
                                                <option value="French">French</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <div className="info-value">{restaurantData.cuisineType || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Opening Hours</label>
                                        {isEditingBusiness ? (
                                            <input type="time" value={tempRestaurantData.openingHours} onChange={(e) => handleInputChange('openingHours', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.openingHours || 'Not set'}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Closing Hours</label>
                                        {isEditingBusiness ? (
                                            <input type="time" value={tempRestaurantData.closingHours} onChange={(e) => handleInputChange('closingHours', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{restaurantData.closingHours || 'Not set'}</div>
                                        )}
                                    </div>

                                    <div className="info-card" style={{ gridColumn: '1 / -1' }}>
                                        <label className="info-label">Restaurant Description</label>
                                        {isEditingBusiness ? (
                                            <textarea 
                                                value={tempRestaurantData.description} 
                                                onChange={(e) => handleInputChange('description', e.target.value)} 
                                                className="edit-input" 
                                                rows="4"
                                                placeholder="Describe your restaurant, specialties, and what makes it unique..."
                                            />
                                        ) : (
                                            <div className="info-value">{restaurantData.description || 'No description provided'}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACCOUNT SETTINGS SECTION */}
                        {activeSection === 'settings' && (
                            <div className="section-content fade-in">
                                <h2 className="section-title">Account Settings</h2>
                                
                                <div className="personal-section-card">
                                    <h3 className="subsection-title">Account Actions</h3>
                                    <div className="info-grid">
                                        <div className="info-card">
                                            <label className="info-label">Change Password</label>
                                            <button className="btn-edit-section" style={{ marginTop: '0.5rem' }}>
                                                Update Password
                                            </button>
                                        </div>

                                        <div className="info-card">
                                            <label className="info-label">Account Status</label>
                                            <div className="info-value">
                                                <span className="sensitivity-badge high" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                                                    Active
                                                </span>
                                            </div>
                                        </div>

                                        <div className="info-card">
                                            <label className="info-label">Data Privacy</label>
                                            <button className="btn-edit-section" style={{ marginTop: '0.5rem' }}>
                                                Download My Data
                                            </button>
                                        </div>

                                        <div className="info-card">
                                            <label className="info-label">Danger Zone</label>
                                            <button className="btn-edit-section" style={{ marginTop: '0.5rem', background: 'linear-gradient(135deg, #dc3545, #c82333)', color: 'white' }}>
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default RestaurantProfile;
