import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './UserRestaurantPage.css';
import Cart from './Cart';

function UserRestaurantPage(props) {
  // STEP 1: Get the onLogout function from props
  const onLogout = props.onLogout;
  
  // STEP 2: Initialize navigation and cart hooks
  const navigate = useNavigate();
  const cartContext = useCart();
  const cart = cartContext.cart;
  const addToCart = cartContext.addToCart;
  const updateQuantity = cartContext.updateQuantity;
  const removeFromCart = cartContext.removeFromCart;
  const clearCart = cartContext.clearCart;
  const handleCheckout = cartContext.handleCheckout;
  const getTotalItems = cartContext.getTotalItems;
  const toggleCart = cartContext.toggleCart;
  
  // STEP 3: Define state variables for managing data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // STEP 4: Fetch menu items from API when component loads
  useEffect(function() {
    async function fetchItems() {
      try {
        setLoading(true);
        // Using fake API to get food-like items
        const response = await fetch('https://fakestoreapi.com/products?limit=12');
        const data = await response.json();
        
        // Transform API data to look like food items
        const foodItems = data.map(function(item) {
          return {
            id: item.id,
            name: item.title,
            description: item.description,
            price: Math.round(item.price * 10), // Convert to food prices
            image: item.image
          };
        });
        
        setItems(foodItems);
        setError(null);
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  // STEP 5: Filter items based on search term
  const filteredItems = items.filter(function(item) {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              <div className="active-indicator" />
            </button>
            <button className="nav-link">
              <span className="nav-label">Allergies</span>
            </button>
            <button className="nav-link">
              <span className="nav-label">Contact</span>
            </button>
            <button className="nav-link">
              <span className="nav-label">About us</span>
            </button>
            <button className="nav-link">
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </button>
          </div>

          <div className="nav-actions">
            <button className="cart-button" onClick={toggleCart}>
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Cart</span>
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
            <button className="logout-button" onClick={onLogout}>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* STEP 7: Render search bar */}
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={function(e) { setSearchTerm(e.target.value); }}
            className="search-input"
          />
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
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="card-content">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-footer">
                        <span className="item-price">${item.price}</span>
                        <button 
                          className="order-button"
                          onClick={function() { addToCart(item); }}
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* STEP 12: Render cart component */}
        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          handleCheckout={handleCheckout}
        />
      </main>
    </div>
  );
}

export default UserRestaurantPage;
