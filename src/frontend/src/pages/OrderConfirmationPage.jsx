import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecommendationList from '../components/recommendations/RecommendationList';
import { renderMoney } from '../utils/moneyUtils';
import '../styles/global.css';
import '../styles/order.css';

const OrderConfirmationPage = () => {
  // In a real app, this data would come from the API based on the order ID
  // For demo purposes, we'll create mock data
  const [order, setOrder] = useState({
    orderId: 'ORDER-' + Math.floor(Math.random() * 1000000),
    shippingTrackingId: 'TRACK-' + Math.floor(Math.random() * 1000000),
    items: [],
  });
  
  const [totalPaid, setTotalPaid] = useState({
    units: 67,
    nanos: 950000000,
    currencyCode: 'USD'
  });
  
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    // In a real app, fetch the order details and recommendations here
    setRecommendations([]);
  }, []);
  
  return (
    <main role="main" className="order">
      <section className="container order-complete-section">
        <div className="row">
          <div className="col-12 text-center">
            <h3>
              Your order is complete!
            </h3>
          </div>
          <div className="col-12 text-center">
            <p>We've sent you a confirmation email.</p>
          </div>
        </div>
        
        <div className="row border-bottom-solid padding-y-24">
          <div className="col-6 pl-md-0">
            Confirmation #
          </div>
          <div className="col-6 pr-md-0 text-right">
            {order.orderId}
          </div>
        </div>
        
        <div className="row border-bottom-solid padding-y-24">
          <div className="col-6 pl-md-0">
            Tracking #
          </div>
          <div className="col-6 pr-md-0 text-right">
            {order.shippingTrackingId}
          </div>
        </div>
        
        <div className="row padding-y-24">
          <div className="col-6 pl-md-0">
            Total Paid
          </div>
          <div className="col-6 pr-md-0 text-right">
            {renderMoney(totalPaid)}
          </div>
        </div>
        
        <div className="row">
          <div className="col-12 text-center">
            <Link className="cymbal-button-primary" to="/" role="button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
      
      {recommendations.length > 0 && (
        <RecommendationList recommendations={recommendations} />
      )}
    </main>
  );
};

export default OrderConfirmationPage;