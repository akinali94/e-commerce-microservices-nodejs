import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../services/cartService';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const expirationYears = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];
  
  const [formData, setFormData] = useState({
    email: 'someone@example.com',
    street_address: '1600 Amphitheatre Parkway',
    zip_code: '94043',
    city: 'Mountain View',
    state: 'CA',
    country: 'United States',
    credit_card_number: '4432801561520454',
    credit_card_expiration_month: '1',
    credit_card_expiration_year: String(currentYear + 1),
    credit_card_cvv: '672'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Process checkout
      await cartService.checkout(formData);
      
      // Redirect to order confirmation
      navigate('/cart/checkout/confirmation');
    } catch (err) {
      setError('Failed to process checkout. Please check your information and try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form className="cart-checkout-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row">
        <div className="col">
          <h3>Shipping Address</h3>
        </div>
      </div>

      <div className="form-row">
        <div className="col cymbal-form-field">
          <label htmlFor="email">E-mail Address</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="col cymbal-form-field">
          <label htmlFor="street_address">Street Address</label>
          <input 
            type="text" 
            name="street_address"
            id="street_address" 
            value={formData.street_address} 
            onChange={handleChange}
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="col cymbal-form-field">
          <label htmlFor="zip_code">Zip Code</label>
          <input 
            type="text"
            name="zip_code" 
            id="zip_code" 
            value={formData.zip_code} 
            onChange={handleChange}
            required 
            pattern="\d{4,5}" 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="col cymbal-form-field">
          <label htmlFor="city">City</label>
          <input 
            type="text" 
            name="city" 
            id="city"
            value={formData.city} 
            onChange={handleChange}
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="col-md-5 cymbal-form-field">
          <label htmlFor="state">State</label>
          <input 
            type="text" 
            name="state" 
            id="state"
            value={formData.state} 
            onChange={handleChange}
            required 
          />
        </div>
        <div className="col-md-7 cymbal-form-field">
          <label htmlFor="country">Country</label>
          <input 
            type="text" 
            id="country"
            placeholder="Country Name"
            name="country" 
            value={formData.country} 
            onChange={handleChange}
            required 
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3 className="payment-method-heading">Payment Method</h3>
        </div>
      </div>

      <div className="form-row">
        <div className="col cymbal-form-field">
          <label htmlFor="credit_card_number">Credit Card Number</label>
          <input 
            type="text" 
            id="credit_card_number"
            name="credit_card_number"
            placeholder="0000000000000000"
            value={formData.credit_card_number}
            onChange={handleChange}
            required 
            pattern="\d{16}" 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="col-md-5 cymbal-form-field">
          <label htmlFor="credit_card_expiration_month">Month</label>
          <select 
            name="credit_card_expiration_month" 
            id="credit_card_expiration_month"
            value={formData.credit_card_expiration_month}
            onChange={handleChange}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <img src="/static/icons/Hipster_DownArrow.svg" alt="" className="cymbal-dropdown-chevron" />
        </div>
        <div className="col-md-4 cymbal-form-field">
          <label htmlFor="credit_card_expiration_year">Year</label>
          <select 
            name="credit_card_expiration_year" 
            id="credit_card_expiration_year"
            value={formData.credit_card_expiration_year}
            onChange={handleChange}
          >
            {expirationYears.map((year, index) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <img src="/static/icons/Hipster_DownArrow.svg" alt="" className="cymbal-dropdown-chevron" />
        </div>
        <div className="col-md-3 cymbal-form-field">
          <label htmlFor="credit_card_cvv">CVV</label>
          <input 
            type="password" 
            id="credit_card_cvv"
            name="credit_card_cvv" 
            value={formData.credit_card_cvv}
            onChange={handleChange}
            required 
            pattern="\d{3}" 
          />
        </div>
      </div>

      <div className="form-row justify-content-center">
        <div className="col text-center">
          <button 
            className="cymbal-button-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;