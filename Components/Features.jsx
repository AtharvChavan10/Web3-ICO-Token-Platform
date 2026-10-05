import React from "react";
import Reveal from "./Reveal";

const featuresList = [
  {
    id: 1,
    icon: "f_01.svg",
    title: "On-chain checkout",
    description: "Every purchase is a contract call. The price and the token transfer are public.",
  },
  {
    id: 2,
    icon: "f_02.svg",
    title: "Wallet native",
    description: "MetaMask and WalletConnect through RainbowKit. No custodial account.",
  },
  {
    id: 3,
    icon: "f_03.svg",
    title: "Clear pricing",
    description: "You see the ETH cost, your balance, and how many tokens are left before you sign.",
  },
  {
    id: 4,
    icon: "f_04.svg",
    title: "KYC gate",
    description: "Buying stays locked until the connected wallet signs the identity check.",
  },
  {
    id: 5,
    icon: "f_05.svg",
    title: "Owner controls",
    description: "The sale owner can update the token, the price, and withdraw unsold supply.",
  },
  {
    id: 6,
    icon: "f_02.svg",
    title: "Investor desk",
    description: "A separate dashboard for balance, sale progress, max buy, and history.",
  },
];

const Features = () => {
  return (
    <section className="features pos-rel pb-150 mb-0-pb" id="features">
      <div className="container">
        <Reveal>
          <div className="sec-title text-center mb-95">
            <h5 className="sec-title__subtitle">Why this sale</h5>
            <h2 className="sec-title__title mb-25">Built to be used, not just displayed</h2>
            <p>Six pieces that actually sit between your wallet and the contract.</p>
          </div>
        </Reveal>

        <div className="feature-grid">
          {featuresList.map((feature, index) => (
            <Reveal key={feature.id} delay={index * 70}>
              <article className="feature-card">
                <div className="icon">
                  <img src={`/assets/img/icon/${feature.icon}`} alt="" />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
