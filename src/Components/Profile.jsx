import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const [activeSection, setActiveSection] = useState('basic');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Basic user data
    const [userData, setUserData] = useState({
        fullName: 'XYZ',
        username: 'xyz_user',
        gender: 'Male',
        dateOfBirth: '1999-01-01',
        email: 'XYZ@gmail.com',
        phone: '+1 (555) 123-4567',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        dietaryPreference: 'Vegetarian',
        allergySensitivity: 'Medium',
        favoriteCuisine: 'Italian',
        showEmailPublic: false,
        memberSince: 'January 2025'
    });

    // Allergies with severity levels
    const [allergies, setAllergies] = useState([
        { id: 1, name: 'Peanuts', icon: '🥜', severity: 'Severe' },
        { id: 2, name: 'Dairy', icon: '🥛', severity: 'Moderate' },
        { id: 3, name: 'Shellfish', icon: '🦐', severity: 'Severe' }
    ]);

    // Available allergens to choose from
    const commonAllergens = [
        { name: 'Peanuts', icon: '🥜' },
        { name: 'Dairy', icon: '🥛' },
        { name: 'Shellfish', icon: '🦐' },
        { name: 'Gluten', icon: '🍞' },
        { name: 'Soy', icon: '🌱' },
        { name: 'Eggs', icon: '🥚' },
        { name: 'Tree Nuts', icon: '🌰' },
        { name: 'Fish', icon: '🐟' },
        { name: 'Wheat', icon: '🌾' },
        { name: 'Sesame', icon: '🫘' }
    ];

    // Favorite foods with alternatives
    const [favoriteFoods, setFavoriteFoods] = useState([
        { id: 1, food: 'Ice Cream', icon: '🍦', alternative: 'Soy Milk Ice Cream' },
        { id: 2, food: 'Pizza', icon: '🍕', alternative: 'Gluten-Free Pizza' },
        { id: 3, food: 'Pasta', icon: '🍝', alternative: 'Rice Pasta' }
    ]);

    const [tempUserData, setTempUserData] = useState({ ...userData });
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    // New allergy input state
    const [showAllergyInput, setShowAllergyInput] = useState(false);
    const [newAllergyName, setNewAllergyName] = useState('');
    const [newAllergySeverity, setNewAllergySeverity] = useState('Moderate');

    // New favorite food input state
    const [showFoodInput, setShowFoodInput] = useState(false);
    const [newFoodName, setNewFoodName] = useState('');
    const [newFoodAlternative, setNewFoodAlternative] = useState('');

    // ========================================
    // LOAD DATA FROM LOCALSTORAGE
    // ========================================
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const loadedData = {
                    ...userData,
                    fullName: parsedUser.name || 'XYZ',
                    email: parsedUser.email || 'XYZ@gmail.com'
                };
                setUserData(loadedData);
                setTempUserData(loadedData);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }
    }, []);

    // ========================================
    // HANDLER FUNCTIONS - BASIC PROFILE
    // ========================================
    const handleEdit = () => {
        setTempUserData({ ...userData });
        setIsEditing(true);
    };

    const handleSave = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(tempUserData.email)) {
            alert('Please enter a valid email address');
            return;
        }
        setUserData({ ...tempUserData });
        setIsEditing(false);
        localStorage.setItem('user', JSON.stringify(tempUserData));
        showSuccessMessage('Your details have been updated successfully!');
    };

    const handleCancel = () => {
        setTempUserData({ ...userData });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setTempUserData(prev => ({ ...prev, [field]: value }));
    };

    // ========================================
    // ALLERGY MANAGEMENT FUNCTIONS
    // ========================================

    // Add new allergy from input
    const handleAddAllergy = () => {
        if (!newAllergyName.trim()) {
            alert('Please enter an allergy name');
            return;
        }

        // Check if allergy already exists
        const exists = allergies.some(a => a.name.toLowerCase() === newAllergyName.trim().toLowerCase());
        if (exists) {
            alert('This allergy is already in your list');
            return;
        }

        const newAllergy = {
            id: Date.now(),
            name: newAllergyName.trim(),
            icon: '⚠️',
            severity: newAllergySeverity
        };

        setAllergies([...allergies, newAllergy]);
        setNewAllergyName('');
        setNewAllergySeverity('Moderate');
        setShowAllergyInput(false);
        showSuccessMessage('Allergy added successfully!');
    };

    // Add allergy from common list
    const handleAddCommonAllergy = (allergen) => {
        const exists = allergies.some(a => a.name === allergen.name);
        if (exists) {
            alert('This allergy is already in your list');
            return;
        }

        const newAllergy = {
            id: Date.now(),
            name: allergen.name,
            icon: allergen.icon,
            severity: 'Moderate'
        };

        setAllergies([...allergies, newAllergy]);
        showSuccessMessage('Allergy added successfully!');
    };

    // Update allergy severity
    const handleUpdateAllergySeverity = (id, severity) => {
        setAllergies(allergies.map(a =>
            a.id === id ? { ...a, severity } : a
        ));
        showSuccessMessage('Allergy severity updated!');
    };

    // Remove allergy
    const handleRemoveAllergy = (id) => {
        if (window.confirm('Are you sure you want to remove this allergy?')) {
            setAllergies(allergies.filter(a => a.id !== id));
            showSuccessMessage('Allergy removed successfully!');
        }
    };

    // ========================================
    // FAVORITE FOODS MANAGEMENT FUNCTIONS
    // ========================================

    // Add new favorite food with alternative
    const handleAddFavoriteFood = () => {
        if (!newFoodName.trim()) {
            alert('Please enter a food name');
            return;
        }
        if (!newFoodAlternative.trim()) {
            alert('Please enter an alternative food');
            return;
        }

        const newFood = {
            id: Date.now(),
            food: newFoodName.trim(),
            icon: '🍽️',
            alternative: newFoodAlternative.trim()
        };

        setFavoriteFoods([...favoriteFoods, newFood]);
        setNewFoodName('');
        setNewFoodAlternative('');
        setShowFoodInput(false);
        showSuccessMessage('Favorite food added successfully!');
    };

    // Update favorite food
    const handleUpdateFavoriteFood = (id, field, value) => {
        setFavoriteFoods(favoriteFoods.map(f =>
            f.id === id ? { ...f, [field]: value } : f
        ));
    };

    // Remove favorite food
    const handleRemoveFavoriteFood = (id) => {
        if (window.confirm('Are you sure you want to remove this food?')) {
            setFavoriteFoods(favoriteFoods.filter(f => f.id !== id));
            showSuccessMessage('Favorite food removed successfully!');
        }
    };

    // Save personal details changes
    const handleSavePersonalDetails = () => {
        setIsEditingPersonal(false);
        showSuccessMessage('Personal details saved successfully!');
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    const showSuccessMessage = (message) => {
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
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
        { id: 'Dashboard', label: 'Dashboard', path: '/dashboard' },
        { id: 'Restaurants', label: 'Restaurants', path: '/restaurants' },
        { id: 'Allergies', label: 'Allergies', path: '/allergy-info' },
        { id: 'Contact', label: 'Contact', path: '/contact' },
        { id: 'About', label: 'About us', path: '/about-us' },
        { id: 'Profile', label: 'Profile', path: '/profile' }
    ];

    const profileSections = [
        { id: 'basic', label: 'Basic Information', icon: '👤' },
        { id: 'contact', label: 'Contact Information', icon: '📧' },
        { id: 'personal', label: 'Personal Details', icon: '🍽️' },
        { id: 'account', label: 'Account Settings', icon: '⚙️' }
    ];

    function handleNavClick(item) {
        if (item && item.path) {
            navigate(item.path);
        }
    }

    // ========================================
    // RENDER
    // ========================================
    return (
        <div className="profile-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo" onClick={() => navigate('/dashboard')}>
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
                    Your preferences have been updated successfully!
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
                                <div className="avatar-placeholder-small">{userData.fullName.charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                        <div className="profile-header-info">
                            <h2 className="profile-header-name">{userData.fullName}</h2>
                            <p className="profile-header-welcome">Welcome back, {userData.fullName}!</p>
                            <p className="profile-header-email">{userData.email}</p>
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
                                            <div className="profile-picture-placeholder">{userData.fullName.charAt(0).toUpperCase()}</div>
                                        )}
                                    </div>
                                    <label htmlFor="profile-upload" className="btn-upload-picture">Change Picture</label>
                                    <input type="file" id="profile-upload" accept="image/*" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <label className="info-label">Full Name</label>
                                        {isEditing ? (
                                            <input type="text" value={tempUserData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.fullName}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Username</label>
                                        {isEditing ? (
                                            <input type="text" value={tempUserData.username} onChange={(e) => handleInputChange('username', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.username}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Gender</label>
                                        {isEditing ? (
                                            <select value={tempUserData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="edit-input">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <div className="info-value">{userData.gender}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Date of Birth</label>
                                        {isEditing ? (
                                            <input type="date" value={tempUserData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.dateOfBirth}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTACT INFORMATION SECTION */}
                        {activeSection === 'contact' && (
                            <div className="section-content fade-in">
                                <div className="section-header-row">
                                    <h2 className="section-title">Contact Information</h2>
                                    {!isEditing ? (
                                        <button className="btn-edit-section" onClick={handleEdit}>Edit</button>
                                    ) : (
                                        <div className="edit-actions-header">
                                            <button className="btn-save-section" onClick={handleSave}>Save Changes</button>
                                            <button className="btn-cancel-section" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    )}
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <label className="info-label">Email Address</label>
                                        {isEditing ? (
                                            <input type="email" value={tempUserData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.email}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Phone Number</label>
                                        {isEditing ? (
                                            <input type="tel" value={tempUserData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.phone}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">City</label>
                                        {isEditing ? (
                                            <input type="text" value={tempUserData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.city}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">State</label>
                                        {isEditing ? (
                                            <input type="text" value={tempUserData.state} onChange={(e) => handleInputChange('state', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.state}</div>
                                        )}
                                    </div>

                                    <div className="info-card">
                                        <label className="info-label">Country</label>
                                        {isEditing ? (
                                            <input type="text" value={tempUserData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="edit-input" />
                                        ) : (
                                            <div className="info-value">{userData.country}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PERSONAL DETAILS SECTION - ENHANCED */}
                        {activeSection === 'personal' && (
                            <div className="section-content fade-in">
                                <div className="section-header-row">
                                    <h2 className="section-title">Personal Details</h2>
                                    {!isEditingPersonal ? (
                                        <button className="btn-edit-section" onClick={() => setIsEditingPersonal(true)}>Edit</button>
                                    ) : (
                                        <div className="edit-actions-header">
                                            <button className="btn-save-section" onClick={handleSavePersonalDetails}>Save Changes</button>
                                            <button className="btn-cancel-section" onClick={() => setIsEditingPersonal(false)}>Cancel</button>
                                        </div>
                                    )}
                                </div>

                                {/* Dietary Preferences */}
                                <div className="personal-section-card">
                                    <h3 className="subsection-title">Dietary Preferences</h3>
                                    <div className="info-grid">
                                        <div className="info-card">
                                            <label className="info-label">Dietary Preference</label>
                                            {isEditingPersonal ? (
                                                <select value={userData.dietaryPreference} onChange={(e) => setUserData({ ...userData, dietaryPreference: e.target.value })} className="edit-input">
                                                    <option value="Vegetarian">Vegetarian</option>
                                                    <option value="Vegan">Vegan</option>
                                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                                    <option value="Pescatarian">Pescatarian</option>
                                                    <option value="Keto">Keto</option>
                                                </select>
                                            ) : (
                                                <div className="info-value">{userData.dietaryPreference}</div>
                                            )}
                                        </div>

                                        <div className="info-card">
                                            <label className="info-label">Allergy Sensitivity Level</label>
                                            {isEditingPersonal ? (
                                                <select value={userData.allergySensitivity} onChange={(e) => setUserData({ ...userData, allergySensitivity: e.target.value })} className="edit-input">
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            ) : (
                                                <div className="info-value">
                                                    <span className={`sensitivity-badge ${userData.allergySensitivity.toLowerCase()}`}>
                                                        {userData.allergySensitivity}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="info-card">
                                            <label className="info-label">Favorite Cuisine</label>
                                            {isEditingPersonal ? (
                                                <input type="text" value={userData.favoriteCuisine} onChange={(e) => setUserData({ ...userData, favoriteCuisine: e.target.value })} className="edit-input" />
                                            ) : (
                                                <div className="info-value">{userData.favoriteCuisine}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Allergies & Severity */}
                                <div className="personal-section-card">
                                    <div className="subsection-header">
                                        <h3 className="subsection-title">🩺 Allergies & Severity</h3>
                                        <button className="btn-add-small" onClick={() => setShowAllergyInput(!showAllergyInput)}>
                                            {showAllergyInput ? 'Cancel' : '+ Add Allergy'}
                                        </button>
                                    </div>

                                    {/* Add New Allergy Form */}
                                    {showAllergyInput && (
                                        <div className="add-item-form">
                                            <div className="form-row">
                                                <input
                                                    type="text"
                                                    placeholder="Enter allergy name"
                                                    value={newAllergyName}
                                                    onChange={(e) => setNewAllergyName(e.target.value)}
                                                    className="form-input"
                                                />
                                                <select
                                                    value={newAllergySeverity}
                                                    onChange={(e) => setNewAllergySeverity(e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="Mild">Mild</option>
                                                    <option value="Moderate">Moderate</option>
                                                    <option value="Severe">Severe</option>
                                                </select>
                                                <button className="btn-form-submit" onClick={handleAddAllergy}>Add</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Common Allergens Quick Add */}
                                    <div className="quick-select-container">
                                        <p className="quick-select-label">Quick Select:</p>
                                        <div className="quick-select-grid">
                                            {commonAllergens.map((allergen, index) => (
                                                <button
                                                    key={index}
                                                    className="quick-select-btn"
                                                    onClick={() => handleAddCommonAllergy(allergen)}
                                                >
                                                    <span>{allergen.icon}</span>
                                                    <span>{allergen.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* User's Allergies List */}
                                    <div className="allergies-list">
                                        {allergies.length === 0 ? (
                                            <div className="empty-state">
                                                <p>No allergies added yet. Add your allergies to get personalized recommendations.</p>
                                            </div>
                                        ) : (
                                            allergies.map((allergy) => (
                                                <div key={allergy.id} className="allergy-item">
                                                    <div className="allergy-info">
                                                        <span className="allergy-icon">{allergy.icon}</span>
                                                        <span className="allergy-name">{allergy.name}</span>
                                                    </div>
                                                    <div className="allergy-actions">
                                                        {isEditingPersonal ? (
                                                            <select
                                                                value={allergy.severity}
                                                                onChange={(e) => handleUpdateAllergySeverity(allergy.id, e.target.value)}
                                                                className={`severity-select ${allergy.severity.toLowerCase()}`}
                                                            >
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </select>
                                                        ) : (
                                                            <span className={`severity-badge ${allergy.severity.toLowerCase()}`}>
                                                                {allergy.severity}
                                                            </span>
                                                        )}
                                                        {isEditingPersonal && (
                                                            <button className="btn-remove" onClick={() => handleRemoveAllergy(allergy.id)}>×</button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Favorite Foods & Alternatives */}
                                <div className="personal-section-card">
                                    <div className="subsection-header">
                                        <h3 className="subsection-title">🍲 Favorite Foods & Alternatives</h3>
                                        <button className="btn-add-small" onClick={() => setShowFoodInput(!showFoodInput)}>
                                            {showFoodInput ? 'Cancel' : '+ Add Food Pair'}
                                        </button>
                                    </div>

                                    {/* Add New Food Pair Form */}
                                    {showFoodInput && (
                                        <div className="add-item-form">
                                            <div className="form-row-stacked">
                                                <input
                                                    type="text"
                                                    placeholder="Favorite food (e.g., Ice Cream)"
                                                    value={newFoodName}
                                                    onChange={(e) => setNewFoodName(e.target.value)}
                                                    className="form-input"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Safe alternative (e.g., Soy Milk Ice Cream)"
                                                    value={newFoodAlternative}
                                                    onChange={(e) => setNewFoodAlternative(e.target.value)}
                                                    className="form-input"
                                                />
                                                <button className="btn-form-submit" onClick={handleAddFavoriteFood}>Add Food Pair</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* User's Favorite Foods List */}
                                    <div className="foods-list">
                                        {favoriteFoods.length === 0 ? (
                                            <div className="empty-state">
                                                <p>No favorite foods added yet. Add your favorites to discover safe alternatives.</p>
                                            </div>
                                        ) : (
                                            favoriteFoods.map((food) => (
                                                <div key={food.id} className="food-item">
                                                    <div className="food-pair">
                                                        <div className="food-original">
                                                            <span className="food-icon">{food.icon}</span>
                                                            {isEditingPersonal ? (
                                                                <input
                                                                    type="text"
                                                                    value={food.food}
                                                                    onChange={(e) => handleUpdateFavoriteFood(food.id, 'food', e.target.value)}
                                                                    className="food-edit-input"
                                                                />
                                                            ) : (
                                                                <span className="food-name">{food.food}</span>
                                                            )}
                                                        </div>
                                                        <div className="food-arrow">→</div>
                                                        <div className="food-alternative">
                                                            <span className="alternative-icon">✅</span>
                                                            {isEditingPersonal ? (
                                                                <input
                                                                    type="text"
                                                                    value={food.alternative}
                                                                    onChange={(e) => handleUpdateFavoriteFood(food.id, 'alternative', e.target.value)}
                                                                    className="food-edit-input"
                                                                />
                                                            ) : (
                                                                <span className="alternative-name">{food.alternative}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isEditingPersonal && (
                                                        <button className="btn-remove" onClick={() => handleRemoveFavoriteFood(food.id)}>×</button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACCOUNT SETTINGS SECTION */}
                        {activeSection === 'account' && (
                            <div className="section-content fade-in">
                                <div className="section-header-row">
                                    <h2 className="section-title">Account Settings</h2>
                                </div>

                                <div className="settings-group">
                                    <h3 className="settings-subtitle">Security</h3>
                                    <button className="btn-account-action" onClick={() => alert('Change password feature - Frontend ready. Backend integration pending.')}>
                                        Change Password
                                    </button>
                                </div>

                                <div className="settings-group">
                                    <h3 className="settings-subtitle">Privacy Preferences</h3>
                                    <div className="privacy-item">
                                        <div className="privacy-info">
                                            <span className="privacy-label">Show Email Publicly</span>
                                            <span className="privacy-desc">Allow other users to see your email</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={userData.showEmailPublic}
                                                onChange={(e) => {
                                                    setUserData({ ...userData, showEmailPublic: e.target.checked });
                                                    showSuccessMessage('Privacy settings updated!');
                                                }}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3 className="settings-subtitle">Account Management</h3>
                                    <button className="btn-account-action" onClick={() => alert('Download data feature - Frontend ready. Backend integration pending.')}>
                                        Download My Data
                                    </button>
                                    <button className="btn-account-action danger" onClick={() => {
                                        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                            alert('Delete account feature - Frontend ready. Backend integration pending.');
                                        }
                                    }}>
                                        Delete Account
                                    </button>
                                </div>

                                <div className="info-card member-since">
                                    <label className="info-label">Member Since</label>
                                    <div className="info-value">{userData.memberSince}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
