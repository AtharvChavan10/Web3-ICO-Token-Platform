import React from "react";

const About = () => {
  return (
    <section id="about" className="about pos-rel pb-140">
      <div className="container">
        <div className="row align-items-center mt-none-30">
          <div className="col-lg-6 mt-30">
            <div className="about__img pos-rel wow fadeInLeft">
              <img src="assets/img/logo/logo.svg" alt="" />
              <div className="about__shape">
                <img src="assets/img/icon/s_01.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-30">
            <div
              className="about__content wow fadeInRight"
              data-wow-delay="100ms"
            >
              <div className="sec-title mb-35">
                <h5 className="sec-title__subtitle">WHAT IS ICO CRYPTO</h5>
                <h2 className="sec-title__title mb-25">
                  Initial Coin Offering (ICO) is a fundraising method used by blockchain projects to raise capital by selling digital tokens to investors. These tokens can represent utility, access to a platform, or future value within the ecosystem.
                </h2>
                <p>
                Through an ICO, early supporters can invest in a project before it launches publicly. The funds raised are used to develop the platform, expand the ecosystem, and bring innovative blockchain solutions to the market.

Our ICO focuses on building a transparent, decentralized platform where investors and users can participate in the growth of the ecosystem while benefiting from token rewards and future utility.
                </p>
              </div>

              <ul className="about__list ul_li">
                <li>
                  <img src="assets/img/icon/a_arrow.svg" alt="" />
                  Decentralized Platform
                </li>
                <li>
                  <img src="assets/img/icon/a_arrow.svg" alt="" />
                  Rewards Meachanism
                </li>
                <li>
                  <img src="assets/img/icon/a_arrow.svg" alt="" />
                  Crowd Wisdom
                </li>
                <li>
                  <img src="assets/img/icon/a_arrow.svg" alt="" />
                  Investor Protection
                </li>
                <li>
                  <img src="assets/img/icon/a_arrow.svg" alt="" />
                  Token Sale Phases
                </li>
                <li>
                  <img src="assets/img/icon/a_arrow.svg" alt="" />
                  Exchange Listing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="about__sec-shape">
        <img src="assets/img/icon/s_02.svg" alt="" />
      </div>
    </section>
  );
};

export default About;
