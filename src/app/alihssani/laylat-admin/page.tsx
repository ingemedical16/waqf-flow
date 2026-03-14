"use client";

import { useState } from "react";

export default function LaylatAdmin() {
  const [amount, setAmount] = useState("");
  const [target, setTarget] = useState("");

  const update = async () => {
    await fetch("/api/alihssani/laylat/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        target: Number(target),
      }),
    });

    alert("Updated");
  };

  return (
    <div style={{ padding: "4rem" }}>
      <h1>Admin – Laylat Counter</h1>

      <input
        type="number"
        placeholder="Collected amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="Target"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <button onClick={update}>Update</button>
    </div>
  );
}
