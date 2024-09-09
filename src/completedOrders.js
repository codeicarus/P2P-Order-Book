import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompletedOrders = ({ refresh }) => {
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    console.log("hi inside completed orders table !!!!!!!!!")
    axios.get('http://localhost:5455/getData')
      .then(response => {
        console.log("completedOrdersTable:-", response.data.completedTableData);
        setCompletedOrders(response.data.completedTableData);
      })
      .catch(error => console.error('Error fetching completed orders:', error));
  }, [refresh]);

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
              <td>{order.qyt}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedOrders;
