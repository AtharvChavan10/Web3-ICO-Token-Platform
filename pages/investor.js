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

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await TOKEN_ICO();
      setDetail(data);
    };

    if (account) fetchDetails();
  }, [account]);

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
