import React from 'react';
import './Cart.css';

function Cart(props) {
  // STEP 1: Get cart functions from props
  const cart = props.cart;
  const updateQuantity = props.updateQuantity;
  const removeFromCart = props.removeFromCart;
  const clearCart = props.clearCart;
  const handleCheckout = props.handleCheckout;
  
  // STEP 2: Calculate total price of all items in cart
  function calculateTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = total + (cart[i].price * cart[i].quantity);
    }
    return total;
  }

  // STEP 3: Render cart header
  function renderCartHeader() {
    return (
      <div className="cart-header">
        <h3>Your Order</h3>
        <span className="item-count">({cart.length} items)</span>
      </div>
    );
  }

  // STEP 4: Render individual cart item
  function renderCartItem(item) {
    return (
      <div key={item.id} className="cart-item">
        <div className="item-info">
          <h4 className="item-name">{item.name}</h4>
          <p className="item-price">${item.price} each</p>
        </div>
        
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={function() { updateQuantity(item.id, item.quantity - 1); }}
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button 
            className="quantity-btn"
            onClick={function() { updateQuantity(item.id, item.quantity + 1); }}
          >
            +
          </button>
        </div>
        
        <div className="item-total">
          <span>${item.price * item.quantity}</span>
        </div>
        
        <button 
          className="remove-btn"
          onClick={function() { removeFromCart(item.id); }}
        >
          Remove
        </button>
      </div>
    );
  }

  // STEP 5: Render empty cart message
  function renderEmptyCart() {
    return (
      <div className="empty-cart">
        <p>Your cart is empty</p>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  // STEP 6: Render cart footer with total and buttons
  function renderCartFooter() {
    return (
      <div className="cart-footer">
        <div className="total-section">
          <h3 className="total-label">Total: ${calculateTotal()}</h3>
        </div>
        
        <div className="cart-buttons">
          <button 
            className="clear-btn"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      {/* STEP 7: Render cart header */}
      {renderCartHeader()}
      
      {/* STEP 8: Render cart items or empty message */}
      <div className="cart-items">
        {cart.length === 0 ? renderEmptyCart() : cart.map(renderCartItem)}
      </div>
      
      {/* STEP 9: Render cart footer */}
      {cart.length > 0 && renderCartFooter()}
    </div>
  );
}

export default Cart;
