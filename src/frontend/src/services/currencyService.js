import api from './api';

export const currencyService = {
  // Get supported currencies
  getCurrencies: async () => {
    try {
      const response = await api.get('/currencies');
      return response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  },

  // Set currency
  setCurrency: async (currencyCode) => {
    try {
      const response = await api.post('/setCurrency', { currency_code: currencyCode });
      return response.data;
    } catch (error) {
      console.error('Error setting currency:', error);
      throw error;
    }
  }
};