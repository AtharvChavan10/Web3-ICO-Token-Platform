import React from "react";

const brandPartners = [
  { id: 1, name: "Ethereum Foundation", logo: "eth_logo.svg" },
  { id: 2, name: "OpenZeppelin", logo: "oz_logo.svg" },
  { id: 3, name: "Chainlink", logo: "chainlink_logo.svg" },
  { id: 4, name: "MetaMask", logo: "metamask_logo.svg" },
  { id: 5, name: "Truffle Suite", logo: "truffle_logo.svg" },
  { id: 6, name: "Hardhat", logo: "hardhat_logo.svg" },
];

const Brand = () => {
  return (
    <section className="brand pos-rel py-100">
      <div className="container">
        <div className="sec-title text-center mb-70">
          <h5 className="sec-title__subtitle">OUR PARTNERS & TECHNOLOGIES</h5>
          <h2 className="sec-title__title">Trusted by Industry Leaders</h2>
          <p>Built with cutting-edge blockchain technologies and industry-standard tools</p>
        </div>

        <div className="brand__wrap ul_li_center">
          {brandPartners.map((brand) => (
            <div className="brand__item text-center" key={brand.id}>
              <img
                src={`assets/img/brand/${brand.logo}`}
                alt={brand.name}
                title={brand.name}
              />
              <p className="brand__name">{brand.name}</p>
            </div>
          ))}
        </div>

        <div className="brand__features mt-70">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="feature-box">
                <h4>🔒 Secure Smart Contracts</h4>
                <p>Built with OpenZeppelin standards and thoroughly tested</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-box">
                <h4>⚡ Fast Transactions</h4>
                <p>Optimized for speed and low gas fees on Ethereum</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-box">
                <h4>🌐 Global Accessibility</h4>
                <p>Available worldwide with support for multiple wallets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="brand__shape">
        <div className="shape shape-1">
          <img src="assets/img/shape/b_shape1.png" alt="" />
        </div>
        <div className="shape shape-2">
          <img src="assets/img/shape/b_shape2.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Brand;
