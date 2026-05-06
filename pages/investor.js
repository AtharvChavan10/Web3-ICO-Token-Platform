import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { TOKEN_ICO_Context } from "../context/index";
import { Header, Footer, KYC, Loader } from "../Components";
import { shortenAddress } from "../Utils/index";

const Investor = () => {
  const {
    TOKEN_ICO,
    BUY_TOKEN,
    account,
    kycVerified,
    setKycVerified,
    loader,
  } = useContext(TOKEN_ICO_Context);

  const [detail, setDetail] = useState(null);
  const [amount, setAmount] = useState(1);
  const [kycModel, setKycModel] = useState(false);
  const [liveEthPrice, setLiveEthPrice] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await TOKEN_ICO({ showLoader: false, toastOnError: false });
      setDetail(data);
    };

    if (account) fetchDetails();
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

  const handleBuy = async () => {
    if (!account) {
      toast.error("Connect your wallet first");
      return;
    }

    if (!kycVerified) {
      toast.error("Please complete KYC before buying tokens.");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Enter a valid token amount.");
      return;
    }

    await BUY_TOKEN(amount);
  };

  return (
    <>
      <div className="body_wrap">
        <Header />

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
                      {detail.tokenBal} {detail.symbol}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Tokens Sold</span>
                    <span className="value">{detail.soldTokens}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Token Price</span>
                    <span className="value">{detail.tokenPrice ?? 0} ETH</span>
                  </div>
                  <div className="stat">
                    <span className="label">Live ETH Price</span>
                    <span className="value">
                      {liveEthPrice ? `$${liveEthPrice.toFixed(2)}` : "Loading..."}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Holdings Value</span>
                    <span className="value">
                      {liveEthPrice
                        ? `$${(Number(detail.tokenBal) * Number(detail.tokenPrice) * liveEthPrice).toFixed(2)}`
                        : "Loading..."}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">KYC Status</span>
                    <span className="value">
                      {kycVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              )}

              <div className="investor-actions">
                <div className="investor-card">
                  <h2>Buy Tokens</h2>
                  <div className="form-row">
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={handleBuy} disabled={loader}>
                      Buy
                    </button>
                  </div>
                  <p className="estimate">
                    Estimated cost: {detail ? (amount * Number(detail.tokenPrice)).toFixed(4) : "0.0000"} ETH
                    {detail && liveEthPrice ? ` ($${(amount * Number(detail.tokenPrice) * liveEthPrice).toFixed(2)})` : ""}
                  </p>
                  <button
                    className="secondary"
                    onClick={() => setKycModel(true)}
                    disabled={kycVerified}
                  >
                    {kycVerified ? "KYC Completed" : "Complete KYC"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {kycModel && (
            <KYC setKycVerified={setKycVerified} setKycModel={setKycModel} />
          )}

          {loader && <Loader />}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Investor;
