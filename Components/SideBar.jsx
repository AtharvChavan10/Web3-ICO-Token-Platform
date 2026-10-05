import React from "react";
import Link from "next/link";

const SideBar = ({ open, onClose, openTools, setOwnerModel, ownerModel, goAdmin, showAdmin }) => {
  const openOwnerTools = () => {
    onClose?.();
    if (typeof openTools === "function") {
      openTools();
      return;
    }
    if (typeof setOwnerModel === "function") {
      setOwnerModel(!ownerModel);
      return;
    }
    window.location.href = "/";
  };

  return (
    <>
      <div className={`nav-backdrop ${open ? "is-on" : ""}`} onClick={onClose} />
      <aside className={`mobile-drawer ${open ? "is-on" : ""}`} aria-hidden={!open}>
        <div className="mobile-drawer__head">
          <Link href="/" onClick={onClose}>
            <img src="/assets/img/logo/logo.svg" alt="ICO logo" />
          </Link>
          <button type="button" className="popup-close" onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav>
          <Link href="/" onClick={onClose}>Home</Link>
          <Link href="/#about" onClick={onClose}>About</Link>
          <Link href="/#token" onClick={onClose}>Token</Link>
          <Link href="/#roadmap" onClick={onClose}>Roadmap</Link>
          <Link href="/#team" onClick={onClose}>Team</Link>
          <Link href="/#faq" onClick={onClose}>FAQ</Link>
          <Link href="/#contact" onClick={onClose}>Contact</Link>
          <button type="button" onClick={openOwnerTools}>Tools</button>
          <Link href="/investor" onClick={onClose}>Investor</Link>
          {showAdmin && (
            <button type="button" onClick={() => { onClose?.(); goAdmin?.(); }}>Admin</button>
          )}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
