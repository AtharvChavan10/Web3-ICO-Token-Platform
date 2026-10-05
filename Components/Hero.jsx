import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Hero = ({
  setBuyModel,
  account,
  CONNECT_WALLET,
  setLoader,
  detail,
  addtokenToMetaMask,
  setKycModel,
  kycVerified,
  deploySale,
  saleReady,
}) => {
  const [percentage, setPercentage] = useState(0);
  const [animatedSold, setAnimatedSold] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [qty, setQty] = useState(250);

  const onPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  const connectWallet = () => {
    CONNECT_WALLET();
  };

  const startPurchase = () => {
    if (!kycVerified) {
      toast.error("Sign the identity check before you buy.");
      setKycModel(true);
      return;
    }
    setBuyModel(true);
  };

  const liveRound = Boolean(detail && !detail.offline);
  const soldTarget = liveRound ? Number(detail?.soldTokens) || 0 : 184250;
  const totalTarget = soldTarget + (liveRound ? Number(detail?.tokenBal) || 0 : 815750);

  useEffect(() => {
    const percentageNew = totalTarget ? (soldTarget / totalTarget) * 100 : 0;
    setPercentage(percentageNew);

    const animateValue = (from, to, setter, duration = 900) => {
      const start = performance.now();
      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setter(Math.round(from + (to - from) * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    animateValue(0, soldTarget, setAnimatedSold);
    animateValue(0, totalTarget, setAnimatedTotal);
  }, [soldTarget, totalTarget]);

  const addToken = async () => {
    setLoader(true);
    const response = await addtokenToMetaMask();
    setLoader(false);
    if (response) toast.success(response);
  };

  const price = Number(detail?.tokenPrice);
  const livePrice = Boolean(detail && !detail.offline && Number.isFinite(price) && price > 0);
  const unit = livePrice ? price : 0.001;
  const quote = (qty * unit).toFixed(4);
  const priceLabel = !detail
    ? "Syncing…"
    : detail.offline
    ? "Example · 0.001 ETH"
    : Number.isFinite(price)
    ? `${price} ETH`
    : "Syncing…";

  return (
    <section className="hero hero__ico pos-rel" id="home" onMouseMove={onPointer}>
      <div className="hero-glow" />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="hero__content hero-copy">
              <span className="eyebrow">Example sale · Atharv Chavan</span>
              <h1 className="title mb-45">
                Buy the token.
                <span> Own the round.</span>
              </h1>
              <p className="hero-lead">
                Connect a wallet on Sepolia, complete a short KYC check, and purchase
                tokens with faucet ETH. Real ETH is not used. Price and supply
                update from the test network.
              </p>

              <div className="btns">
                {!saleReady && (
                  <a className="thm-btn" onClick={deploySale}>
                    Deploy sale
                  </a>
                )}
                {account ? (
                  <>
                    <a
                      className="thm-btn"
                      onClick={() => setKycModel(true)}
                      style={kycVerified ? { opacity: 0.7, pointerEvents: "none" } : {}}
                    >
                      {kycVerified ? "KYC Verified" : "Complete KYC"}
                    </a>
                    <a className="thm-btn" onClick={startPurchase}>
                      {kycVerified ? "Purchase Token" : "Verify to buy"}
                    </a>
                  </>
                ) : (
                  <a className="thm-btn" onClick={connectWallet}>
                    Connect Wallet
                  </a>
                )}
                <a className="thm-btn thm-btn--dark" onClick={addToken}>
                  Add to MetaMask
                </a>
                <a
                  className="thm-btn thm-btn--dark"
                  href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get test ETH
                </a>
              </div>

              <div className="hero__progress mt-50">
                <div className="progress-title ul_li_between">
                  <span>
                    <span>{liveRound ? "Raised — " : "Sample raised — "}</span>
                    {animatedSold.toLocaleString()} tokens
                  </span>
                  <span>
                    <span>{liveRound ? "Round size — " : "Sample size — "}</span>
                    {animatedTotal.toLocaleString()} {detail?.symbol || ""}
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <ul className="ul_li_between">
                  <li>Pre-sale</li>
                  <li>Soft cap</li>
                  <li>Bonus</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="sale-card">
              <div className="orbit" aria-hidden="true">
                <span className="orb orb-1">Ξ</span>
                <span className="orb orb-2">◆</span>
                <span className="orb orb-3">◎</span>
              </div>
              <p className="sale-card__label">Token price</p>
              <h2>{priceLabel}</h2>
              <ul>
                <li>
                  <span>Name</span>
                  <strong>{detail?.offline ? "RPC offline" : detail?.name || "Loading"}</strong>
                </li>
                <li>
                  <span>Symbol</span>
                  <strong>{detail?.symbol || "—"}</strong>
                </li>
                <li>
                  <span>Available</span>
                  <strong>
                    {!detail || detail.offline
                      ? "—"
                      : Number(detail.tokenBal || 0).toLocaleString()}
                  </strong>
                </li>
                <li>
                  <span>Network</span>
                  <strong>Sepolia</strong>
                </li>
              </ul>
              <div className="quote">
                <div className="quote__head">
                  <span>{livePrice ? "Live quote" : "Example quote"}</span>
                  <strong>Atharv Chavan</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="5000"
                  step="10"
                  value={qty}
                  aria-label="Example token amount"
                  onChange={(event) => setQty(Number(event.target.value))}
                />
                <p>
                  {qty.toLocaleString()} tokens
                  <b>{quote} ETH</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
