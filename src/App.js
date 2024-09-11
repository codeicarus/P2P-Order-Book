import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PendingOrders from './pendingOrders';
import CompletedOrders from './completedOrders';
import OrderForm from './orderForm';
import contractABI from './contractABI.json';
import './table.css';

const App = () => {
  const [buyOrderData, setBuyOrderData] = useState([]);
  const [sellOrderData, setSellOrderData] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const connectToContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Ensure only one request for accounts at a time
        if (provider.provider.selectedAddress) {
          const signer = provider.getSigner();
          const contractAddress = '0xf554fB83e66484E5884ba92882E840A799Eb1861'; // Your contract address
          const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(contractInstance);
        } else {
          try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractAddress = '0xf554fB83e66484E5884ba92882E840A799Eb1861'; // Your contract address
            const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contractInstance);
          } catch (error) {
            console.error('Error requesting accounts:', error);
          }
        }
      } else {
        alert('Please install MetaMask!');
      }
    };

    connectToContract();
  }, []);

  useEffect(() => {
    const matchOrders = async () => {
      if (!contract) return;

      try {
        const sellOrders = await contract.sOrders(); // Get all sell orders
        const updatedSellOrders = [...sellOrderData];
        const updatedBuyOrders = [...buyOrderData];

        for (const buyOrder of buyOrderData) {
          for (const sellOrder of sellOrders) {
            if (
              buyOrder.price === ethers.utils.formatEther(sellOrder.Price) &&
              buyOrder.qty <= sellOrder.numberOfToken
            ) {
              // Execute transaction
              const tx = await contract.Buy(buyOrder.qty, ethers.utils.parseEther(buyOrder.price), {
                value: ethers.utils.parseEther(buyOrder.price)
              });
              await tx.wait();
              console.log('Buy order executed:', tx);

              // Update sell order quantity or remove it
              const updatedSellOrder = {
                ...sellOrder,
                numberOfToken: sellOrder.numberOfToken - buyOrder.qty
              };

              if (updatedSellOrder.numberOfToken === 0) {
                // Remove the sell order from local state
                updatedSellOrders.splice(updatedSellOrders.indexOf(sellOrder), 1);
              } else {
                // Update the sell order in local state
                const index = updatedSellOrders.indexOf(sellOrder);
                if (index !== -1) {
                  updatedSellOrders[index] = updatedSellOrder;
                }
              }

              // Remove the matched buy order from local state
              updatedBuyOrders.splice(updatedBuyOrders.indexOf(buyOrder), 1);
              break; // Exit loop after executing the transaction
            }
          }
        }

        // Update local state
        setSellOrderData(updatedSellOrders);
        setBuyOrderData(updatedBuyOrders);

      } catch (error) {
        console.error('Error matching orders:', error);
      }
    };

    const interval = setInterval(matchOrders, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [contract, buyOrderData, sellOrderData]);

  const refreshData = async (orderData) => {
    
    if (orderData.type === 'buy') {
      try {
        const newBuyOrder = {
          type: 'buy',
          price: orderData.price,
          qty: orderData.qty,
        };
        setBuyOrderData(prev => [...prev, newBuyOrder]);

        // Handle order execution and matching here
        // This is just a placeholder for when you later implement order matching
      } catch (error) {
        console.error('Error placing buy order:', JSON.stringify(error, null, 2));
      }
    } else if (orderData.type === 'sell') {
      try {
        const newSellOrder = {
          type: 'sell',
          price: orderData.price,
          qty: orderData.qty,
        };
        setSellOrderData(prev => [...prev, newSellOrder]);

        const tokenContract = await contract._token(); // Assuming _token is a method to get the token contract
        const approveTx = await tokenContract.approve(contract.address, ethers.utils.parseEther(orderData.qty));
        await approveTx.wait();

        const tx = await contract.sell(ethers.utils.parseEther(orderData.price), ethers.utils.parseEther(orderData.qty));
        await tx.wait();
        console.log('Sell order placed successfully', tx);
      } catch (error) {
        console.error('Error placing sell order:', JSON.stringify(error, null, 2));
      }
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
          <CompletedOrders completedOrders={completedOrders} />
        </div>
      </div>
    </div>
  );
};

export default App;
