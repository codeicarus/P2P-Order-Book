import React, { useState } from 'react';

const OrderForm = ({ onOrderPlaced }) => {
  const [formData, setFormData] = useState({ type: 'buy', price: '', qty: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      type: formData.type,
      price: formData.price,
      qty: formData.qty
    };
    onOrderPlaced(orderData);
    // Reset form after submission
    setFormData({ type: 'buy', price: '', qty: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Price:
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Quantity:
          <input type="number" step="1" name="qty" value={formData.qty} onChange={handleChange} required />
        </label>
      </div>
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
