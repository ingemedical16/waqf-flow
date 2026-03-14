"use client";

import { useEffect, useState, useRef } from "react";

const DONATIONS = [10, 20, 50, 100, 200, 500];

function randomDonation() {
  return DONATIONS[Math.floor(Math.random() * DONATIONS.length)];
}

function randomDelay() {
  return 1500 + Math.random() * 3000;
}

export default function LaylatDisplay() {
  const [realAmount, setRealAmount] = useState(141500);
  const [displayed, setDisplayed] = useState(141500);
  const [target, setTarget] = useState(301400);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const fetchReal = async () => {
    const res = await fetch("/api/alihssani/laylat/get");
    const data = await res.json();
    setRealAmount(data.amount);
    setTarget(data.target);
  };

  // Fetch real amount every 10 minutes
  useEffect(() => {
    fetchReal();
    const interval = setInterval(fetchReal, 600000);
    return () => clearInterval(interval);
  }, []);

  // Simulator logic
  useEffect(() => {
    if (displayed >= realAmount) return;

    const simulate = () => {
      setDisplayed((prev) => {
        const next = prev + randomDonation();
        if (next >= realAmount) return realAmount;
        return next;
      });

      timer.current = setTimeout(simulate, randomDelay());
    };

    timer.current = setTimeout(simulate, randomDelay());

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [realAmount, displayed]);

  const percent = Math.min((displayed / target) * 100, 100);

  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem" }}>
        ليلة القدر - مسجد الإحساني
      </h1>

      <h2 style={{ fontSize: "2rem" }}>
        Nuit du Destin – Mosquée Al Ihssani
      </h2>

      <div
        style={{
          marginTop: "4rem",
          height: "60px",
          background: "#eee",
          borderRadius: "40px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background:
              "linear-gradient(90deg,#15803d,#22c55e)",
            transition: "width 0.8s ease",
          }}
        />
      </div>

      <h2 style={{ marginTop: "2rem", fontSize: "4rem" }}>
        {displayed.toLocaleString()} €
      </h2>

      <p style={{ fontSize: "1.3rem" }}>
        Objectif : {target.toLocaleString()} €
      </p>
    </div>
  );
}
