import React from "react";
import Reveal from "./Reveal";

const phases = [
  {
    phase: "01",
    when: "Q1 2025",
    title: "Contracts",
    text: "ERC-20 token and the sale contract. Buys use Sepolia faucet ETH, not real ETH.",
    state: "Done",
  },
  {
    phase: "02",
    when: "Q3 2025",
    title: "Wallet app",
    text: "Buy flow, KYC gate, investor desk, and owner tools on the same frontend.",
    state: "Done",
  },
  {
    phase: "03",
    when: "Q1 2026",
    title: "Public round",
    text: "The sale is open. Price, supply, and purchases read live from the contract.",
    state: "Live",
  },
  {
    phase: "04",
    when: "Q4 2026",
    title: "After the round",
    text: "Staking, a wider treasury view, and a second network if the round holds.",
    state: "Next",
  },
];

const Roadmap = () => {
  return (
    <section id="roadmap" className="roadmap-band">
      <div className="container">
        <Reveal>
          <div className="sec-title text-center mb-70">
            <h5 className="sec-title__subtitle">Roadmap</h5>
            <h2 className="sec-title__title">From contract to public sale</h2>
          </div>
        </Reveal>
        <div className="phase-list">
          {phases.map((item, index) => (
            <Reveal key={item.phase} delay={index * 80}>
              <article className={`phase-card phase-card--${item.state.toLowerCase()}`}>
                <div className="phase-card__top">
                  <span>{item.phase}</span>
                  <em>{item.state}</em>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <small>{item.when}</small>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
