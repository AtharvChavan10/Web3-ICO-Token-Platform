import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { usePublicClient } from "wagmi";
import { Footer, Header, Loader, TransactionHistory } from "../Components/index";
import { TOKEN_ICO_Context } from "../context";
import { OWNER_ADDRESS, CONTRACT_ADDRESS } from "../context/constants";
import toast from "react-hot-toast";

const Admin = () => {
  const {
    TOKEN_ICO,
    UPDATE_TOKEN_PRICE,
    TOKEN_WITHDRAW,
    UPDATE_TOKEN,
    account,
    loader,
    currency,
    TRANSFER_ETHER,
    TRANSFER_TOKEN,
    DONATE,
    addtokenToMetaMask,
    TOKEN_ADDRESS,
  } = useContext(TOKEN_ICO_Context);

  const [tokenDetails, setTokenDetails] = useState(null);
  const [liveEthPrice, setLiveEthPrice] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [ethReceiver, setEthReceiver] = useState("");
  const [ethTransferAmount, setEthTransferAmount] = useState("");
  const [tokenReceiver, setTokenReceiver] = useState("");
  const [tokenTransferAmount, setTokenTransferAmount] = useState("");
  const [tokenTransferAddress, setTokenTransferAddress] = useState("");
  const [donateAmount, setDonateAmount] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [participantCount, setParticipantCount] = useState(null);
  const [participantAddresses, setParticipantAddresses] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const publicClient = usePublicClient();

  // Fetch token data
  const fetchTokenData = async () => {
    setDashboardError("");
    setLoadingDashboard(true);
    const data = await TOKEN_ICO({ showLoader: false, toastOnError: false });
    if (data) {
      setTokenDetails(data);
      setDashboardError("");
    } else {
      setTokenDetails(null);
      setDashboardError(
        "Unable to load admin data. Check your wallet/network and try again."
      );
    }
    setLoadingDashboard(false);
  };

  // Fetch live ETH price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setLiveEthPrice(data?.ethereum?.usd ?? null);
      } catch (error) {
        console.log("Failed to fetch ETH price:", error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh token data
  useEffect(() => {
    if (!publicClient) return;
    fetchTokenData();
    const interval = setInterval(fetchTokenData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval, publicClient]);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (
        !publicClient ||
        !tokenDetails?.tokenAddr ||
        tokenDetails.tokenAddr === ethers.constants.AddressZero
      )
        return;

      setEventsLoading(true);
      try {
        const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
        const logs = await publicClient.getLogs({
          address: tokenDetails.tokenAddr,
          topics: [
            transferTopic,
            ethers.utils.hexZeroPad(CONTRACT_ADDRESS, 32),
          ],
          fromBlock: 0,
        });

        const addresses = new Set();
        logs.forEach((log) => {
          const topic = log.topics?.[2];
          if (topic) {
            const recipient = ethers.utils.getAddress("0x" + topic.slice(26));
            addresses.add(recipient);
          }
        });

        setParticipantCount(addresses.size);
        setParticipantAddresses(Array.from(addresses).slice(-20));
      } catch (error) {
        console.error("Failed to load participant logs:", error);
        setParticipantCount(null);
      }
      setEventsLoading(false);
    };

    fetchParticipants();
  }, [tokenDetails?.tokenAddr, publicClient]);

  const handleUpdatePrice = async () => {
    if (!newPrice) {
      toast.error("Enter a price value");
      return;
    }
    await UPDATE_TOKEN_PRICE(newPrice);
    setNewPrice("");
    await fetchTokenData();
  };

  const handleWithdrawTokens = async () => {
    const confirm = window.confirm("Withdraw all remaining tokens to owner wallet?");
    if (confirm) {
      await TOKEN_WITHDRAW();
      await fetchTokenData();
    }
  };

  const handleUpdateToken = async () => {
    if (!newTokenAddress) {
      toast.error("Enter a token address");
      return;
    }
    await UPDATE_TOKEN(newTokenAddress);
    setNewTokenAddress("");
    await fetchTokenData();
  };

  const handleSetTokenAndPrice = async () => {
    if (!newTokenAddress || !newPrice) {
      toast.error("Enter both token address and sale price.");
      return;
    }
    await UPDATE_TOKEN(newTokenAddress);
    await UPDATE_TOKEN_PRICE(newPrice);
    setNewTokenAddress("");
    setNewPrice("");
    await fetchTokenData();
  };

  const handleSendEther = async () => {
    if (!ethReceiver || !ethTransferAmount) {
      toast.error("Enter receiver and amount.");
      return;
    }
    await TRANSFER_ETHER({ _receiver: ethReceiver, _amount: ethTransferAmount });
    setEthReceiver("");
    setEthTransferAmount("");
    await fetchTokenData();
  };

  const handleTransferToken = async () => {
    if (!tokenTransferAddress || !tokenReceiver || !tokenTransferAmount) {
      toast.error("Enter token address, recipient, and amount.");
      return;
    }
    await TRANSFER_TOKEN({
      _tokenAddress: tokenTransferAddress,
      _sendTo: tokenReceiver,
      _amount: tokenTransferAmount,
    });
    setTokenTransferAddress("");
    setTokenReceiver("");
    setTokenTransferAmount("");
    await fetchTokenData();
  };

  const handleDonate = async () => {
    if (!donateAmount) {
      toast.error("Enter donation amount.");
      return;
    }
    await DONATE(donateAmount);
    setDonateAmount("");
    await fetchTokenData();
  };

  const handleAddTokenToWallet = async () => {
    const result = await addtokenToMetaMask();
    if (result?.toLowerCase().includes("added")) {
      toast.success("Token added to your wallet");
    } else {
      toast.error(result || "Unable to add token to wallet");
    }
  };

  const openAdmin = () => {
    window.location.href = "/admin";
  };

  const openTools = () => {
    // Owner-only tools are available inside the admin dashboard.
  };

  const renderShell = (content) => (
    <div className="body_wrap">
      <Header
        detail={tokenDetails}
        currency={currency}
        openAdmin={openAdmin}
        openTools={openTools}
        isAdmin
      />
      <div className="admin-page">
        <div className="admin-container">{content}</div>
      </div>
      <Footer />
    </div>
  );

  if (!account) {
    return renderShell(
      <div className="admin-empty-state">
        <div className="admin-message-card">
          <h1>Admin Dashboard</h1>
          <p>Please connect the owner wallet to access admin features.</p>
        </div>
      </div>
    );
  }

  if (!tokenDetails && loadingDashboard) {
    return renderShell(
      <div className="admin-empty-state">
        <div className="admin-loading-card">
          <Loader />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!tokenDetails && dashboardError) {
    return renderShell(
      <div className="admin-empty-state">
        <div className="admin-message-card">
          <h1>Admin Dashboard</h1>
          <p>{dashboardError}</p>
          <button onClick={fetchTokenData} className="refresh-btn">
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const connectedWallet = account ? account.toLowerCase() : null;
  const contractOwner = tokenDetails?.owner;
  const expectedOwner = contractOwner || OWNER_ADDRESS.toLowerCase();
  const isOwner =
    connectedWallet &&
    (connectedWallet === expectedOwner || connectedWallet === OWNER_ADDRESS.toLowerCase());

  if (!isOwner) {
    return renderShell(
      <div className="admin-message-card">
        <h1>Admin Access Denied</h1>
        <p>Only the contract owner can access this portal. Make sure the wallet is connected and on the correct network.</p>
        <div className="admin-deny-details">
          <p>
            Connected: {account}
            <br />
            Contract Owner: {contractOwner || "Unavailable"}
            <br />
            Configured Owner: {OWNER_ADDRESS}
          </p>
        </div>
      </div>
    );
  }

  const tokenBal = Number(tokenDetails.tokenBal) || 0;
  const soldTokens = Number(tokenDetails.soldTokens) || 0;
  const totalSupply = Number(tokenDetails.supply) || 0;
  const tokenPrice = Number(tokenDetails.tokenPrice) || 0;
  const totalRaisedEth = (soldTokens * tokenPrice).toFixed(4);
  const soldPercentage = totalSupply ? ((soldTokens / totalSupply) * 100).toFixed(2) : 0;
  const holdingsValue = liveEthPrice ? (tokenBal * tokenPrice * liveEthPrice).toFixed(2) : "N/A";
  const soldValue = liveEthPrice ? (soldTokens * tokenPrice * liveEthPrice).toFixed(2) : "N/A";
  return renderShell(
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Monitor and manage the ICO contract</p>
        <div className="admin-controls">
          <label>
            Auto-refresh interval:
            <select value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))}>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
            </select>
          </label>
          <button onClick={fetchTokenData} className="refresh-btn">
            Refresh Now
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        {["overview", "analytics", "manage"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="tab-section">
            <h2>Overview</h2>
            {tokenDetails.tokenAddr === ethers.constants.AddressZero && (
              <div className="admin-warning-card">
                <p>
                  The ICO token contract is not configured yet. Go to the Manage tab to set the token address and sale price.
                </p>
              </div>
            )}
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Owner Address</span>
                <span className="metric-value">{tokenDetails.owner || "N/A"}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Connected Wallet</span>
                <span className="metric-value">{connectedWallet || "Not connected"}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Token Address</span>
                <span className="metric-value">{tokenDetails.tokenAddr}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Token Symbol</span>
                <span className="metric-value">{tokenDetails.symbol}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Wallet Balance (ETH)</span>
                <span className="metric-value">{tokenDetails.maticBal}</span>
              </div>
            </div>

            <div className="stats-section">
              <h3>Token Distribution</h3>
              <div className="distribution-grid">
                <div className="dist-card">
                  <h4>Total Supply</h4>
                  <p className="value">{totalSupply}</p>
                  <p className="symbol">{tokenDetails.symbol}</p>
                </div>
                <div className="dist-card">
                  <h4>Sold Tokens</h4>
                  <p className="value">{soldTokens}</p>
                  <p className="percent">{soldPercentage}%</p>
                </div>
                <div className="dist-card">
                  <h4>Available Tokens</h4>
                  <p className="value">{tokenBal}</p>
                  <p className="percent">{(100 - soldPercentage).toFixed(2)}%</p>
                </div>
              </div>

              <div className="progress-bar-container">
                <div className="progress-label">
                  <span>Tokens Sold</span>
                  <span>{soldPercentage}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${soldPercentage}%` }}></div>
                </div>
              </div>
            </div>

            <div className="price-section">
              <h3>Pricing Information</h3>
              <div className="price-grid">
                <div className="price-card">
                  <span className="label">Token Price</span>
                  <span className="price">{tokenPrice} ETH</span>
                </div>
                <div className="price-card">
                  <span className="label">Live ETH/USD</span>
                  <span className="price">${liveEthPrice ? liveEthPrice.toFixed(2) : "Loading..."}</span>
                </div>
                <div className="price-card">
                  <span className="label">Token Price (USD)</span>
                  <span className="price">
                    ${liveEthPrice ? (tokenPrice * liveEthPrice).toFixed(2) : "Loading..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="tab-section">
            <h2>Analytics & Insights</h2>
            <div className="analytics-grid">
              <div className="analytics-card large">
                <h4>Total Raised Value</h4>
                <p className="large-value">
                  {liveEthPrice ? `$${soldValue}` : "Loading..."}
                </p>
                <p className="subtitle">{soldTokens} tokens × {tokenPrice} ETH</p>
              </div>

              <div className="analytics-card">
                <h4>Remaining Inventory Value</h4>
                <p className="value">${holdingsValue}</p>
                <p className="subtitle">{tokenBal} tokens</p>
              </div>

              <div className="analytics-card">
                <h4>Sale Completion</h4>
                <p className="value">{soldPercentage}%</p>
                <p className="subtitle">{soldTokens} / {totalSupply} sold</p>
              </div>

              <div className="analytics-card">
                <h4>Average Price per Token</h4>
                <p className="value">
                  {liveEthPrice ? `$${(tokenPrice * liveEthPrice).toFixed(4)}` : "Loading..."}
                </p>
                <p className="subtitle">{tokenPrice} ETH</p>
              </div>

              <div className="analytics-card">
                <h4>Total Raised</h4>
                <p className="large-value">{totalRaisedEth} ETH</p>
                <p className="subtitle">{soldTokens} tokens × {tokenPrice} ETH</p>
              </div>

              <div className="analytics-card">
                <h4>Contract Balance</h4>
                <p className="value">{tokenDetails.maticBal} ETH</p>
                <p className="subtitle">Available for operations</p>
              </div>

              <div className="analytics-card">
                <h4>Participant Count</h4>
                <p className="value">
                  {eventsLoading ? "Loading..." : participantCount !== null ? participantCount : "Unavailable"}
                </p>
                <p className="subtitle">
                  {participantCount !== null ? "Unique buyers" : "Query token transfer logs"}
                </p>
              </div>
            </div>

            <div className="insights">
              <h3>Key Insights</h3>
              <ul>
                <li>
                  <strong>Tokens Remaining:</strong> {tokenBal} ({(100 - soldPercentage).toFixed(2)}% of supply)
                </li>
                <li>
                  <strong>Tokens Sold:</strong> {soldTokens} ({soldPercentage}% of supply)
                </li>
                <li>
                  <strong>Current Token Price:</strong> {tokenPrice} ETH ≈ $
                  {liveEthPrice ? (tokenPrice * liveEthPrice).toFixed(2) : "Loading..."}
                </li>
                <li>
                  <strong>Total Value Raised:</strong> ${soldValue}
                </li>
                <li>
                  <strong>Participant Count:</strong> {participantCount !== null ? participantCount : "Unavailable"}
                </li>
              </ul>
            </div>

            {participantAddresses.length > 0 && (
              <div className="recent-buyers">
                <h3>Recent Buyers</h3>
                <div className="buyer-list">
                  {participantAddresses.slice(-10).map((address) => (
                    <div className="buyer-card" key={address}>
                      <span>{address}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === "manage" && (
          <div className="tab-section">
            <h2>Manage Contract</h2>

            <div className="action-grid">
              <div className="action-card">
                <h3>Update Token Price</h3>
                <p>Set a new price for tokens in ETH</p>
                <div className="form-group">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Enter new price in ETH"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                  <p className="info-text">Current price: {tokenPrice} ETH</p>
                  <button onClick={handleUpdatePrice} disabled={loader}>
                    {loader ? "Updating..." : "Update Price"}
                  </button>
                </div>
              </div>

              <div className="action-card">
                <h3>Update Token Address</h3>
                <p>Update the ERC20 token contract address</p>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter new token contract address"
                    value={newTokenAddress}
                    onChange={(e) => setNewTokenAddress(e.target.value)}
                  />
                  <p className="info-text">Current: {tokenDetails.tokenAddr}</p>
                  <button onClick={handleUpdateToken} disabled={loader}>
                    {loader ? "Updating..." : "Update Address"}
                  </button>
                </div>
              </div>

              <div className="action-card">
                <h3>Set Token & Sale Price</h3>
                <p>Configure the token contract and its sale price in one step.</p>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Token contract address"
                    value={newTokenAddress}
                    onChange={(e) => setNewTokenAddress(e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Sale price in ETH"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                  <button onClick={handleSetTokenAndPrice} disabled={loader}>
                    {loader ? "Saving..." : "Save Token Setup"}
                  </button>
                </div>
              </div>

              <div className="action-card danger">
                <h3>Withdraw All Tokens</h3>
                <p>Transfer all remaining tokens to your wallet</p>
                <div className="form-group">
                  <p className="warning">⚠️ This action cannot be undone</p>
                  <p className="info-text">Available: {tokenBal} {tokenDetails.symbol}</p>
                  <button onClick={handleWithdrawTokens} disabled={loader} className="danger-btn">
                    {loader ? "Processing..." : "Withdraw Tokens"}
                  </button>
                </div>
              </div>

              <div className="action-card">
                <h3>Send ETH</h3>
                <p>Send native ETH to any address</p>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={ethReceiver}
                    onChange={(e) => setEthReceiver(e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Amount in ETH"
                    value={ethTransferAmount}
                    onChange={(e) => setEthTransferAmount(e.target.value)}
                  />
                  <button onClick={handleSendEther} disabled={loader}>
                    {loader ? "Sending..." : "Send ETH"}
                  </button>
                </div>
              </div>

              <div className="action-card">
                <h3>Transfer ERC20</h3>
                <p>Send a token from your wallet using contract address</p>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="ERC20 token address"
                    value={tokenTransferAddress}
                    onChange={(e) => setTokenTransferAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={tokenReceiver}
                    onChange={(e) => setTokenReceiver(e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Amount"
                    value={tokenTransferAmount}
                    onChange={(e) => setTokenTransferAmount(e.target.value)}
                  />
                  <button onClick={handleTransferToken} disabled={loader}>
                    {loader ? "Transferring..." : "Transfer Token"}
                  </button>
                </div>
              </div>

              <div className="action-card">
                <h3>Donate to Owner</h3>
                <p>Send support funds to the owner wallet</p>
                <div className="form-group">
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Amount in ETH"
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                  />
                  <button onClick={handleDonate} disabled={loader}>
                    {loader ? "Processing..." : "Donate"}
                  </button>
                </div>
              </div>

              <div className="action-card">
                <h3>Add ICO Token</h3>
                <p>Add the current token address to MetaMask</p>
                <div className="form-group">
                  <p className="info-text">Token address: {TOKEN_ADDRESS}</p>
                  <button onClick={handleAddTokenToWallet} disabled={loader}>
                    Add Token to Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;