import React, { createContext, useState, useEffect, useContext } from 'react';
import { currencyService } from '../services/currencyService';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState(['USD']);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load available currencies
    const loadCurrencies = async () => {
      try {
        setLoading(true);
        const data = await currencyService.getCurrencies();
        setCurrencies(data);
        
        // Get stored currency or use default
        const storedCurrency = localStorage.getItem('currency') || 'USD';
        setCurrentCurrency(storedCurrency);
      } catch (error) {
        console.error('Failed to load currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  const changeCurrency = async (currencyCode) => {
    try {
      setLoading(true);
      await currencyService.setCurrency(currencyCode);
      setCurrentCurrency(currencyCode);
      localStorage.setItem('currency', currencyCode);
    } catch (error) {
      console.error('Failed to change currency:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currencies, 
      currentCurrency, 
      changeCurrency,
      loading 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);