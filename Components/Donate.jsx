import React, { useState, useEffect } from "react";

const Donate = ({ detail, currency, setOpenDonate, DONATE, onBack }) => {
  const [donateFund, setDonateFund] = useState();

  return (
    <section className="new-margin ico-contact pos-rel">
      <div className="container">
        <div className="ico-contact__wrap">
          <div className="popup-header">
            <button
              type="button"
              className="popup-back"
              onClick={() =>
                typeof onBack === "function" ? onBack() : setOpenDonate(false)
              }
            >
              ← Back
            </button>
            <h2 className="title">Donate {currency}</h2>
            <button
              type="button"
              className="popup-close"
              onClick={() => setOpenDonate(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div>
            <div className="row">
              <div className="col-lg-12">
                <input
                  type="text"
                  placeholder="_amount"
                  onChange={(e) => setDonateFund(e.target.value)}
                />
              </div>

              <p>
                <strong>Balance:</strong> {detail?.maticBal} {currency}
              </p>

              <div className="ico-contract__btn text-center mt-10">
                <button onClick={() => DONATE(donateFund)} className="thm-btn">
                  Donate
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

export default Donate;
