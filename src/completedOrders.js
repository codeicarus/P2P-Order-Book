import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers

const CompletedOrders = ({ contract }) => {
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      if (!contract) return;
      try {
        const completedBuyOrders = await contract.queryFilter(contract.filters.buyOrder());
        const formattedOrders = completedBuyOrders.map(order => ({
          buyer: order.args.buyer,
          qty: ethers.utils.formatUnits(order.args.numberOfToken, 18), // Assuming 18 decimal places
          price: ethers.utils.formatEther(order.args.atPrice)
        }));

        setCompletedOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      }
    };

    fetchCompletedOrders();
  }, [contract]);

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
