import React from 'react';
import { Link } from 'react-router-dom';

const ProductSuggestion = ({ product }) => {
  if (!product) return null;
  
  // Truncate description if it's too long
  let productDescription = product.description || '';
  if (productDescription.length > 350) {
    productDescription = productDescription.substring(0, 330) + '...';
  }
  
  return (
    <Link to={`/product/${product.id}`} className="bot-product">
      <img 
        src={product.picture} 
        alt={product.name} 
        className="bot-product-img" 
        onError={(e) => { e.target.style.display = 'none'; }} 
      />
      <div className="bot-product-description">
        <b>{product.name}</b><br />
        {productDescription}
      </div>
    </Link>
  );
};

export default ProductSuggestion;