import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantDashboard.css';

// STEP 1: Define the allergen options we will use in the form and display
const ALLERGENS = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish'];


function RestaurantDashboard(props) {
  // STEP 1.1: Get the onLogout function from props
  const onLogout = props.onLogout;
  
  // STEP 1.2: Initialize navigation hook
  const navigate = useNavigate();
  // STEP 2: Set up initial dummy menu items in local state
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Grilled Chicken Salad',
      price: 2,
      description: 'Fresh greens with grilled chicken and light dressing.',
      allergens: ['Eggs'],
      available: true,
    },
    {
      id: 2,
      name: 'Pasta Alfredo',
      price: 1205,
      description: 'Creamy alfredo sauce with fettuccine pasta.',
      allergens: ['Dairy', 'Gluten'],
      available: true,
    },
    {
      id: 3,
      name: 'Tofu Stir-Fry',
      price: 1000,
      description: 'Mixed vegetables with tofu in a light soy sauce.',
      allergens: ['Soy'],
      available: false,
    },
  ]);

  // STEP 3: Form state for adding/editing items
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    allergens: [],
  });

  // STEP 4: Track if we are editing an existing item
  const [editingId, setEditingId] = useState(null);

  // STEP 4.1: Simple nav active state for clarity (section nav)
  const [activeNav, setActiveNav] = useState('menu');

  // STEP 4.2: Main top navbar active state like dashboard
  const [activeTopNav, setActiveTopNav] = useState('Restaurants');
  const topNavItems = [
    { id: 'Dashboard', label: 'Dashboard', action: function() { navigate('/dashboard'); } },
    { id: 'Restaurants', label: 'Restaurants' },
    { id: 'Allergies', label: 'Allergies' },
    { id: 'Contact', label: 'Contact' },
    { id: 'About', label: 'About us' },
    { id: 'Profile', label: 'Profile' },
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

  // STEP 7: Reset the form to its default values
  function resetForm() {
    setFormData({ name: '', price: '', description: '', allergens: [] });
    setEditingId(null);
  }

  // STEP 8: Add a new item or update an existing one
  function handleSubmit(e) {
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

    const newItem = {
      id: editingId ? editingId : Date.now(),
      name: formData.name.trim(),
      price: parseFloat(priceNumber.toFixed(2)),
      description: formData.description.trim(),
      allergens: formData.allergens,
      available: true,
    };

    if (editingId) {
      setItems(function(prev) {
        return prev.map(function(it) {
          if (it.id === editingId) {
            return { ...newItem, available: it.available };
          } else {
            return it;
          }
        });
      });
    } else {
      setItems(function(prev) {
        return [...prev, newItem];
      });
    }

    resetForm();
  }

  // STEP 9: Start editing an item by loading its data into the form
  function startEdit(item) {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: String(item.price),
      description: item.description,
      allergens: item.allergens || [],
    });
  }

  // STEP 10: Delete an item using confirm()
  function deleteItem(id) {
    const ok = window.confirm('Are you sure you want to delete this item?');
    if (!ok) return;
    setItems(function(prev) {
      return prev.filter(function(it) {
        return it.id !== id;
      });
    });
    if (editingId === id) {
      resetForm();
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
                    if (item.action) {
                      item.action();
                    } else if (item.id === 'Restaurants') goTo('menu');
                    else if (item.id === 'Allergies') goTo('form');
                    else if (item.id === 'Contact') goTo('analytics');
                    else if (item.id === 'About') goTo('analytics');
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
        {/* MENU LIST SECTION */}
        <section id="rd-menu" className="rd-section">
          <h2 className="rd-section-title">Menu Items</h2>

          <div className="rd-list">
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

                  <p className="rd-desc">{item.description}</p>

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
                    <button className="rd-btn" onClick={function() { toggleAvailability(item.id); }}>
                      Toggle Availability
                    </button>
                    <button className="rd-btn rd-btn-secondary" onClick={function() { startEdit(item); }}>
                      Edit
                    </button>
                    <button className="rd-btn rd-btn-danger" onClick={function() { deleteItem(item.id); }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ADD/EDIT FORM SECTION */}
        <section id="rd-form" className="rd-section">
          <h2 className="rd-section-title">{editingId ? 'Edit Item' : 'Add New Item'}</h2>

          <form className="rd-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="rd-form-row">
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
            <div className="rd-form-row">
              <label className="rd-label" htmlFor="price">Price</label>
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

            {/* Description */}
            <div className="rd-form-row">
              <label className="rd-label" htmlFor="description">Description</label>
              <textarea
                className="rd-textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description of the dish"
              />
            </div>

            {/* Allergens */}
            <div className="rd-form-row">
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

            {/* Form buttons */}
            <div className="rd-form-actions">
              <button type="submit" className="rd-btn">
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
              {editingId && (
                <button type="button" className="rd-btn rd-btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ANALYTICS SECTION */}
        <section id="rd-analytics" className="rd-section rd-analytics">
          <h2 className="rd-section-title">Analytics</h2>
          <div className="rd-analytics-grid">
            <div className="rd-analytics-card">
              <div className="rd-analytics-number">{totalItems}</div>
              <div className="rd-analytics-label">Total Items</div>
            </div>
            <div className="rd-analytics-card">
              <div className="rd-analytics-number">{availableItems}</div>
              <div className="rd-analytics-label">Available Items</div>
            </div>
            <div className="rd-analytics-card">
              <div className="rd-analytics-number">{itemsWithAnyAllergens}</div>
              <div className="rd-analytics-label">Items With Allergens</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RestaurantDashboard;


