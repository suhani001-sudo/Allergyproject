import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantDashboard.css';
import '../styles/responsive.css';
import Footer from './Footer';
import { handleLogout as logout } from '../utils/authUtils';
import LogoutConfirmModal from './LogoutConfirmModal';

// STEP 1: Define the allergen options we will use in the form and display
const ALLERGENS = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish'];


function RestaurantDashboard(props) {
  // STEP 1.2: Initialize navigation hook
  const navigate = useNavigate();
  
  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Centralized logout handler
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  
  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout(navigate);
  };
  
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  
  // STEP 2: Set up menu items state (will be fetched from database)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // STEP 2.1: Fetch menu items from database and remove duplicates
  useEffect(function() {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/menus');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Transform backend data to match component structure
          const transformedItems = data.data.map(function(item) {
            return {
              id: item._id,
              name: item.itemName,
              price: item.price,
              description: item.description,
              allergens: item.allergenInfo || [],
              ingredients: item.ingredients || [],
              category: item.category,
              restaurantName: item.restaurantName,
              available: true,
              imageUrl: item.imageUrl,
              isVegetarian: item.isVegetarian,
              isVegan: item.isVegan,
              isGlutenFree: item.isGlutenFree
            };
          });
          
          // Remove duplicates using _id, or name+price as fallback
          const uniqueItems = [];
          const seenIds = new Set();
          const seenNamePrice = new Set();
          
          transformedItems.forEach(function(item) {
            const namePrice = `${item.name.toLowerCase()}-${item.price}`;
            
            if (item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueItems.push(item);
            } else if (!item.id && !seenNamePrice.has(namePrice)) {
              seenNamePrice.add(namePrice);
              uniqueItems.push(item);
            }
          });
          
          setItems(uniqueItems);
        }
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMenuItems();
  }, []);

  // STEP 3: Form state for adding/editing items
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    allergens: [],
    ingredients: [],
    category: 'Main Course',
    customAllergen: '',
    imageFile: null,
    imagePreview: null
  });

  // STEP 4: Track if we are editing an existing item
  const [editingId, setEditingId] = useState(null);

  // STEP 4.1: Simple nav active state for clarity (section nav)
  const [activeNav, setActiveNav] = useState('menu');

  // STEP 4.2: Main top navbar active state like dashboard
  const [activeTopNav, setActiveTopNav] = useState('Dashboard');
  const topNavItems = [
    { id: 'Dashboard', label: 'Dashboard', path: '/restaurant-dashboard' },
    { id: 'Contact', label: 'Contact', path: '/restaurant-contact' },
    { id: 'About', label: 'About us', path: '/restaurant-about' },
    { id: 'Profile', label: 'Profile', path: '/restaurant-profile' },
  ];

  // STEP 4.3: Helper to scroll to a section smoothly and mark nav active
  function goTo(sectionId) {
    setActiveNav(sectionId);
    const el = document.getElementById(`rd-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // STEP 5: Handle text/number inputs for the form
  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(function(prev) {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  // STEP 6: Handle allergen checkbox changes
  function handleAllergenChange(e) {
    const value = e.target.value;
    const checked = e.target.checked;
    setFormData(function(prev) {
      if (checked) {
        return { ...prev, allergens: [...prev.allergens, value] };
      }
      return { ...prev, allergens: prev.allergens.filter(function(a) { return a !== value; }) };
    });
  }

  // STEP 6.1: Handle ingredients input changes
  function handleIngredientsChange(e) {
    const value = e.target.value;
    const ingredients = value.split(',').map(ingredient => ingredient.trim()).filter(ingredient => ingredient);
    setFormData(function(prev) {
      return { ...prev, ingredients: ingredients };
    });
  }

  // STEP 6.2: Handle custom allergen input
  function handleAddCustomAllergen() {
    const customValue = formData.customAllergen.trim();
    if (customValue && !formData.allergens.includes(customValue)) {
      setFormData(function(prev) {
        return { 
          ...prev, 
          allergens: [...prev.allergens, customValue],
          customAllergen: ''
        };
      });
    }
  }

  // STEP 6.3: Handle image file selection with compression
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        alert('Image size should be less than 15MB');
        return;
      }

      // Compress and create preview URL
      const reader = new FileReader();
      reader.onloadend = function() {
        const img = new Image();
        img.onload = function() {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 1200px width/height)
          let width = img.width;
          let height = img.height;
          const maxSize = 1200;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with quality compression (0.8 = 80% quality)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          setFormData(function(prev) {
            return {
              ...prev,
              imageFile: file,
              imagePreview: compressedDataUrl
            };
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // STEP 6.4: Remove uploaded image
  function handleRemoveImage() {
    setFormData(function(prev) {
      return {
        ...prev,
        imageFile: null,
        imagePreview: null
      };
    });
  }

  // STEP 6.5: Remove custom allergen
  function handleRemoveAllergen(allergen) {
    setFormData(function(prev) {
      return {
        ...prev,
        allergens: prev.allergens.filter(function(a) { return a !== allergen; })
      };
    });
  }

  // STEP 7: Reset the form to its default values
  function resetForm() {
    setFormData({ 
      name: '', 
      price: '', 
      description: '', 
      allergens: [], 
      ingredients: [], 
      category: 'Main Course',
      customAllergen: '',
      imageFile: null,
      imagePreview: null
    });
    setEditingId(null);
  }

  // STEP 8: Add a new item or update an existing one
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a name.');
      return;
    }
    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      alert('Please enter a valid price.');
      return;
    }

    // Convert image to base64 if uploaded
    let imageUrl = 'https://via.placeholder.com/300x200?text=Menu+Item';
    if (formData.imagePreview) {
      imageUrl = formData.imagePreview;
    }

    const menuItemData = {
      itemName: formData.name.trim(),
      price: parseFloat(priceNumber.toFixed(2)),
      description: formData.description.trim(),
      allergenInfo: formData.allergens,
      ingredients: formData.ingredients,
      category: formData.category.toLowerCase(),
      restaurantName: 'SafeBytes Restaurant', // You can make this dynamic
      imageUrl: imageUrl
    };

    try {
      if (editingId) {
        // Update existing item
        const response = await fetch(`http://localhost:5000/api/menus/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menuItemData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Refresh menu items
          const fetchResponse = await fetch('http://localhost:5000/api/menus');
          const fetchData = await fetchResponse.json();
          
          if (fetchData.success && fetchData.data) {
            const transformedItems = fetchData.data.map(function(item) {
              return {
                id: item._id,
                name: item.itemName,
                price: item.price,
                description: item.description,
                allergens: item.allergenInfo || [],
                ingredients: item.ingredients || [],
                category: item.category,
                restaurantName: item.restaurantName,
                available: true,
                imageUrl: item.imageUrl
              };
            });
            setItems(transformedItems);
          }
          alert('Menu item updated successfully!');
          resetForm();
        } else {
          alert('Failed to update menu item: ' + (data.message || 'Unknown error'));
        }
      } else {
        // Add new item
        const response = await fetch('http://localhost:5000/api/menus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menuItemData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Refresh menu items
          const fetchResponse = await fetch('http://localhost:5000/api/menus');
          const fetchData = await fetchResponse.json();
          
          if (fetchData.success && fetchData.data) {
            const transformedItems = fetchData.data.map(function(item) {
              return {
                id: item._id,
                name: item.itemName,
                price: item.price,
                description: item.description,
                allergens: item.allergenInfo || [],
                ingredients: item.ingredients || [],
                category: item.category,
                restaurantName: item.restaurantName,
                available: true,
                imageUrl: item.imageUrl
              };
            });
            setItems(transformedItems);
          }
          alert('Menu item added successfully!');
        } else {
          alert('Failed to add menu item.');
        }
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('An error occurred while saving the menu item. Please check: \n1. Image size (max 5MB)\n2. All required fields are filled\n3. Backend server is running');
    }
  }

  // STEP 9: Start editing an item by loading its data into the form
  function startEdit(item) {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: String(item.price),
      description: item.description,
      allergens: item.allergens || [],
      ingredients: item.ingredients || [],
      category: item.category || 'Main Course',
      customAllergen: '',
      imageFile: null,
      imagePreview: item.imageUrl || null
    });
  }

  // STEP 10: Delete an item using confirm()
  async function deleteItem(id) {
    const ok = window.confirm('Are you sure you want to delete this item?');
    if (!ok) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/menus/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh menu items
        const fetchResponse = await fetch('http://localhost:5000/api/menus');
        const fetchData = await fetchResponse.json();
        
        if (fetchData.success && fetchData.data) {
          const transformedItems = fetchData.data.map(function(item) {
            return {
              id: item._id,
              name: item.itemName,
              price: item.price,
              description: item.description,
              allergens: item.allergenInfo || [],
              ingredients: item.ingredients || [],
              category: item.category,
              restaurantName: item.restaurantName,
              available: true,
              imageUrl: item.imageUrl
            };
          });
          setItems(transformedItems);
        }
        alert('Menu item deleted successfully!');
      } else {
        alert('Failed to delete menu item.');
      }
      
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('An error occurred while deleting the menu item.');
    }
  }

  // STEP 11: Toggle availability (simple boolean flip)
  function toggleAvailability(id) {
    setItems(function(prev) {
      return prev.map(function(it) {
        if (it.id === id) {
          return { ...it, available: !it.available };
        } else {
          return it;
        }
      });
    });
  }

  // STEP 12: Compute simple analytics
  const totalItems = items.length;
  const availableItems = items.filter(function(it) { return it.available; }).length;
  const itemsWithAnyAllergens = items.filter(function(it) { return (it.allergens || []).length > 0; }).length;

  // STEP 13: Render the component with simple sections
  return (
    <div className="rd-container">
      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* MAIN NAVBAR (matches dashboard style) */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/images/green_logo.jpg" alt="SafeBytes Logo" className="logo-image" />
            <span className="logo-text">SafeBytes</span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {topNavItems.map(function(item) {
              return (
                <button
                  key={item.id}
                  className={`nav-link ${activeTopNav === item.id ? 'active' : ''}`}
                  onClick={function() {
                    setActiveTopNav(item.id);
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  <span className="nav-label">{item.label}</span>
                  {activeTopNav === item.id && <div className="active-indicator" />}
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
          {topNavItems.map(function(item) {
            return (
              <a 
                key={item.id}
                href={item.path || '#'}
                className={`mobile-nav-item ${activeTopNav === item.id ? 'active' : ''}`}
                onClick={function(e) {
                  e.preventDefault();
                  setActiveTopNav(item.id);
                  setMobileMenuOpen(false);
                  if (item.path) {
                    navigate(item.path);
                  }
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

      {/* MAIN CONTENT */}
      <main className="rd-main">
        {/* ADD/EDIT FORM SECTION - MOVED TO TOP */}
        <section id="rd-form" className="rd-section rd-form-section">
          <h2 className="rd-section-title">{editingId ? 'Edit Item' : 'Add New Item'}</h2>

          <form className="rd-form" onSubmit={handleSubmit}>
            <div className="rd-form-grid">
              {/* Name */}
              <div className="rd-form-group">
                <label className="rd-label" htmlFor="name">Name</label>
                <input
                  className="rd-input"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                />
              </div>

              {/* Price */}
              <div className="rd-form-group">
                <label className="rd-label" htmlFor="price">Price (₹)</label>
                <input
                  className="rd-input"
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div className="rd-form-group">
                <label className="rd-label" htmlFor="category">Category</label>
                <select
                  className="rd-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Salad">Salad</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                </select>
              </div>

              {/* Description - Full Width */}
              <div className="rd-form-group rd-form-group-full">
                <label className="rd-label" htmlFor="description">Description</label>
                <textarea
                  className="rd-textarea"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description of the dish"
                  rows="3"
                />
              </div>

              {/* Ingredients - Full Width */}
              <div className="rd-form-group rd-form-group-full">
                <label className="rd-label" htmlFor="ingredients">Ingredients</label>
                <input
                  className="rd-input"
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients.join(', ')}
                  onChange={handleIngredientsChange}
                  placeholder="Enter ingredients separated by commas (e.g., Chicken, Rice, Vegetables)"
                />
              </div>

              {/* Allergens - Full Width */}
              <div className="rd-form-group rd-form-group-full">
                <span className="rd-label">Allergens</span>
                <div className="rd-checkboxes">
                  {ALLERGENS.map(function(al) {
                    return (
                      <label key={al} className="rd-check">
                        <input
                          type="checkbox"
                          value={al}
                          checked={formData.allergens.includes(al)}
                          onChange={handleAllergenChange}
                        />
                        <span>{al}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Custom Allergen Input - Full Width */}
              <div className="rd-form-group rd-form-group-full">
                <label className="rd-label" htmlFor="customAllergen">Add Custom Allergen</label>
                <div className="rd-custom-allergen-input">
                  <input
                    className="rd-input"
                    id="customAllergen"
                    name="customAllergen"
                    value={formData.customAllergen}
                    onChange={handleInputChange}
                    placeholder="Enter custom allergen name (e.g., Sesame, Mustard)"
                    onKeyPress={function(e) {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAllergen();
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="rd-btn rd-btn-add-allergen"
                    onClick={handleAddCustomAllergen}
                  >
                    + Add
                  </button>
                </div>
                {formData.allergens.length > 0 && (
                  <div className="rd-selected-allergens">
                    <span className="rd-selected-label">Selected Allergens:</span>
                    <div className="rd-allergen-tags">
                      {formData.allergens.map(function(allergen) {
                        return (
                          <span key={allergen} className="rd-allergen-tag">
                            {allergen}
                            <button 
                              type="button"
                              className="rd-allergen-remove"
                              onClick={function() { handleRemoveAllergen(allergen); }}
                              title="Remove allergen"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload - Full Width */}
              <div className="rd-form-group rd-form-group-full">
                <label className="rd-label" htmlFor="imageUpload">Food Image</label>
                <div className="rd-image-upload-container">
                  {!formData.imagePreview ? (
                    <div className="rd-image-upload-area">
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="rd-image-input"
                      />
                      <label htmlFor="imageUpload" className="rd-image-upload-label">
                        <div className="rd-upload-icon">📷</div>
                        <div className="rd-upload-text">
                          <span className="rd-upload-title">Click to upload food image</span>
                          <span className="rd-upload-subtitle">PNG, JPG, JPEG up to 15MB (auto-compressed)</span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="rd-image-preview-container">
                      <img 
                        src={formData.imagePreview} 
                        alt="Food preview" 
                        className="rd-image-preview"
                      />
                      <button 
                        type="button"
                        className="rd-image-remove"
                        onClick={handleRemoveImage}
                        title="Remove image"
                      >
                        ✕ Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form buttons */}
            <div className="rd-form-actions">
              <button type="submit" className="rd-btn rd-btn-primary">
                {editingId ? '✓ Update Item' : '+ Add Item'}
              </button>
              {editingId && (
                <button type="button" className="rd-btn rd-btn-secondary" onClick={resetForm}>
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* MENU LIST SECTION */}
        <section id="rd-menu" className="rd-section">
          <h2 className="rd-section-title">Menu Items ({items.length})</h2>

          {loading && <div className="rd-loading">Loading menu items...</div>}
          {error && <div className="rd-error">{error}</div>}

          <div className="rd-menu-grid">
            {items.map(function(item) {
              return (
                <div key={item.id} className="rd-card">
                  {/* Food Image */}
                  {item.imageUrl && (
                    <div className="rd-card-image-container">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="rd-card-image"
                        onError={function(e) {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    </div>
                  )}

                  <div className="rd-card-content">
                    <div className="rd-card-top">
                      <div className="rd-card-title">
                        <strong>{item.name}</strong>
                        <span className="rd-price" >₹{item.price.toFixed(2)}</span>
                      </div>
                      <div className={`rd-badge ${item.available ? 'rd-badge-on' : 'rd-badge-off'}`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    <div className="rd-card-category">
                      <span className="rd-category-badge">{item.category || 'Main Course'}</span>
                      {item.restaurantName && (
                        <span className="rd-restaurant-badge">🏪 {item.restaurantName}</span>
                      )}
                    </div>

                    <p className="rd-desc">{item.description}</p>

                  {/* Ingredients Section */}
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="rd-ingredients">
                      <h4 className="rd-ingredients-title">Ingredients:</h4>
                      <div className="rd-ingredients-list">
                        {item.ingredients.slice(0, 4).map(function(ingredient, idx) {
                          return (
                            <span key={idx} className="rd-ingredient-tag">
                              {ingredient}
                            </span>
                          );
                        })}
                        {item.ingredients.length > 4 && (
                          <span className="rd-ingredient-tag rd-ingredient-more">
                            +{item.ingredients.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rd-allergens">
                    {(item.allergens || []).length === 0 ? (
                      <span className="rd-allergen-badge rd-allergen-none">No Allergens</span>
                    ) : (
                      item.allergens.map(function(a) {
                        return (
                          <span key={a} className="rd-allergen-badge">{a}</span>
                        );
                      })
                    )}
                  </div>

                    <div className="rd-card-actions">
                      <button className="rd-btn rd-btn-toggle" onClick={function() { toggleAvailability(item.id); }}>
                        {item.available ? '✓ Available' : '✕ Unavailable'}
                      </button>
                      <button className="rd-btn rd-btn-secondary" onClick={function() { 
                        startEdit(item);
                        document.getElementById('rd-form').scrollIntoView({ behavior: 'smooth' });
                      }}>
                        ✎ Edit
                      </button>
                      <button className="rd-btn rd-btn-danger" onClick={function() { deleteItem(item.id); }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ANALYTICS SECTION */}
        <section id="rd-analytics" className="rd-section rd-analytics">
          <h2 className="rd-section-title">📊 Quick Stats</h2>
          <div className="rd-analytics-grid">
            <div className="rd-analytics-card">
              <div className="rd-analytics-icon">📋</div>
              <div className="rd-analytics-value">{totalItems}</div>
              <div className="rd-analytics-label">Total Items</div>
            </div>
            <div className="rd-analytics-card">
              <div className="rd-analytics-icon">✓</div>
              <div className="rd-analytics-value">{availableItems}</div>
              <div className="rd-analytics-label">Available</div>
            </div>
            <div className="rd-analytics-card">
              <div className="rd-analytics-icon">⚠️</div>
              <div className="rd-analytics-value">{itemsWithAnyAllergens}</div>
              <div className="rd-analytics-label">With Allergens</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RestaurantDashboard;


