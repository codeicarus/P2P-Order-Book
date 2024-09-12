import React from 'react';

const CompletedOrders = ({ completedOrders }) => {
  return (
    <div>
      <h2>Completed Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.price}</td>
              <td>{order.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedOrders;
