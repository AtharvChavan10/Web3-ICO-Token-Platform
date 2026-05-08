import React from "react";

const Roadmap = () => {
  return (
    <section id="roadmap" className="roadmap pos-rel pt-140 pb-150">
      <div className="container">
        <div className="sec-title text-center mb-70">
          <h5 className="sec-title__subtitle">PROJECT TIMELINE</h5>
          <h2 className="sec-title__title">Our Project Roadmap</h2>
          <p>Follow our strategic development phases as we build the future of decentralized finance</p>
        </div>

        <div className="roadmap__wrap">
          <div className="roadmap__item">
            <div className="roadmap__number">Phase 1</div>
            <div className="roadmap__content">
              <h4>Foundation & Smart Contracts</h4>
              <p>Development and deployment of ERC-20 token and ICO smart contracts. Security audits and testing on testnet.</p>
              <ul className="roadmap__list">
                <li>✓ Smart contract development</li>
                <li>✓ Security audits</li>
                <li>✓ Testnet deployment</li>
                <li>✓ Documentation</li>
              </ul>
              <span className="roadmap__date">Q1 2024</span>
            </div>
          </div>

          <div className="roadmap__item">
            <div className="roadmap__number">Phase 2</div>
            <div className="roadmap__content">
              <h4>Frontend & Wallet Integration</h4>
              <p>Build responsive web interface with Web3 wallet integration, MetaMask support, and KYC verification system.</p>
              <ul className="roadmap__list">
                <li>✓ React frontend development</li>
                <li>✓ Wallet integration (MetaMask, WalletConnect)</li>
                <li>✓ KYC verification system</li>
                <li>✓ UI/UX optimization</li>
              </ul>
              <span className="roadmap__date">Q2 2024</span>
            </div>
          </div>

          <div className="roadmap__item">
            <div className="roadmap__number">Phase 3</div>
            <div className="roadmap__content">
              <h4>ICO Launch & Testing</h4>
              <p>Official ICO launch on mainnet with comprehensive user testing, support systems, and monitoring.</p>
              <ul className="roadmap__list">
                <li>✓ Mainnet deployment</li>
                <li>✓ Public ICO launch</li>
                <li>✓ 24/7 technical support</li>
                <li>✓ Real-time monitoring</li>
              </ul>
              <span className="roadmap__date">Q3 2024</span>
            </div>
          </div>

          <div className="roadmap__item">
            <div className="roadmap__number">Phase 4</div>
            <div className="roadmap__content">
              <h4>Platform Features & Expansion</h4>
              <p>Addition of advanced features including staking, governance tokens, and ecosystem expansion.</p>
              <ul className="roadmap__list">
                <li>→ Token staking mechanism</li>
                <li>→ Governance features</li>
                <li>→ Multi-chain support</li>
                <li>→ Mobile application</li>
              </ul>
              <span className="roadmap__date">Q4 2024+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
