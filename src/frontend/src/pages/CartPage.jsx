import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import EmptyCart from '../components/cart/EmptyCart';
import CheckoutForm from '../components/cart/CheckoutForm';
import RecommendationList from '../components/recommendations/RecommendationList';
import { renderMoney } from '../utils/moneyUtils';
import '../styles/global.css';
import '../styles/cart.css';

const CartPage = () => {
  const { cart, loading: cartLoading, emptyCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [shippingCost, setShippingCost] = useState({ units: 0, nanos: 0, currencyCode: 'USD' });
  const [totalCost, setTotalCost] = useState({ units: 0, nanos: 0, currencyCode: 'USD' });
  const [loading, setLoading] = useState(true);
  
  // Calculate total cost and shipping
  useEffect(() => {
    if (!cartLoading && cart) {
      // For demo purposes, set shipping cost to $10 if cart has items
      const shipping = cart.length > 0 
        ? { units: 10, nanos: 0, currencyCode: 'USD' } 
        : { units: 0, nanos: 0, currencyCode: 'USD' };
      
      setShippingCost(shipping);
      
      // Calculate total price (would normally come from the API)
      let total = { units: shipping.units, nanos: shipping.nanos, currencyCode: 'USD' };
      
      cart.forEach(item => {
        // Multiply item price by quantity
        const itemTotal = {
          units: item.price.units * item.quantity,
          nanos: item.price.nanos * item.quantity,
          currencyCode: item.price.currencyCode
        };
        
        // Add to total (simplified - real implementation would handle nanos overflow)
        total.units += itemTotal.units;
        total.nanos += itemTotal.nanos;
        
        // Handle nanos overflow
        if (total.nanos >= 1000000000) {
          total.units += Math.floor(total.nanos / 1000000000);
          total.nanos = total.nanos % 1000000000;
        }
      });
      
      setTotalCost(total);
      setLoading(false);
    }
  }, [cart, cartLoading]);
  
  // Get recommendations based on cart items
  useEffect(() => {
    // This would normally be an API call
    // For demo purposes, we're just setting empty recommendations
    setRecommendations([]);
  }, [cart]);
  
  const handleEmptyCart = async (e) => {
    e.preventDefault();
    try {
      await emptyCart();
    } catch (err) {
      console.error('Failed to empty cart:', err);
    }
  };
  
  if (cartLoading || loading) {
    return <div className="text-center py-5">Loading cart...</div>;
  }
  
  // If cart is empty, show empty cart message
  if (!cart || cart.length === 0) {
    return (
      <main role="main" className="cart-sections">
        <EmptyCart />
      </main>
    );
  }
  
  return (
    <main role="main" className="cart-sections">
      <section className="container">
        <div className="row">
          <div className="col-lg-6 col-xl-5 offset-xl-1 cart-summary-section">
            <div className="row mb-3 py-2">
              <div className="col-4 pl-md-0">
                <h3>Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</h3>
              </div>
              <div className="col-8 pr-md-0 text-right">
                <form onSubmit={handleEmptyCart}>
                  <button 
                    className="cymbal-button-secondary cart-summary-empty-cart-button" 
                    type="submit"
                  >
                    Empty Cart
                  </button>
                  <Link className="cymbal-button-primary" to="/" role="button">
                    Continue Shopping
                  </Link>
                </form>
              </div>
            </div>
            
            {/* Cart Items */}
            {cart.map((item) => (
              <CartItem key={item.item.id} item={item} />
            ))}
            
            {/* Shipping and Total */}
            <div className="row cart-summary-shipping-row">
              <div className="col pl-md-0">Shipping</div>
              <div className="col pr-md-0 text-right">
                {renderMoney(shippingCost)}
              </div>
            </div>
            
            <div className="row cart-summary-total-row">
              <div className="col pl-md-0">Total</div>
              <div className="col pr-md-0 text-right">
                {renderMoney(totalCost)}
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="col-lg-5 offset-lg-1 col-xl-4">
            <CheckoutForm />
          </div>
        </div>
      </section>
      
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <RecommendationList recommendations={recommendations} />
      )}
    </main>
  );
};

export default CartPage;