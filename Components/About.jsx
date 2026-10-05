import React from "react";
import Reveal from "./Reveal";

const About = () => {
  const points = [
    "Decentralized sale",
    "Rewards mechanism",
    "On-chain transparency",
    "Investor protection",
    "Phased token release",
    "Wallet-native checkout",
  ];

  return (
    <section id="about" className="about pos-rel pb-140">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <div className="about-stage">
                <div className="about-stage__ring" />
                <div className="about-stage__card">
                  <span>01</span>
                  <h3>Connect</h3>
                  <p>RainbowKit opens MetaMask or WalletConnect on Sepolia.</p>
                </div>
                <div className="about-stage__card about-stage__card--shift">
                  <span>02</span>
                  <h3>Verify</h3>
                  <p>A short KYC check is stored locally for this wallet.</p>
                </div>
                <div className="about-stage__card">
                  <span>03</span>
                  <h3>Buy</h3>
                  <p>ETH goes to the sale contract. Tokens come back to you.</p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={120}>
              <div className="about__content">
                <div className="sec-title mb-35">
                  <h5 className="sec-title__subtitle">What this ICO is</h5>
                  <h2 className="sec-title__title mb-25">
                    A public token sale you can join from your wallet.
                  </h2>
                  <p>
                    An initial coin offering lets a project raise funds by selling
                    a digital token before a wider launch. This platform wires that
                    flow end to end: the sale contract prices the token, accepts
                    ETH, and transfers the ERC-20 balance in the same transaction.
                  </p>
                </div>
                <ul className="about__list ul_li">
                  {points.map((item) => (
                    <li key={item}>
                      <img src="/assets/img/icon/a_arrow.svg" alt="" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
