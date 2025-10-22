import React from 'react';
import { Link } from 'react-router-dom';
import { renderMoney } from '../../utils/moneyUtils';

const ProductCard = ({ product }) => {
  return (
    <div className="hot-product-card">
      <Link to={`/product/${product.item.id}`}>
        <img loading="lazy" src={product.item.picture} alt={product.item.name} />
        <div className="hot-product-card-img-overlay"></div>
      </Link>
      <div>
        <div className="hot-product-card-name">{product.item.name}</div>
        <div className="hot-product-card-price">{renderMoney(product.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;