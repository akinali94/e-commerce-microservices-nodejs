import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import '../../styles/global.css';

const Header = ({ isCymbalBrand, assistantEnabled, frontendMessage }) => {
  const { getCartSize } = useCart();
  const { currencies, currentCurrency, changeCurrency } = useCurrency();
  
  const handleCurrencyChange = (e) => {
    changeCurrency(e.target.value);
  };

  return (
    <header>
      {frontendMessage && (
        <div className="navbar">
          <div className="container d-flex justify-content-center">
            <div className="h-free-shipping">{frontendMessage}</div>
          </div>
        </div>
      )}
      
      <div className="navbar sub-navbar">
        <div className="container d-flex justify-content-between">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            {isCymbalBrand ? (
              <img 
                src="/static/icons/Cymbal_NavLogo.svg" 
                alt="Cymbal Shops" 
                className="top-left-logo-cymbal" 
              />
            ) : (
              <img 
                src="/static/icons/Hipster_NavLogo.svg" 
                alt="Online Boutique" 
                className="top-left-logo" 
              />
            )}
          </Link>
          
          <div className="controls">
            <div className="h-controls">
              <div className="h-control">
                <span className="icon currency-icon">
                  {renderCurrencyLogo(currentCurrency)}
                </span>
                <select 
                  value={currentCurrency} 
                  onChange={handleCurrencyChange}
                  className="currency-selector"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <img 
                  src="/static/icons/Hipster_DownArrow.svg" 
                  alt="" 
                  className="icon arrow" 
                />
              </div>
            </div>
            
            {assistantEnabled && (
              <Link to="/assistant" className="cart-link">
                <img 
                  src="/static/icons/Hipster_WandIcon.svg" 
                  alt="Assistant icon" 
                  className="logo" 
                  title="Assistant" 
                  style={{ width: '22px', height: '22px' }} 
                />
              </Link>
            )}
            
            <Link to="/cart" className="cart-link">
              <img 
                src="/static/icons/Hipster_CartIcon.svg" 
                alt="Cart icon" 
                className="logo" 
                title="Cart" 
              />
              {getCartSize() > 0 && (
                <span className="cart-size-circle">{getCartSize()}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper function (same as in utils/moneyUtils.js)
function renderCurrencyLogo(currencyCode) {
  const logos = {
    'USD': '$',
    'CAD': '$',
    'JPY': '¥',
    'EUR': '€',
    'TRY': '₺',
    'GBP': '£',
  };
  
  return logos[currencyCode] || '$';
}

export default Header;