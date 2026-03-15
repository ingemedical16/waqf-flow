"use client";

import { useEffect, useState } from "react";

export default function LaylatAdmin() {
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/alihssani/laylat/get")
      .then(res => res.json())
      .then(data => setAmount(data.amount));
  }, []);

  const updateAmount = async () => {
    if (amount === null) return;

    setLoading(true);
    setSuccess(false);

    await fetch("/api/alihssani/laylat/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem"
    }}>
      <h1 style={{ fontSize: "2rem" }}>
        Laylat Al Qadr – Admin
      </h1>

      {amount !== null && (
        <>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{
              fontSize: "2rem",
              padding: "1rem",
              width: "300px",
              textAlign: "center"
            }}
          />

          <button
            onClick={updateAmount}
            disabled={loading}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              background: "#22c55e",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {loading ? "Updating..." : "Update Amount"}
          </button>

          {success && (
            <p style={{ color: "#22c55e" }}>
              Updated successfully
            </p>
          )}
        </>
      )}
    </div>
  );
}