import api from './api';

export const cartService = {
  // Get cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add to cart
  addToCart: async (productId, quantity) => {
    try {
      const response = await api.post('/cart', { product_id: productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Empty cart
  emptyCart: async () => {
    try {
      const response = await api.post('/cart/empty');
      return response.data;
    } catch (error) {
      console.error('Error emptying cart:', error);
      throw error;
    }
  },

  // Checkout
  checkout: async (orderDetails) => {
    try {
      const response = await api.post('/cart/checkout', orderDetails);
      return response.data;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
};