import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import SideBar from "./SideBar";
import { isAdminWallet } from "../context/constants";

const Header = ({
  setOwnerModel,
  ownerModel,
  openAdmin,
  openTools,
  isAdmin,
}) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { address } = useAccount();
  const showAdmin = !address || isAdminWallet(address);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goAdmin = () => {
    if (typeof openAdmin === "function") openAdmin();
    else window.location.href = "/admin";
  };

  const headerClass = `site-header ico-header ${
    isAdmin ? "admin-page-header" : "header--transparent"
  } ${scrolled ? "is-stuck" : ""}`;

  return (
    <>
      <header className={headerClass}>
        <div className="header__main-wrap">
          <div className="container mxw_1640">
            <div className="header__main ul_li_between">
              <div className="header__left ul_li">
                <div className="header__logo">
                  <Link href="/">
                    <img src="/assets/img/logo/logo.svg" alt="ICO logo" />
                  </Link>
                </div>
              </div>

              <div className="main-menu__wrap ul_li navbar navbar-expand-xl">
                <nav className="main-menu collapse navbar-collapse">
                  <ul>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/#about">About</Link>
                    </li>
                    <li>
                      <Link href="/#token">Token</Link>
                    </li>
                    <li>
                      <Link href="/#roadmap">Roadmap</Link>
                    </li>
                    <li>
                      <Link href="/#team">Team</Link>
                    </li>
                    <li>
                      <Link href="/#faq">FAQ</Link>
                    </li>
                    <li>
                      <Link href="/#contact">Contact</Link>
                    </li>
                    {typeof setOwnerModel === "function" && (
                      <li>
                        <button
                          type="button"
                          className="nav-text-btn"
                          onClick={openTools ?? (() => setOwnerModel(!ownerModel))}
                        >
                          Tools
                        </button>
                      </li>
                    )}
                    <li>
                      <Link href="/investor">Investor</Link>
                    </li>
                    {showAdmin && (
                      <li>
                        <button type="button" className="header-admin-btn" onClick={goAdmin}>
                          Admin
                        </button>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>

              <div className="header__action ul_li">
                <ConnectButton />
                <div className="d-xl-none">
                  <button
                    type="button"
                    className={`header__bar hamburger_menu ${open ? "is-active" : ""}`}
                    aria-label="Open menu"
                    onClick={() => setOpen(true)}
                  >
                    <div className="header__bar-icon">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SideBar
        open={open}
        onClose={() => setOpen(false)}
        openTools={openTools}
        setOwnerModel={setOwnerModel}
        ownerModel={ownerModel}
        goAdmin={goAdmin}
        showAdmin={showAdmin}
      />
    </>
  );
};

export default Header;
