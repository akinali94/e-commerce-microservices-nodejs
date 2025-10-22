import React from 'react';

const ProductQuantitySelector = ({ value = 1, onChange }) => {
  return (
    <div className="product-quantity-dropdown">
      <select 
        name="quantity" 
        id="quantity"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
      <img src="/static/icons/Hipster_DownArrow.svg" alt="" />
    </div>
  );
};

export default ProductQuantitySelector;