import React from "react";

const partners = [
  "Ethereum",
  "OpenZeppelin",
  "RainbowKit",
  "Wagmi",
  "MetaMask",
  "WalletConnect",
  "Ethers.js",
  "Sepolia",
];

const Brand = () => {
  const loop = [...partners, ...partners];

  return (
    <section className="brand-band" id="partners">
      <div className="container">
        <div className="sec-title text-center mb-40">
          <h5 className="sec-title__subtitle">Stack</h5>
          <h2 className="sec-title__title">The tools under the sale</h2>
        </div>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {loop.map((name, index) => (
            <span key={`${name}-${index}`}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brand;
