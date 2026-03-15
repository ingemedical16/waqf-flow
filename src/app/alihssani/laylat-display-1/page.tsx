"use client";

import { useEffect, useState, useRef } from "react";

const DONATIONS = [10, 20, 50, 100, 200, 500];

function randomDonation() {
  return DONATIONS[Math.floor(Math.random() * DONATIONS.length)];
}

function randomDelay() {
  return 1200 + Math.random() * 2500;
}

export default function LaylatDisplay() {
  const [realAmount, setRealAmount] = useState(145500);
  const [displayed, setDisplayed] = useState(141500);
  const [target, setTarget] = useState(301400);
  const [popup, setPopup] = useState<number | null>(null);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const fetchReal = async () => {
    const res = await fetch("/api/alihssani/laylat/get");
    const data = await res.json();
    setRealAmount(data.amount);
    setTarget(data.target);
  };

  useEffect(() => {
    fetchReal();
    const interval = setInterval(fetchReal, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (displayed >= realAmount) return;

    const simulate = () => {
      const donation = randomDonation();

      setDisplayed((prev) => {
        const next = prev + donation;
        if (next >= realAmount) return realAmount;
        return next;
      });

      setPopup(donation);
      setTimeout(() => setPopup(null), 2000);

      timer.current = setTimeout(simulate, randomDelay());
    };

    timer.current = setTimeout(simulate, randomDelay());

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [realAmount, displayed]);

  const percent = Math.min((displayed / target) * 100, 100);

  return (
    <div className="container">
      <div className="stars" />
      <div className="crescent" />

      <h1 className="arabic">ليلة القدر المباركة</h1>
      <h2 className="french">Mosquée Al Ihssani</h2>

      <div className="bar">
        <div
          className="fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="amount">
        {displayed.toLocaleString()} €
      </div>

      <div className="target">
        Objectif : {target.toLocaleString()} €
      </div>

      {popup && (
        <div className="popup">
          + {popup} €
        </div>
      )}

      <style jsx>{`
        .container {
          position: relative;
          min-height: 100vh;
          background: radial-gradient(circle at top, #052e26, #021a15);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Stars */
        .stars {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.15;
          animation: moveStars 60s linear infinite;
        }

        @keyframes moveStars {
          from { transform: translateY(0); }
          to { transform: translateY(-200px); }
        }

        /* Crescent */
        .crescent {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle at 30% 30%, #facc15, #eab308);
          border-radius: 50%;
          box-shadow: 0 0 40px #facc15;
        }

        .crescent::after {
          content: "";
          position: absolute;
          top: 20px;
          left: 40px;
          width: 120px;
          height: 120px;
          background: #052e26;
          border-radius: 50%;
        }

        .arabic {
          font-size: 5rem;
          color: #facc15;
          text-shadow: 0 0 25px rgba(250,204,21,0.8);
        }

        .french {
          font-size: 2rem;
          margin-bottom: 3rem;
          color: #bbf7d0;
        }

        .bar {
          width: 70%;
          height: 80px;
          background: rgba(255,255,255,0.1);
          border-radius: 50px;
          overflow: hidden;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
        }

        .fill {
          height: 100%;
          background: linear-gradient(90deg, #facc15, #22c55e);
          box-shadow: 0 0 40px #facc15;
          transition: width 1s ease;
        }

        .amount {
          font-size: 7rem;
          font-weight: bold;
          margin-top: 3rem;
          color: #fef9c3;
          text-shadow: 0 0 40px rgba(250,204,21,0.9);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .target {
          font-size: 1.5rem;
          margin-top: 1rem;
          color: #bbf7d0;
        }

        .popup {
          position: absolute;
          bottom: 20%;
          font-size: 3rem;
          color: #22c55e;
          animation: floatUp 2s ease forwards;
        }

        @keyframes floatUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-150px); }
        }
      `}</style>
    </div>
  );
}