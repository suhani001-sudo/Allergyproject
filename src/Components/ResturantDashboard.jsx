import React, { useState } from 'react';
import './RestaurantDashboard.css';

// STEP 1: Define the allergen options we will use in the form and display
const ALLERGENS = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish'];


function RestaurantDashboard({ onLogout}) {
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
    { id: 'Restaurants', label: 'Restaurants' },
    { id: 'Allergies', label: 'Allergies' },
    { id: 'Contact', label: 'Contact' },
    { id: 'About', label: 'About us' },
    { id: 'Profile', label: 'Profile' },
  ];

  // STEP 4.3: Helper to scroll to a section smoothly and mark nav active
  const goTo = (sectionId) => {
    setActiveNav(sectionId);
    const el = document.getElementById(`rd-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // STEP 5: Handle text/number inputs for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // STEP 6: Handle allergen checkbox changes
  const handleAllergenChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, allergens: [...prev.allergens, value] };
      }
      return { ...prev, allergens: prev.allergens.filter((a) => a !== value) };
    });
  };

  // STEP 7: Reset the form to its default values
  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', allergens: [] });
    setEditingId(null);
  };

  // STEP 8: Add a new item or update an existing one
  const handleSubmit = (e) => {
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
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...newItem, available: it.available } : it))
      );
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    resetForm();
  };

  // STEP 9: Start editing an item by loading its data into the form
  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: String(item.price),
      description: item.description,
      allergens: item.allergens || [],
    });
  };

  // STEP 10: Delete an item using confirm()
  const deleteItem = (id) => {
    const ok = window.confirm('Are you sure you want to delete this item?');
    if (!ok) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  // STEP 11: Toggle availability (simple boolean flip)
  const toggleAvailability = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, available: !it.available } : it)));
  };

  // STEP 12: Compute simple analytics
  const totalItems = items.length;
  const availableItems = items.filter((it) => it.available).length;
  const itemsWithAnyAllergens = items.filter((it) => (it.allergens || []).length > 0).length;

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
            {topNavItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeTopNav === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTopNav(item.id);
                  if (item.id === 'Restaurants') goTo('menu');
                  if (item.id === 'Allergies') goTo('form');
                  if (item.id === 'Contact') goTo('analytics');
                  if (item.id === 'About') goTo('analytics');
                }}
              >
                <span className="nav-label">{item.label}</span>
                {activeTopNav === item.id && <div className="active-indicator" />}
              </button>
            ))}
          </div>

          <button className="logout-button" onClick={() => onLogout()}>
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
            {items.map((item) => (
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
                    item.allergens.map((a) => (
                      <span key={a} className="rd-allergen-badge">{a}</span>
                    ))
                  )}
                </div>

                <div className="rd-card-actions">
                  <button className="rd-btn" onClick={() => toggleAvailability(item.id)}>
                    Toggle Availability
                  </button>
                  <button className="rd-btn rd-btn-secondary" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button className="rd-btn rd-btn-danger" onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
                {ALLERGENS.map((al) => (
                  <label key={al} className="rd-check">
                    <input
                      type="checkbox"
                      value={al}
                      checked={formData.allergens.includes(al)}
                      onChange={handleAllergenChange}
                    />
                    <span>{al}</span>
                  </label>
                ))}
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


