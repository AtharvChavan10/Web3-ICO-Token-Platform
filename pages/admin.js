import React, { useState, useEffect, useContext } from "react";
import { TOKEN_ICO_Context } from "../context";
import { FaCoins, FaWallet, FaUser, FaCog } from "react-icons/fa";

const Admin = () => {
  const {
    TOKEN_ICO,
    UPDATE_TOKEN_PRICE,
    TOKEN_WITHDRAW,
    TRANSFER_ETHER,
    UPDATE_TOKEN,
    account,
    loader,
  } = useContext(TOKEN_ICO_Context);

  const [tokenDetails, setTokenDetails] = useState({});
  const [newPrice, setNewPrice] = useState("");
  const [transferData, setTransferData] = useState({ receiver: "", amount: "" });
  const [newTokenAddress, setNewTokenAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await TOKEN_ICO();
      if (data) setTokenDetails(data);
    };
    fetchData();
  }, []);

  const handleUpdatePrice = async () => {
    if (newPrice) {
      await UPDATE_TOKEN_PRICE(newPrice);
      setNewPrice("");
    }
  };

  const handleWithdrawTokens = async () => {
    await TOKEN_WITHDRAW();
  };

  const handleTransferEther = async () => {
    if (transferData.receiver && transferData.amount) {
      await TRANSFER_ETHER(transferData);
      setTransferData({ receiver: "", amount: "" });
    }
  };

  const handleUpdateToken = async () => {
    if (newTokenAddress) {
      await UPDATE_TOKEN(newTokenAddress);
      setNewTokenAddress("");
    }
  };

  if (!account) {
    return (
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Please connect your wallet to access the admin panel.</p>
      </div>
    );
  }

  if (account.toLowerCase() !== tokenDetails.owner) {
    return (
      <div className="admin-container">
        <h1>Access Denied</h1>
        <p>Only the contract owner can access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <FaCoins className="stat-icon" />
          <h3>Total Supply</h3>
          <p>{tokenDetails.supply} {tokenDetails.symbol}</p>
        </div>
        <div className="stat-card">
          <FaWallet className="stat-icon" />
          <h3>Available Tokens</h3>
          <p>{tokenDetails.tokenBal} {tokenDetails.symbol}</p>
        </div>
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <h3>Sold Tokens</h3>
          <p>{tokenDetails.soldTokens} {tokenDetails.symbol}</p>
        </div>
        <div className="stat-card">
          <FaCog className="stat-icon" />
          <h3>Token Price</h3>
          <p>{tokenDetails.tokenPrice} ETH</p>
        </div>
      </div>

      <div className="admin-actions">
        <div className="action-section">
          <h2>Update Token Sale Price</h2>
          <input
            type="number"
            placeholder="New price in ETH"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <button onClick={handleUpdatePrice} disabled={loader}>
            Update Price
          </button>
        </div>

        <div className="action-section">
          <h2>Update Token Address</h2>
          <input
            type="text"
            placeholder="New token contract address"
            value={newTokenAddress}
            onChange={(e) => setNewTokenAddress(e.target.value)}
          />
          <button onClick={handleUpdateToken} disabled={loader}>
            Update Token
          </button>
        </div>

        <div className="action-section">
          <h2>Withdraw All Tokens</h2>
          <p>Withdraw remaining tokens from the ICO contract to owner wallet.</p>
          <button onClick={handleWithdrawTokens} disabled={loader}>
            Withdraw Tokens
          </button>
        </div>

        <div className="action-section">
          <h2>Transfer Ether</h2>
          <input
            type="text"
            placeholder="Receiver address"
            value={transferData.receiver}
            onChange={(e) => setTransferData({ ...transferData, receiver: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={transferData.amount}
            onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
          />
          <button onClick={handleTransferEther} disabled={loader}>
            Transfer Ether
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;