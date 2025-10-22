import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Layout from './components/layout/Layout';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AssistantPage from './pages/AssistantPage';
import ErrorPage from './pages/ErrorPage';

const appConfig = {
  isCymbalBrand: true,
  assistantEnabled: true,
  frontendMessage: 'Free shipping with orders over $50!',
  platformName: 'Google Cloud',
  deploymentDetails: {
    CLUSTERNAME: 'demo-cluster',
    ZONE: 'us-central1',
    HOSTNAME: 'frontend-pod-123'
  }
};

const App = () => {
  return (
    <Router>
      <CurrencyProvider>
        <CartProvider>
          <Layout 
            isCymbalBrand={appConfig.isCymbalBrand}
            assistantEnabled={appConfig.assistantEnabled}
            frontendMessage={appConfig.frontendMessage}
            platformName={appConfig.platformName}
            deploymentDetails={appConfig.deploymentDetails}
            sessionId="session123"
            requestId="req456"
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cart/checkout/confirmation" element={<OrderConfirmationPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </CurrencyProvider>
    </Router>
  );
};

export default App;