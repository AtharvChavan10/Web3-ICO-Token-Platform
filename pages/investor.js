import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { TOKEN_ICO_Context } from "../context/index";
import { Header, Footer, KYC, Loader, TransactionHistory } from "../Components";
import { shortenAddress } from "../Utils/index";

const Investor = () => {
  const {
    TOKEN_ICO,
    BUY_TOKEN,
    CONNECT_WALLET,
    account,
    kycVerified,
    setKycVerified,
    loader,
    addtokenToMetaMask,
    CHECK_ACCOUNT_BALANCE,
  } = useContext(TOKEN_ICO_Context);

  const [detail, setDetail] = useState(null);
  const [amount, setAmount] = useState(1);
  const [kycModel, setKycModel] = useState(false);
  const [liveEthPrice, setLiveEthPrice] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchDetails = async () => {
      const data = await TOKEN_ICO({ showLoader: false, toastOnError: false });
      if (!cancelled) setDetail(data);
    };

    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [account]);

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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!account) {
        setWalletBalance(null);
        return;
      }
      try {
        const balance = await CHECK_ACCOUNT_BALANCE(account);
        setWalletBalance(balance ? Number(balance) : 0);
      } catch (error) {
        console.log("Failed to load wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, [account, CHECK_ACCOUNT_BALANCE]);

  const handleBuyMax = () => {
    if (!detail || !detail.tokenPrice) {
      toast.error("Token price is unavailable.");
      return;
    }
    const price = Number(detail.tokenPrice);
    const available = Number(detail.tokenBal || 0);
    const balance = Number(walletBalance || 0);
    if (!price || price <= 0) {
      toast.error("Unable to calculate max purchase.");
      return;
    }
    const maxByFunds = Math.floor(balance / price);
    const maxAmount = Math.min(maxByFunds, available);
    if (maxAmount <= 0) {
      toast.error("Not enough funds or available tokens to buy.");
      return;
    }
    setAmount(maxAmount);
    toast.success(`Max buy amount set to ${maxAmount}`);
  };

  const handleAddToken = async () => {
    try {
      const result = await addtokenToMetaMask();
      if (result?.toLowerCase().includes("added")) {
        toast.success("Token added to your wallet.");
      } else {
        toast.error(result || "Unable to add token to wallet.");
      }
    } catch (error) {
      toast.error("Unable to add token to wallet.");
    }
  };

  const openKyc = () => {
    if (!account) {
      toast.error("Connect your wallet to authenticate.");
      CONNECT_WALLET();
      return;
    }
    setKycModel(true);
  };

  const handleBuy = async () => {
    if (!account) {
      toast.error("Connect your wallet first");
      CONNECT_WALLET();
      return;
    }

    if (!kycVerified) {
      toast.error("Authenticate with KYC before you buy.");
      setKycModel(true);
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Enter a valid token amount.");
      return;
    }

    await BUY_TOKEN(amount);
  };

  const formatAmount = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    return num.toLocaleString("en-US", { maximumFractionDigits: 4 });
  };

  const availableTokens = Number(detail?.tokenBal || 0);
  const totalSupply = Number(detail?.supply || 0);
  const soldTokens = Number(detail?.soldTokens || 0);
  const soldPercentage = totalSupply ? ((soldTokens / totalSupply) * 100).toFixed(2) : 0;
  const unitPrice = Number(detail?.tokenPrice || 0);
  const tokenCount = Number(detail?.tokenBal || 0);
  const estimatedCost = (Number(amount || 0) * unitPrice).toFixed(4);
  const estimatedUsd = liveEthPrice ? (Number(estimatedCost) * liveEthPrice).toFixed(2) : null;
  const priceUsd = liveEthPrice ? (unitPrice * liveEthPrice).toFixed(2) : "—";
  const holdingsValue =
    tokenCount === 0
      ? "$0.00"
      : liveEthPrice
        ? `$${(tokenCount * unitPrice * liveEthPrice).toFixed(2)}`
        : "—";

  return (
    <>
      <div className="body_wrap">
        <Header openAdmin={() => { window.location.href = "/admin"; }} />

        <main className="investor-page">
          <section className="investor-hero">
            <div className="container">
              <h1>Investor Dashboard</h1>
              <p>
                Track your token holdings, manage your investments, and buy more
                tokens directly from the ICO contract.
              </p>
              {account && (
                <p className="investor-account">
                  Connected: {shortenAddress(account)}
                </p>
              )}

              {detail && (
                <div className="investor-stats">
                  <div className="stat">
                    <span className="label">Your Token Balance</span>
                    <span className="value">
                      {formatAmount(detail.tokenBal)} {detail.symbol}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Tokens Sold</span>
                    <span className="value">{detail.soldTokens}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Available Tokens</span>
                    <span className="value">{formatAmount(availableTokens)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Sale Completion</span>
                    <span className="value">{soldPercentage}%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Token Price</span>
                    <span className="value">{detail.tokenPrice ?? 0} ETH</span>
                  </div>
                  <div className="stat">
                    <span className="label">USD Price</span>
                    <span className="value">{priceUsd}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Wallet Balance</span>
                    <span className="value">{walletBalance !== null ? `${walletBalance.toFixed(4)} ETH` : "Loading..."}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Holdings Value</span>
                    <span className="value">{holdingsValue}</span>
                  </div>
                  <div className="stat">
                    <span className="label">KYC Status</span>
                    <span className="value">
                      {kycVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              )}

              {detail && (
                <div className="investor-progress">
                  <div className="progress-label">
                    <span>Sale progress</span>
                    <span>{soldPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${soldPercentage}%` }} />
                  </div>
                </div>
              )}

              <div className="buy-card">
                <div className="buy-card__head">
                  <h2>Buy tokens</h2>
                  <span className={kycVerified ? "kyc-pill is-ok" : "kyc-pill"}>
                    {kycVerified ? "KYC verified" : "KYC needed"}
                  </span>
                </div>
                <label className="buy-field">
                  <span>Tokens</span>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <div className="buy-pay">
                  <span>You pay</span>
                  <strong>{estimatedCost} ETH</strong>
                  {estimatedUsd && <em>${estimatedUsd}</em>}
                </div>
                <button className="buy-go" onClick={handleBuy} disabled={loader}>
                  {kycVerified ? "Buy" : "Verify to buy"}
                </button>
                <div className="buy-extra">
                  <button type="button" onClick={handleBuyMax} disabled={!detail || loader}>
                    Buy max
                  </button>
                  <button type="button" onClick={handleAddToken}>
                    Add token
                  </button>
                  {!kycVerified && (
                    <button type="button" onClick={openKyc}>
                      Complete KYC
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {kycModel && (
            <KYC
              account={account}
              CONNECT_WALLET={CONNECT_WALLET}
              setKycVerified={setKycVerified}
              setKycModel={setKycModel}
            />
          )}

          {loader && <Loader />}
        </main>

        <Footer />
      </div>
      <TransactionHistory />
    </>
  );
};

export default Investor;
