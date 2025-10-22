import api from './api';

export const assistantService = {
  // Send message to the assistant
  sendMessage: async (message, image = null) => {
    try {
      const response = await api.post('/bot', {
        message,
        image
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      throw error;
    }
  },
  
  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/product-meta/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  // Extract product IDs from response
  extractIdsFromString: (message) => {
    const idPattern = /\[([a-zA-Z0-9-]+)\]/g;
    const matches = [...message.matchAll(idPattern)];
    const ids = matches.map(match => match[1]);
    return ids;
  }
};