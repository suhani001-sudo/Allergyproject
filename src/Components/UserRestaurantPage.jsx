import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRestaurantPage.css';

function UserRestaurantPage(props) {
  // STEP 1: Get the onLogout function from props
  const onLogout = props.onLogout;
  
  // STEP 2: Initialize navigation and cart hooks
  const navigate = useNavigate();
  
  
  // STEP 3: Define state variables for managing data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAllergen, setSelectedAllergen] = useState('All');

  // STEP 4: Fetch menu items from backend database
  useEffect(function() {
    async function fetchItems() {
      try {
        setLoading(true);
        
        // Fetch menu items from your backend API
        const response = await fetch('http://localhost:5000/api/menus');
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // Transform backend data to match component structure
          const transformedItems = data.data.map(function(item) {
            return {
              id: item._id,
              name: item.itemName,
              description: item.description,
              price: item.price,
              category: item.category,
              restaurantName: item.restaurantName,
              imageUrl: item.imageUrl,
              allergenInfo: item.allergenInfo || [],
              isVegetarian: item.isVegetarian,
              isVegan: item.isVegan,
              isGlutenFree: item.isGlutenFree
            };
          });
          
          setItems(transformedItems);
          setError(null);
        } else {
          // No fallback items - show empty state
          setItems([]);
          setError('No menu items available. Please check back later.');
        }
        
      } catch (err) {
        setError('Failed to load menu items from database. Please try again later.');
        console.error('Error fetching items:', err);
        setItems([]); // No fallback items
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  // STEP 5: Filter items based on search term and category
  const filteredItems = items.filter(function(item) {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchLower)) ||
                         (item.description && item.description.toLowerCase().includes(searchLower)) ||
                         (item.restaurantName && item.restaurantName.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(items.map(item => item.category || 'other').filter(Boolean))];

  return (
    <div className="restaurant-page">
      {/* STEP 6: Render header with original nav bar style */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img 
              src="/images/green_logo.jpg" 
              alt="SafeBytes Logo" 
              className="logo-image"
            />
            <span className="logo-text">SafeBytes</span>
          </div>

          <div className="nav-links">
            <button
              className="nav-link"
              onClick={function() { navigate('/dashboard'); }}
            >
              <span className="nav-label">Dashboard</span>
            </button>
            <button
              className="nav-link active"
              onClick={function() { navigate('/restaurants'); }}
            >
              <span className="nav-label">Restaurants</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/allergy-info'); }}>
              <span className="nav-label">Allergies</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/contact'); }}>
              <span className="nav-label">Contact</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/about-us'); }}>
              <span className="nav-label">About us</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/profile'); }}>
              <span className="nav-label">Profile</span>
            </button>
          </div>

          <button className="logout-button" onClick={onLogout}>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </nav>

      {/* STEP 7: Render search and filter section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-filters">
            
            <input
              type="text"
              placeholder="Search menu items by name, description..."
              value={searchTerm}
              onChange={function(e) { setSearchTerm(e.target.value); }}
              className="search-input"
            />
            
            <div className="filter-dropdowns">
              <select
                value={selectedCategory}
                onChange={function(e) { setSelectedCategory(e.target.value); }}
                className="filter-select"
              >
                {categories.map(function(category) {
                  return (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <div className="filter-results">
            <span className="results-count">
              {filteredItems.length} items found
            </span>
            {(selectedCategory !== 'All' || searchTerm) && (
              <button
                className="clear-filters-btn"
                onClick={function() {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* STEP 8: Render main content area */}
      <main className="main-content">
        <div className="menu-section">
          <h2 className="menu-title">Our Menu</h2>
          
          {/* STEP 9: Show loading state */}
          {loading && <div className="loading">Loading menu items...</div>}
          
          {/* STEP 10: Show error state */}
          {error && <div className="error">{error}</div>}
          
          {/* STEP 11: Render menu items grid */}
          {!loading && !error && (
            <div className="menu-grid">
              {filteredItems.map(function(item) {
                return (
                  <div key={item.id} className="menu-card">
                    {/* Menu Item Image */}
                    <div className="menu-card-image">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'} 
                        alt={item.name}
                        onError={function(e) {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                        }}
                      />
                      {/* Diet badges */}
                      <div className="diet-badges">
                        {item.isVegan && <span className="badge badge-vegan">🌱 Vegan</span>}
                        {item.isVegetarian && !item.isVegan && <span className="badge badge-vegetarian">🥬 Vegetarian</span>}
                        {item.isGlutenFree && <span className="badge badge-gluten-free">🌾 Gluten Free</span>}
                      </div>
                    </div>
                    
                    <div className="card-content-full">
                      {/* Dish Name and Category - Always Present */}
                      <div className="item-header">
                        <h3 className="item-name">
                          {item.name || `Delicious ${(item.category || 'Dish').charAt(0).toUpperCase() + (item.category || 'Dish').slice(1)}`}
                        </h3>
                        <div className="item-category">{item.category || 'other'}</div>
                      </div>
                      
                      {/* Restaurant Name - Always Present */}
                      <div className="restaurant-name-badge">
                        🏪 {item.restaurantName || 'SafeBytes Restaurant'}
                      </div>
                      
                      {/* Description - Always Present */}
                      <p className="item-description">
                        {item.description || 'A delicious dish prepared with fresh ingredients. Ask our staff for more details about this item.'}
                      </p>
                      
                      {/* Allergen Information - Always Present */}
                      <div className="allergen-info">
                        <strong>⚠️ Contains:</strong>
                        <div className="allergen-tags">
                          {item.allergenInfo && item.allergenInfo.length > 0 ? (
                            item.allergenInfo.map(function(allergen, index) {
                              return (
                                <span key={index} className="allergen-tag">
                                  {allergen}
                                </span>
                              );
                            })
                          ) : (
                            <span className="allergen-tag allergen-tag-safe">
                              No known allergens
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Price - Always Present */}
                      <div className="item-footer">
                        <span className="item-price">
                          ₹{typeof item.price === 'number' ? item.price.toFixed(2) : (item.price || '0.00')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        
      </main>
    </div>
  );
}

export default UserRestaurantPage;
