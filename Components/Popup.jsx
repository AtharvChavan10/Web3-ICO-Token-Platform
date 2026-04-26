import React, { useState, useEffect } from "react";
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
  const [transferToken, setTransferToken] = useState();

  useEffect(() => {
    setLoader(true);
    ERC20(TOKEN_ADDRESS).then((items) => {
      setTransferToken(items);
      console.log(items);
      setLoader(false);
    });
  }, []);

  const amountNumber = Number(amount) || 0;
  const priceNumber = Number(detail?.tokenPrice) || 0;
  const outputValue = (amountNumber * priceNumber).toFixed(6);

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
                  placeholder={`Token Balance: ${transferToken?.balance ?? "0"} ${transferToken?.symbol ?? ""}`}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <input
                  type="text"
                  value={`${outputValue} ${currency}`}
                  readOnly
                />
              </div>

              <div className="col-lg-12">
                <textarea
                  disabled
                  name="message"
                  cols="30"
                  rows="10"
                  value={`Current Price: ${priceNumber || 0} ${currency}\nToken Address: ${detail?.tokenAddr ?? "-"}\nYour Balance: ${detail?.tokenBal ?? "0"} ${detail?.symbol ?? ""}`}
                ></textarea>
              </div>

              <div className="ico-contract__btn text-center mt-10">
                <button onClick={() => BUY_TOKEN(amount)} className="thm-btn">
                  Buy Token
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
