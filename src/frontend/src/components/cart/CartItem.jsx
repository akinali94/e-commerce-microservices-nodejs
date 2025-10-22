import React from 'react';
import { Link } from 'react-router-dom';
import { renderMoney } from '../../utils/moneyUtils';

const CartItem = ({ item }) => {
  return (
    <div className="row cart-summary-item-row">
      <div className="col-md-4 pl-md-0">
        <Link to={`/product/${item.item.id}`}>
          <img className="img-fluid" alt={item.item.name} src={item.item.picture} />
        </Link>
      </div>
      <div className="col-md-8 pr-md-0">
        <div className="row">
          <div className="col">
            <h4>{item.item.name}</h4>
          </div>
        </div>
        <div className="row cart-summary-item-row-item-id-row">
          <div className="col">
            SKU #{item.item.id}
          </div>
        </div>
        <div className="row">
          <div className="col">
            Quantity: {item.quantity}
          </div>
          <div className="col pr-md-0 text-right">
            <strong>
              {renderMoney(item.price)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;