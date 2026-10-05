import React from "react";

const Loader = () => {
  return (
    <div className="custom-loader-wrapper" role="status" aria-live="polite">
      <div className="loader-card">
        <div className="custom-loader" />
        <p>Waiting for the wallet…</p>
      </div>
    </div>
  );
};

export default Loader;
