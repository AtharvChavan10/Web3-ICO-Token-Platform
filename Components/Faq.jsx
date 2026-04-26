import React from "react";

const Faq = () => {
  return (
    <section id="faq" className="faq pos-rel pt-140 pb-105">
      <div className="container">
        <div className="sec-title text-center mb-35">
          <h5 className="sec-title__subtitle">FAQ</h5>
          <h2 className="sec-title__title">Frequently asked questions</h2>
        </div>

        <div className="faq__wrap">
          <ul className="accordion_box clearfix">
            <li className="accordion block active-block">
              <div className="acc-btn">
                <span>QA: 01</span> What is an ICO?
              </div>
              <div className="acc_body current">
                <div className="content">
                  <p>
                    An Initial Coin Offering (ICO) is a fundraising method used by blockchain projects to raise capital by selling digital tokens to investors. These tokens may provide access to services, platform features, or future value within the ecosystem.
                  </p>
                </div>
              </div>
            </li>
            <li className="accordion block ">
              <div className="acc-btn">
                <span>QA: 02</span> How can users participate in the ICO?
              </div>
              <div className="acc_body ">
                <div className="content">
                  <p>
                    Users can participate by connecting their crypto wallet and purchasing tokens during the token sale period. Payments are usually made using cryptocurrencies such as BTC or ETH.
                  </p>
                </div>
              </div>
            </li>
            <li className="accordion block ">
              <div className="acc-btn">
                <span>QA: 03</span> What is the purpose of the project token?
              </div>
              <div className="acc_body ">
                <div className="content">
                  <p>
                    The project token is used within the platform for transactions, rewards, and accessing certain features of the ecosystem. It helps power the decentralized platform and encourages community participation.
                  </p>
                </div>
              </div>
            </li>
            <li className="accordion block ">
              <div className="acc-btn">
                <span>QA: 04</span> How is the platform secured?
              </div>
              <div className="acc_body ">
                <div className="content">
                  <p>
                    The platform uses blockchain technology and smart contracts to ensure transparency, security, and trust in transactions. All token transactions are recorded on the blockchain.
                  </p>
                </div>
              </div>
            </li>
            <li className="accordion block ">
              <div className="acc-btn">
                <span>QA: 05</span> What are the benefits of investing in this project?
              </div>
              <div className="acc_body ">
                <div className="content">
                  <p>
                  Investors who participate early in the project may benefit from potential token value growth and access to platform features. Early supporters also help the project grow and expand its blockchain ecosystem.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="faq__sec-shape">
        <div className="shape shape-1">
          <img src="assets/img/shape/s_shape1.png" alt="" />
        </div>
        <div className="shape shape-2">
          <img src="assets/img/shape/s_shape2.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Faq;
