import React, { useEffect, useState } from 'react';
import PendingOrders from './pendingOrders';
import CompletedOrders from './completedOrders';
import OrderForm from './orderForm';
import './table.css';

const App = () => {
  const [buyOrderData, setBuyOrderData] = useState([]);
  const [sellOrderData, setSellOrderData] = useState([]);

  useEffect(() => {
    const storedBuyOrders = localStorage.getItem('buyOrders');
    const storedSellOrders = localStorage.getItem('sellOrders');

    if (storedBuyOrders) {
      setBuyOrderData(JSON.parse(storedBuyOrders));
    }
    if (storedSellOrders) {
      setSellOrderData(JSON.parse(storedSellOrders));
    }
  }, []);

  const refreshData = (orderData) => {
    if (orderData.type === 'buy') {
      const newBuyOrders = [...buyOrderData, orderData];
      setBuyOrderData(newBuyOrders);
      localStorage.setItem('buyOrders', JSON.stringify(newBuyOrders));
    } else if (orderData.type === 'sell') {
      const newSellOrders = [...sellOrderData, orderData];
      setSellOrderData(newSellOrders);
      localStorage.setItem('sellOrders', JSON.stringify(newSellOrders));
    }
  };

  return (
    <div>
      <h1>P2P Order Matching System</h1>
      <OrderForm onOrderPlaced={refreshData} />
      <div className="container">
        <div className="table-container">
          <PendingOrders buyOrderData={buyOrderData} sellOrderData={sellOrderData} />
        </div>
        <div className="table-container">
          <CompletedOrders />
        </div>
      </div>
    </div>
  );
};

export default App;
