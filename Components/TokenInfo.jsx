import React from "react";
import Reveal from "./Reveal";

const formatAmount = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

const SAMPLE = {
  supply: 1000000,
  sold: 184250,
  left: 815750,
  price: 0.001,
};

const TokenInfo = ({ detail, currency }) => {
  const unit = currency || "ETH";
  const live = Boolean(detail && !detail.offline);
  const symbol = live ? detail?.symbol || "" : "tokens";
  const supply = live ? Number(detail?.supply) : SAMPLE.supply;
  const sold = live ? Number(detail?.soldTokens) : SAMPLE.sold;
  const left = live ? Number(detail?.tokenBal) : SAMPLE.left;
  const price = live ? Number(detail?.tokenPrice) : SAMPLE.price;
  const market = supply * price;
  const raised = sold * price;

  const line = (value, suffix = "") => `${formatAmount(value)} ${suffix}`.trim();

  const rows = [
    ["Total supply", line(supply, symbol)],
    ["Sold", line(sold, symbol)],
    ["Still available", line(left, symbol)],
    ["Token price", line(price, unit)],
    ["Market value", line(market, unit)],
    ["Raised", line(raised, unit)],
  ];

  return (
    <section className="token-info pos-rel" id="sale">
      <div className="container">
        <Reveal>
          <div className="sec-title text-center mb-70">
            <h5 className="sec-title__subtitle">{live ? "Live sale" : "Sample round"}</h5>
            <h2 className="sec-title__title">
              {live ? "Numbers from the contract" : "What this round looks like"}
            </h2>
            {!live && (
              <p className="sale-note">
                The chain is quiet, so these figures match the sample bar above.
              </p>
            )}
          </div>
        </Reveal>
        <div className="info-grid">
          {rows.map(([label, value], index) => (
            <Reveal key={label} delay={index * 60}>
              <article className="info-card">
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TokenInfo;
