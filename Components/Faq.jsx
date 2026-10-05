import React, { useState } from "react";
import Reveal from "./Reveal";

const items = [
  {
    q: "What is an ICO?",
    a: "An initial coin offering is a way for a blockchain project to raise funds by selling a token. Here, that sale uses Sepolia, an Ethereum test network, and faucet ETH.",
  },
  {
    q: "How do I buy?",
    a: "Connect a wallet, complete KYC, and sign the confirmation in that wallet. Then enter how many tokens you want. The app calculates the ETH cost and sends it with the purchase.",
  },
  {
    q: "Which network is this on?",
    a: "Sepolia, an Ethereum test network. Get faucet ETH, and keep the wallet on Sepolia. Real ETH is not accepted.",
  },
  {
    q: "Why is KYC required?",
    a: "A purchase stays locked until the connected wallet signs the identity check. That approval is saved in this browser for that wallet only.",
  },
  {
    q: "Where do the tokens go?",
    a: "The sale contract transfers the ERC-20 tokens to the wallet that paid. You can also add the token to MetaMask from the hero.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="faq pos-rel pt-140 pb-105">
      <div className="container">
        <Reveal>
          <div className="sec-title text-center mb-35">
            <h5 className="sec-title__subtitle">FAQ</h5>
            <h2 className="sec-title__title">Questions before you sign</h2>
          </div>
        </Reveal>
        <div className="faq-list">
          {items.map((item, index) => {
            const active = open === index;
            return (
              <Reveal key={item.q} delay={index * 40}>
                <button
                  type="button"
                  className={`faq-item ${active ? "is-open" : ""}`}
                  onClick={() => setOpen(active ? -1 : index)}
                  aria-expanded={active}
                >
                  <span className="faq-item__q">
                    <em>0{index + 1}</em>
                    {item.q}
                    <i>{active ? "–" : "+"}</i>
                  </span>
                  <span className="faq-item__a">
                    <span>{item.a}</span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
