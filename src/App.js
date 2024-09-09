import React, { useState } from 'react';
import PendingOrders from './pendingOrders';
import CompletedOrders from './completedOrders';
import OrderForm from './orderForm';
import './table.css';

const App = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refreshData = () => {
    setRefreshCounter(prevCounter => prevCounter + 1);
    console.log("refresh counter:-",refreshCounter);
  };

  return (
    <div>
      <h1>P2P Order Matching System</h1>
      <OrderForm onOrderPlaced={refreshData} />
      <div className="container">
        <div className="table-container">
          <PendingOrders refresh={refreshCounter} />
        </div>
        <div className="table-container">
          <CompletedOrders refresh={refreshCounter} />
        </div>
      </div>
    </div>
  );
};

export default App;
