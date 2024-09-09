import { type } from '@testing-library/user-event/dist/type';
import React, { useState } from 'react';
// import axios from 'axios';
// import tokenlist from "./erc20_tokens.json"


const OrderForm = ({ onOrderPlaced }) => {
  const [formData, setFormData] = useState({ type: 'buy', price: '', qty: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTokenChange = (e) => {
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // 
    if (formData.type === 'buy') {
      const buyOrderData = {
        type: 'buy',
        price: formData.price,
        qty: formData.qty
      };
      onOrderPlaced(buyOrderData);
      // You might need to implement a function to update the buy order component
      // For example: updateBuyOrderComponent(buyOrderData);
    } else if (formData.type === 'sell') {
      const sellOrderData = {
        type: 'sell',
        price: formData.price,
        qty: formData.qty
      };
      onOrderPlaced(sellOrderData);
      // You might need to implement a function to update the sell order component
      // For example: updateSellOrderComponent(sellOrderData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="buyer">Buy</option>
            <option value="seller">Sell</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          ERC20 Token
          <input type="text" name="token" onChange={handleTokenChange} />
        </label>
      </div>
      <div>
        <label>
          Price:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Quantity:
          <input type="number" name="qty" value={formData.qty} onChange={handleChange} required />
        </label>
      </div>
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
