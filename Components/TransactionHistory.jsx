import React, { useContext, useState } from "react";
import { TOKEN_ICO_Context } from "../context/index";

const TransactionHistory = () => {
  const { transactions, getEtherscanLink, account } = useContext(TOKEN_ICO_Context);
  const [isOpen, setIsOpen] = useState(false);

  if (!account || transactions.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const formatHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#27ae60";
      case "pending":
        return "#f39c12";
      case "failed":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✓";
      case "pending":
        return "⏳";
      case "failed":
        return "✗";
      default:
        return "?";
    }
  };

  return (
    <div className="transaction-history-widget">
      <button
        className="tx-history-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 16px",
          backgroundColor: "#3C13D4",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          zIndex: 999,
          boxShadow: "0 4px 12px rgba(60, 19, 212, 0.3)",
        }}
      >
        📋 Transactions ({transactions.length})
      </button>

      {isOpen && (
        <div
          className="tx-history-modal"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "400px",
            maxHeight: "500px",
            backgroundColor: "white",
            border: "2px solid #3C13D4",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            overflow: "auto",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
              Transaction History
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ maxHeight: "420px", overflowY: "auto" }}>
            {transactions.map((tx, index) => (
              <div
                key={tx.id || index}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: getStatusColor(tx.status), fontSize: "16px" }}>
                      {getStatusIcon(tx.status)}
                    </span>
                    <span>{tx.type === "BUY_TOKEN" ? "Buy Tokens" : tx.type}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Amount: <strong>{tx.amount} tokens</strong>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Cost: <strong>{Number(tx.cost).toFixed(4)} ETH</strong>
                  </div>
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                    {formatDate(tx.timestamp)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginLeft: "12px" }}>
                  <a
                    href={getEtherscanLink(tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#3C13D4",
                      color: "white",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#2a0fa6")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#3C13D4")}
                  >
                    {formatHash(tx.hash)}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
