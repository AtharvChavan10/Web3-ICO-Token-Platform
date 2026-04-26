import React, { useState } from "react";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialLinkedin,
  TiSocialInstagram,
  TiSocialGithub,
} from "react-icons/ti";
import { IoCloudDownload } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      return;
    }

    setSubscribed(true);
    setEmail("");

    // Hide message after a few seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer
      className="site-footer footer__ico pos-rel"
      style={{
        backgroundImage: "url(/assets/img/bg/footer_bg.png)",
      }}
    >
      <div className="container">
        <div className="row mt-none-30">
          <div className="col-lg-4 mt-30">
            <div className="footer__widget footer__subscribe">
              <h2>Subscribe to our newsletter</h2>
              <p>
              Get the latest updates about our ICO, platform development, token listings, and exclusive community announcements. Join our mailing list and never miss an important update.
              </p>

              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email."
                />
                <button type="submit">
                  <IoIosSend />
                </button>
              </form>

              {subscribed && (
                <p className="subscribe-message">Thanks for subscribing!</p>
              )}
            </div>
          </div>

          <div className="col-lg-8 mt-30">
            <div className="footer__widget text-lg-end">
              <h2>Download Documents</h2>
              <p>Access important information about our project, including technical details, policies, and token sale information.</p>

              <div className="footer__document ul_li_right">
                <a href="#" className="footer__document-item text-center">
                  <div className="icon">
                    <img src="assets/img/icon/pdf.svg" alt="" />
                  </div>
                  <span className="title">
                    <IoCloudDownload className="mr-5" />
                    White Paper
                  </span>
                </a>
                <a href="#" className="footer__document-item text-center">
                  <div className="icon">
                    <img src="assets/img/icon/pdf.svg" alt="" />
                  </div>
                  <span className="title">
                    <IoCloudDownload className="mr-5" />
                    One Pager
                  </span>
                </a>
                <a href="#" className="footer__document-item text-center">
                  <div className="icon">
                    <img src="assets/img/icon/pdf.svg" alt="" />
                  </div>
                  <span className="title">
                    <IoCloudDownload className="mr-5" />
                    Privacy Policy
                  </span>
                </a>

                <a href="#" className="footer__document-item text-center">
                  <div className="icon">
                    <img src="assets/img/icon/pdf.svg" alt="" />
                  </div>
                  <span className="title">
                    <IoCloudDownload className="mr-5" />
                    Terms of Sale
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom ul_li_between mt-50">
          <div className="footer__logo mt-20">
            <a href="#">
              <img src="assets/img/logo/logo.svg" alt="" />
            </a>
          </div>

          <ul className="footer__social ul_li mt-20">
            <li>
              <a href="#">
                <TiSocialFacebook />
              </a>
            </li>
            <li>
              <a href="#">
                <TiSocialTwitter />
              </a>
            </li>
            <li>
              <a href="#">
                <TiSocialTwitter />
              </a>
            </li>
            <li>
              <a href="#">
                <TiSocialInstagram />
              </a>
            </li>
            <li>
              <a href="#">
                <TiSocialGithub />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__copyright mt-35">
        <div className="container">
          <div className="footer__copyright-inner ul_li_between">
            <div className="footer__copyright-text mt-15">
              Copyright 2025-26, ICO Web3 Token Platform all rights reserved.
              <br />
              Academic Blockchain Project.
            </div>


            <ul className="footer__links ul_li_right mt-15">
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Cookies</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__icon-shape">
        <div className="icon icon--1">
          <div>
            <img src="assets/img/shape/f_icon1.png" alt="" />
          </div>
        </div>

        <div className="icon icon--2">
          <div>
            <img src="assets/img/shape/f_icon2.png" alt="" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
