import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PendingOrders from './pendingOrders';
import CompletedOrders from './completedOrders';
import OrderForm from './orderForm';
import contractABI from './contractABI.json';
import tokenABI from './tokenABI.json';
import './table.css';

const contractAddress = '0xf554fB83e66484E5884ba92882E840A799Eb1861';
const tokenAddress = '0xa21c2ff82d3Ad827899B11662445E51AE0DCbbB9';

const App = () => {
  const [buyOrderData, setBuyOrderData] = useState([]);
  const [sellOrderData, setSellOrderData] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [isMetamaskConnecting, setIsMetaMaskConnecting] = useState(false);

  const connectToMetaMask = async () => {
    try {
      if (!isMetamaskConnecting && window.ethereum) {
        setIsMetaMaskConnecting(true);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        const userSigner = ethProvider.getSigner();
        const userAddr = await userSigner.getAddress();
        const orderbookContract = new ethers.Contract(contractAddress, contractABI, userSigner);
        const erc20Contract = new ethers.Contract(tokenAddress, tokenABI, userSigner);

        setProvider(ethProvider);
        setSigner(userSigner);
        setContract(orderbookContract);
        setTokenContract(erc20Contract);
        setUserAddress(userAddr);
      } else if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask to use this feature.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    } finally {
      setIsMetaMaskConnecting(false);
    }
  };

  const approveTokens = async (amount) => {
    try {
      const tx = await tokenContract.approve(contractAddress, ethers.utils.parseEther(amount));
      await tx.wait();
      console.log('Tokens approved for contract.');
    } catch (error) {
      console.error('Token approval failed:', error);
      throw new Error('Token approval failed.');
    }
  };

  const matchOrders = async () => {
    let updatedBuyOrders = [...buyOrderData];
    let updatedSellOrders = [...sellOrderData];
    const newCompletedOrders = [];

    for (let buyIndex = 0; buyIndex < updatedBuyOrders.length; buyIndex++) {
      for (let sellIndex = 0; sellIndex < updatedSellOrders.length; sellIndex++) {
        const buyOrder = updatedBuyOrders[buyIndex];
        const sellOrder = updatedSellOrders[sellIndex];

        if (buyOrder.price === sellOrder.price && buyOrder.qty === sellOrder.qty) {
          try {
            // Approve tokens before matching orders
            await approveTokens(sellOrder.qty);

            // Add matched orders to completedOrders
            newCompletedOrders.push({
              price: buyOrder.price,
              qty: buyOrder.qty,
              type: 'matched',
            });

            // Remove matched orders from pending lists
            updatedBuyOrders.splice(buyIndex, 1);
            updatedSellOrders.splice(sellIndex, 1);

            // Update states with the matched orders
            setBuyOrderData(updatedBuyOrders);
            setSellOrderData(updatedSellOrders);
            setCompletedOrders(prev => [...prev, ...newCompletedOrders]);

            return; // Exit after processing the first match
          } catch (error) {
            console.error('Transaction failed:', error);
            return;
          }
        }
      }
    }
  };

  useEffect(() => {
    if (buyOrderData.length > 0 && sellOrderData.length > 0) {
      matchOrders();
    }
  }, [buyOrderData, sellOrderData]);

  const refreshData = async (orderData) => {
    try {
      if (orderData.type === 'buy') {
        setBuyOrderData(prev => [...prev, orderData]);
      } else if (orderData.type === 'sell') {
        setSellOrderData(prev => [...prev, orderData]);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div>
      <h1>P2P Order Matching System</h1>
      <button onClick={connectToMetaMask} disabled={isMetamaskConnecting}>
        {userAddress ? `Connected: ${userAddress}` : 'Connect MetaMask'}
      </button>
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
