import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './table.css';

const PendingOrders = ({ buyOrderData, sellOrderData }) => {
  const [buyerData, setBuyerData] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  

  // useEffect(() => {
  //   axios.get('http://localhost:5455/getData')
  //     .then(response => {
  //       setBuyerData(response.data.buyerData);
  //       setSellerData(response.data.sellerData);
  //     })
  //     .catch(error => console.error('Error fetching pending orders:', error));
  // }, [refresh]);

  useEffect(() => {
    if (buyOrderData) {
      setBuyerData(prevData => [...prevData, buyOrderData]);
    }
  }, [buyOrderData]);

  useEffect(() => {
    if (sellOrderData) {
      setSellerData(prevData => [...prevData, sellOrderData]);
    }
  }, [sellOrderData]);
  console.log(buyerData);

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
              {buyerData.map((order, index) => (
                <tr key={index}>
                  <td>{order.qyt}</td>
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
              {sellerData.map((order, index) => (
                <tr key={index}>
                  <td>{order.price}</td>
                  <td>{order.qyt}</td>
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
