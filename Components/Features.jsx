import React from "react";

const featuresList = [
  {
    id: 1,
    icon: "f_01.svg",
    title: "Secure Transactions",
    description: "Bank-level security with blockchain technology ensuring every transaction is immutable and transparent.",
  },
  {
    id: 2,
    icon: "f_02.svg",
    title: "Investment Opportunities",
    description: "Participate in innovative blockchain projects and earn potential returns through token appreciation.",
  },
  {
    id: 3,
    icon: "f_03.svg",
    title: "Lifetime Free Transactions",
    description: "No hidden fees - enjoy low transaction costs with transparent pricing for all users.",
  },
  {
    id: 4,
    icon: "f_04.svg",
    title: "Advanced Security",
    description: "Multi-signature wallets, two-factor authentication, and KYC verification for maximum protection.",
  },
  {
    id: 5,
    icon: "f_01.svg",
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist with any questions or issues you may have.",
  },
  {
    id: 6,
    icon: "f_02.svg",
    title: "Global Access",
    description: "Access the platform from anywhere in the world with full support for multiple cryptocurrencies.",
  },
];

const Features = () => {
  return (
    <section className="features pos-rel pb-150 mb-0-pb">
      <div className="container">
        <div className="sec-title text-center mb-95">
          <h5 className="sec-title__subtitle">WHY CHOOSE US</h5>
          <h2 className="sec-title__title mb-25">Why choose our token?</h2>
          <p>Comprehensive features designed for security, transparency, and growth</p>
        </div>

        <div className="feature__wrap pos-rel ul_li_between">
          {featuresList.map((feature) => (
            <div className="feature__item text-center" key={feature.id}>
              <div className="icon">
                <img src={`assets/img/icon/${feature.icon}`} alt={feature.title} />
              </div>
              <h4>{feature.title}</h4>
              <p className="feature__desc">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="feature__line-shape">
          <img src="assets/img/shape/f_shape.png" alt="" />
        </div>
      </div>

      <div className="feature__sec-shape">
        <img src="assets/img/shape/s_shape1.png" alt="" />
      </div>
    </section>
  );
};

export default Features;
