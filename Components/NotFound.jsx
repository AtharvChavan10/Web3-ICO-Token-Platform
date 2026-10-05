import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1>This page drifted off-chain.</h1>
      <p>The link is missing, but the token sale is still live.</p>
      <Link href="/" className="thm-btn">
        Back to the sale
      </Link>
    </main>
  );
};

export default NotFound;
