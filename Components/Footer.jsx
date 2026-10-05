import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { isAdminWallet } from "../context/constants";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialLinkedin,
  TiSocialInstagram,
  TiSocialGithub,
} from "react-icons/ti";

const docs = ["White paper", "One pager", "Privacy", "Terms of sale"];

const Footer = () => {
  const [email, setEmail] = useState("");
  const { address } = useAccount();
  const showAdmin = !address || isAdminWallet(address);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    const key = "ico-newsletter";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase());
      localStorage.setItem(key, JSON.stringify(list));
    }
    setEmail("");
    toast.success("You're on the list.");
  };

  return (
    <footer className="site-footer footer__ico pos-rel">
      <div className="container">
        <div className="row mt-none-30">
          <div className="col-lg-4 mt-30">
            <div className="footer__widget footer__subscribe">
              <h2>Sale notes</h2>
              <p>Round updates, contract changes, and listing news. No noise.</p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
                <button type="submit" aria-label="Subscribe">
                  →
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-8 mt-30">
            <div className="footer__widget text-lg-end">
              <h2>Documents</h2>
              <p>Project notes you can keep beside the contract address.</p>
              <div className="doc-row">
                {docs.map((doc) => (
                  <button
                    key={doc}
                    type="button"
                    className="doc-chip"
                    onClick={() => toast("This document opens with the next release.")}
                  >
                    {doc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom ul_li_between mt-50">
          <div className="footer__logo mt-20">
            <a href="/">
              <img src="/assets/img/logo/logo.svg" alt="ICO logo" />
            </a>
          </div>
          <ul className="footer__social ul_li mt-20">
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><TiSocialFacebook /></a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><TiSocialTwitter /></a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><TiSocialLinkedin /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><TiSocialInstagram /></a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><TiSocialGithub /></a></li>
          </ul>
        </div>
      </div>
      <div className="footer__copyright mt-35">
        <div className="container">
          <div className="footer__copyright-inner ul_li_between">
            <div className="footer__copyright-text mt-15">
              Copyright 2025–26 · Example by Atharv Chavan
            </div>
            <ul className="footer__links ul_li_right mt-15">
              <li><a href="/#about">About</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/investor">Investor</a></li>
              {showAdmin && <li><a href="/admin">Admin</a></li>}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
