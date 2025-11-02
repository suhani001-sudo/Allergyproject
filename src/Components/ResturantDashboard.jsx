import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantDashboard.css';
import Footer from './Footer';

// STEP 1: Define the allergen options we will use in the form and display
const ALLERGENS = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish'];


function RestaurantDashboard(props) {
  // STEP 1.1: Get the onLogout function from props
  const onLogout = props.onLogout;
  
  // STEP 1.2: Initialize navigation hook
  const navigate = useNavigate();
  
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
    category: 'Main Course'
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

  // STEP 7: Reset the form to its default values
  function resetForm() {
    setFormData({ name: '', price: '', description: '', allergens: [], ingredients: [], category: 'Main Course' });
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

    const menuItemData = {
      itemName: formData.name.trim(),
      price: parseFloat(priceNumber.toFixed(2)),
      description: formData.description.trim(),
      allergenInfo: formData.allergens,
      category: formData.category.toLowerCase(),
      restaurantName: 'SafeBytes Restaurant', // You can make this dynamic
      imageUrl: 'https://via.placeholder.com/300x200?text=Menu+Item'
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
        } else {
          alert('Failed to update menu item.');
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
      alert('An error occurred while saving the menu item.');
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
      category: item.category || 'Main Course'
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
      {/* MAIN NAVBAR (matches dashboard style) */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/images/green_logo.jpg" alt="SafeBytes Logo" className="logo-image" />
            <span className="logo-text">SafeBytes</span>
          </div>

          <div className="nav-links">
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

          <button className="logout-button" onClick={function() { onLogout(); }}>
            <span className="logout-text">Logout</span>
          </button>
        </div>
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


