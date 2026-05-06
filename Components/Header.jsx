import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = ({
  setOwnerModel,
  ownerModel,
  detail,
  currency,
  openAdmin,
  openTools,
  isAdmin,
}) => {
  const headerClass = `site-header ico-header ${isAdmin ? "admin-page-header" : "header--transparent"}`;

  return (
    <header className={headerClass}>
      <div className="header__main-wrap">
        <div className="container mxw_1640">
          <div className="header__main ul_li_between">
            <div className="header__left ul_li">
              <div className="header__logo">
                <a href="/">
                  <img src="assets/img/logo/logo.svg" alt="Logo" />
                </a>
              </div>
            </div>

            <div className="main-menu__wrap ul_li navbar navbar-expand-xl">
              <nav className="main-menu collapse navbar-collapse">
                <ul>
                  <li className="active has-mega-menu">
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/#about" className="scrollspy-btn">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/#faq" className="scrollspy-btn">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" className="scrollspy-btn">
                      Contact
                    </Link>
                  </li>
                  {typeof setOwnerModel === "function" && (
                    <li>
                      <a
                        className="scrollspy-btn"
                        style={{ cursor: "pointer" }}
                        onClick={openTools ?? (() => setOwnerModel(!ownerModel))}
                      >
                        Tools
                      </a>
                    </li>
                  )}
                  <li>
                    <Link href="/investor">Investor</Link>
                  </li>
                  <li>
                    <button
                      className="header-admin-btn"
                      onClick={openAdmin}
                      title="Admin Dashboard"
                    >
                      Admin
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* <div className="header__account">
              {isConnected ? (
                <div>
                  {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
                  {address && (
                    <div>{ensName ? `${ensName} (${address})` : address}</div>
                  )}
                  <button onClick={() => disconnect()}>Disconnect</button>
                </div>
              ) : (
                <>
                  {connectors.map((connector) => (
                    <div key={connector.id} className="header__account">
                      <a
                        onClick={() => connect({ connector })}
                        style={{ cursor: "pointer" }}
                      >
                        {connector.name}
                      </a>
                    </div>
                  ))}
                </>
              )}
            </div> */}

            <div className="header__action ul_li">
              <div className="d-xl-none">
                <a className="header__bar hamburger_menu">
                  <div className="header__bar-icon">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </a>
              </div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
