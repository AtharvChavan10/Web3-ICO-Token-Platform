import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { shortenAddress } from "../Utils/index";

const Popup = ({
  setBuyModel,
  BUY_TOKEN,
  currency,
  detail,
  account,
  ERC20,
  TOKEN_ADDRESS,
  setLoader,
}) => {
  const [amount, setAmount] = useState();
  const [internetPrice, setInternetPrice] = useState(null);

  const amountNumber = Number(amount) || 0;
  const priceNumber = Number(detail?.tokenPrice);
  const hasPrice = Number.isFinite(priceNumber);
  const walletBalance = Number(detail?.maticBal) || 0;
  const tokenAddr = detail?.tokenAddr || TOKEN_ADDRESS || "-";
  const availableTokens = Number(detail?.tokenBal) || 0;
  const totalCost = hasPrice ? amountNumber * priceNumber : 0;
  const isInsufficientAmount = amountNumber <= 0;
  const isInsufficientFunds = amountNumber > 0 && totalCost > walletBalance;
  const internetPriceLabel = internetPrice
    ? Number(internetPrice).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : null;

  const handleBuyClick = () => {
    if (!account) {
      toast.error("Connect your wallet to buy tokens.");
      return;
    }

    if (!hasPrice) {
      toast.error("Token price is not available yet. Please wait a moment.");
      return;
    }

    if (isInsufficientAmount) {
      toast.error("Enter a valid token amount to purchase.");
      return;
    }

    if (amountNumber > availableTokens) {
      toast.error(
        `Only ${availableTokens} token(s) are available. Reduce your amount.`
      );
      return;
    }

    if (isInsufficientFunds) {
      toast.error("Insufficient wallet funds for this purchase.");
      return;
    }

    BUY_TOKEN(amount);
  };

  useEffect(() => {
    let mounted = true;
    const fetchInternetPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        if (!mounted) return;
        setInternetPrice(data?.ethereum?.usd ?? null);
      } catch (error) {
        console.log("Internet price fetch failed:", error);
      }
    };

    fetchInternetPrice();
    const interval = setInterval(fetchInternetPrice, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="new-margin ico-contact pos-rel">
      <div className="container">
        <div className="ico-contact__wrap">
          <div className="popup-header">
            <h2 className="title">Buy Token</h2>
            <button className="popup-close" onClick={() => setBuyModel(false)}>
              ×
            </button>
          </div>

          <div>
            <div className="row">
              <div className="col-lg-6">
                <input
                  type="number"
                  min="0"
                  value={amount ?? ""}
                  placeholder={`Available Tokens: ${availableTokens ?? "0"} ${
                    detail?.symbol ?? ""
                  }`}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <input
                  type="text"
                  value={
                    internetPriceLabel
                      ? `ETH live: $${internetPriceLabel}`
                      : "Fetching ETH live price..."
                  }
                  readOnly
                />
              </div>

              <div className="col-lg-12">
                <textarea
                  disabled
                  name="message"
                  cols="30"
                  rows="10"
                  value={`Current Token Price: ${
                    hasPrice ? priceNumber : "N/A"
                  } ${currency}${
                    internetPriceLabel ? `  |  ETH live: $${internetPriceLabel}` : ""
                  }\nToken Address: ${tokenAddr}${
                    tokenAddr && tokenAddr !== "-" ? ` (${shortenAddress(tokenAddr)})` : ""
                  }\nAvailable Tokens: ${availableTokens} ${
                    detail?.symbol ?? ""
                  }\nYour Wallet Balance: ${
                    account ? `${detail?.maticBal ?? "0"} ${currency}` : "Connect wallet"
                  }`}
                ></textarea>
              </div>

              <div className="ico-contract__btn text-center mt-10">
                {isInsufficientFunds && (
                  <p style={{ color: "#ff6b6b", marginBottom: 10 }}>
                    Insufficient wallet funds for this purchase.
                  </p>
                )}
                <button onClick={handleBuyClick} className="thm-btn">
                  {account ? "Buy Token" : "Connect wallet to buy"}
                </button>
              </div>
            </div>
          </div>

          <div className="ico-contact__shape-img">
            <div className="shape shape--1">
              <div className="">
                <img src="assets/img/shape/c_shape1.png" alt="" />
              </div>
            </div>
            <div className="shape shape--2">
              <div className="">
                <img src="assets/img/shape/c_shape2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ico-contact__shape">
        <div className="shape shape--1">
          <img src="assets/img/shape/c_shape1.png" alt="" />
        </div>
        <div className="shape shape--2">
          <img src="assets/img/shape/c_shape2.png" alt="" />
        </div>
        <div className="shape shape--3">
          <img src="assets/img/shape/c_shape3.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Popup;
