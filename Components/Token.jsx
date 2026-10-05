import React, { useState } from "react";
import Reveal from "./Reveal";

const funding = [
  { label: "Development", value: 40, color: "#6d4dff" },
  { label: "Ecosystem", value: 20, color: "#22d3ee" },
  { label: "Marketing", value: 15, color: "#f5b942" },
  { label: "Operations", value: 15, color: "#7c8cff" },
  { label: "Legal", value: 10, color: "#ff7a59" },
];

const allocation = [
  { label: "Public sale", value: 40, color: "#6d4dff" },
  { label: "Liquidity", value: 20, color: "#22d3ee" },
  { label: "Team", value: 15, color: "#f5b942" },
  { label: "Treasury", value: 15, color: "#7c8cff" },
  { label: "Reserve", value: 10, color: "#ff7a59" },
];

const donut = (slices, active = 0) => {
  let cursor = 0;
  const stops = slices
    .map((slice, index) => {
      const start = cursor;
      cursor += slice.value;
      const color = index === active ? slice.color : "rgba(255,255,255,0.14)";
      return `${color} ${start}% ${cursor}%`;
    })
    .join(", ");
  return `conic-gradient(${stops})`;
};

const Token = ({ onBuy }) => {
  const [tab, setTab] = useState("funding");
  const [active, setActive] = useState(0);
  const slices = tab === "funding" ? funding : allocation;
  const focus = slices[active] || slices[0];

  const switchTab = (next) => {
    setTab(next);
    setActive(0);
  };

  return (
    <section className="token pt-125" id="token">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <Reveal>
              <div className="token__content">
                <div className="sec-title mb-20">
                  <h5 className="sec-title__subtitle">Tokenomics</h5>
                  <h2 className="sec-title__title">Where the round is pointed</h2>
                </div>
                <div className="token-switch" role="tablist">
                  <button
                    type="button"
                    className={tab === "funding" ? "is-on" : ""}
                    onClick={() => switchTab("funding")}
                  >
                    Funding
                  </button>
                  <button
                    type="button"
                    className={tab === "token" ? "is-on" : ""}
                    onClick={() => switchTab("token")}
                  >
                    Allocation
                  </button>
                </div>
                <p className="token-copy">
                  Supply is split so the product, liquidity, and the public round
                  can move together. The live sale price still comes from the contract.
                </p>
                <button type="button" className="thm-btn" onClick={onBuy}>
                  Buy now
                </button>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-7">
            <Reveal delay={100}>
              <div className="token-panel" style={{ "--glow": focus.color }}>
                <div className="donut" style={{ background: donut(slices, active), "--glow": focus.color }}>
                  <div className="donut__hole" key={tab}>
                    <strong>{focus.value}%</strong>
                    <span>{focus.label}</span>
                  </div>
                </div>
                <ul className="slice-list">
                  {slices.map((slice, index) => (
                    <li key={slice.label}>
                      <button
                        type="button"
                        className={index === active ? "is-on" : ""}
                        style={{ "--slice": slice.color }}
                        onClick={() => setActive(index)}
                        onMouseEnter={() => setActive(index)}
                      >
                        <i style={{ background: slice.color }} />
                        <span>{slice.label}</span>
                        <strong>{slice.value}%</strong>
                        <em className="slice-meter" aria-hidden="true">
                          <b style={{ width: `${slice.value}%` }} />
                        </em>
                      </button>
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

export default Token;
