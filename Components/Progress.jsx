import React from "react";

const SAMPLE = {
  price: 0.001,
  sold: 184250,
  left: 815750,
};

const Progress = ({ detail, currency = "ETH" }) => {
  const live = Boolean(detail && !detail.offline);
  const price = Number(detail?.tokenPrice);
  const sold = live ? Number(detail?.soldTokens) || 0 : SAMPLE.sold;
  const available = live ? Number(detail?.tokenBal) || 0 : SAMPLE.left;
  const total = sold + available;
  const pct = total ? Math.min((sold / total) * 100, 100) : 0;
  const priceLabel =
    live && Number.isFinite(price) ? `${price} ${currency}` : `${SAMPLE.price} ${currency}`;

  const stats = [
    ["Price", priceLabel],
    ["Sold", sold.toLocaleString()],
    ["Left", available.toLocaleString()],
    ["Filled", `${pct.toFixed(1)}%`],
  ];

  return (
    <section className="pulse-band" aria-label="Sale progress">
      <div className="container">
        <div className="pulse-card">
          <div className="pulse-card__top">
            <span className={live ? "pulse-dot is-live" : "pulse-dot"} />
            <strong>{live ? "Live round" : "Sample round"}</strong>
            <span className="pulse-card__note">
              {live
                ? "Reading the sale contract on Sepolia."
                : "The chain is quiet, so this bar shows a sample of the round."}
            </span>
            <b>{pct.toFixed(1)}% filled</b>
          </div>
          <div className="pulse-meter" aria-hidden="true">
            <div className="pulse-meter__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="pulse-band__row">
            {stats.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Progress;
