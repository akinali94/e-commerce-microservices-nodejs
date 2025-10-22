import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <section className="empty-cart-section">
      <h3>Your shopping cart is empty!</h3>
      <p>Items you add to your shopping cart will appear here.</p>
      <Link className="cymbal-button-primary" to="/" role="button">
        Continue Shopping
      </Link>
    </section>
  );
};

export default EmptyCart;