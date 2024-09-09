import React from 'react';

const PendingOrders = ({ buyOrderData, sellOrderData }) => {
  return (
    <div>
      <h2>Pending Orders</h2>
      <div className="table-container">
        {/* Buyer Orders Table */}
        <div>
          <h3>Buy Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Buy Quantity</th>
                <th>Buy Price</th>
              </tr>
            </thead>
            <tbody>
              {buyOrderData.map((order, index) => (
                <tr key={index}>
                  <td>{order.qty}</td>
                  <td>{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Seller Orders Table */}
        <div>
          <h3>Sell Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Sell Quantity</th>
                <th>Sell Price</th>
              </tr>
            </thead>
            <tbody>
              {sellOrderData.map((order, index) => (
                <tr key={index}>
                  <td>{order.qty}</td>
                  <td>{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
