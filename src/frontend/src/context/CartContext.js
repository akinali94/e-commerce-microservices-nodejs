import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      await cartService.addToCart(productId, quantity);
      await loadCart(); // Reload cart after adding
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const emptyCart = async () => {
    try {
      await cartService.emptyCart();
      setCart([]);
    } catch (error) {
      console.error('Failed to empty cart:', error);
    }
  };

  const getCartSize = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      emptyCart, 
      loadCart,
      getCartSize 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);