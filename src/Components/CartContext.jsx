import React, { createContext, useContext, useState } from 'react';

// STEP 1: Create the cart context for sharing cart data between components
const CartContext = createContext();

// STEP 2: Create a custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// STEP 3: Create the cart provider component that wraps the app
export function CartProvider(props) {
  // STEP 4: Set up state for cart items and cart visibility
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // STEP 5: Function to add an item to the cart
  function addToCart(item) {
    // Check if item already exists in cart
    let itemExists = false;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id) {
        itemExists = true;
        break;
      }
    }
    
    if (itemExists) {
      // If item exists, increase its quantity by 1
      const newCart = cart.map(function(cartItem) {
        if (cartItem.id === item.id) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1
          };
        } else {
          return cartItem;
        }
      });
      setCart(newCart);
    } else {
      // If item doesn't exist, add it with quantity 1
      const newItem = {
        ...item,
        quantity: 1
      };
      setCart([...cart, newItem]);
    }
  }

  // STEP 6: Function to update quantity of an item in cart
  function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item from cart
      const newCart = cart.filter(function(item) {
        return item.id !== itemId;
      });
      setCart(newCart);
    } else {
      // Update the quantity of the item
      const newCart = cart.map(function(item) {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity
          };
        } else {
          return item;
        }
      });
      setCart(newCart);
    }
  }

  // STEP 7: Function to remove an item from cart completely
  function removeFromCart(itemId) {
    const newCart = cart.filter(function(item) {
      return item.id !== itemId;
    });
    setCart(newCart);
  }

  // STEP 8: Function to clear all items from cart
  function clearCart() {
    setCart([]);
  }

  // STEP 9: Function to calculate total price of all items in cart
  function getTotalPrice() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = total + (cart[i].price * cart[i].quantity);
    }
    return total;
  }

  // STEP 10: Function to get total number of items in cart
  function getTotalItems() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = total + cart[i].quantity;
    }
    return total;
  }

  // STEP 11: Function to toggle cart visibility
  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  // STEP 12: Function to handle checkout process
  function handleCheckout() {
    alert('Order placed successfully!');
    clearCart();
    setIsCartOpen(false);
  }

  // STEP 13: Create the value object to pass to context
  const value = {
    cart: cart,
    isCartOpen: isCartOpen,
    addToCart: addToCart,
    updateQuantity: updateQuantity,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getTotalPrice: getTotalPrice,
    getTotalItems: getTotalItems,
    toggleCart: toggleCart,
    handleCheckout: handleCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {props.children}
    </CartContext.Provider>
  );
}
