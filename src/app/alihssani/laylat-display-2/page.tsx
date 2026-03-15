"use client";

import { useEffect, useState, useRef } from "react";

const DONATIONS = [10, 20, 50, 100, 200, 500];

function randomDonation() {
  return DONATIONS[Math.floor(Math.random() * DONATIONS.length)];
}

function randomDelay() {
  return 1500 + Math.random() * 2500;
}

export default function LaylatDisplay() {
  const [realAmount, setRealAmount] = useState(145500);
  const [displayed, setDisplayed] = useState(141500);
  const [target, setTarget] = useState(301400);

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
    <div className="tv-container">

      <div className="stars" />

      <h1 className="arabic-title">
        ليلة القدر المباركة
      </h1>

      <p className="hadith">
        قال رسول الله ﷺ :
        <br />
        "من قام ليلة القدر إيماناً واحتساباً
        غُفر له ما تقدم من ذنبه"
      </p>

      <div className="counter">
        {displayed.toLocaleString()} €
      </div>

      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="target">
        Objectif : {target.toLocaleString()} €
      </div>

      <div className="mosque">
        Mosquée Al Ihssani
      </div>

      <style jsx>{`
        .tv-container {
          min-height: 100vh;
          background: radial-gradient(circle at top, #064e3b, #021f1a);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          padding: 4rem;
        }

        /* Stars background */
        .stars {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.08;
          animation: starsMove 80s linear infinite;
        }

        @keyframes starsMove {
          from { transform: translateY(0); }
          to { transform: translateY(-200px); }
        }

        .arabic-title {
          font-size: 5rem;
          color: #facc15;
          text-shadow: 0 0 30px rgba(250,204,21,0.9);
          margin-bottom: 2rem;
        }

        .hadith {
          font-size: 2rem;
          max-width: 900px;
          line-height: 1.6;
          color: #bbf7d0;
          margin-bottom: 4rem;
        }

        .counter {
          font-size: 8rem;
          font-weight: bold;
          color: #fef9c3;
          text-shadow: 0 0 50px rgba(250,204,21,1);
          margin-bottom: 3rem;
          animation: pulse 2.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }

        .progress-wrapper {
          width: 75%;
          margin-bottom: 2rem;
        }

        .progress-bar {
          height: 90px;
          background: rgba(255,255,255,0.08);
          border-radius: 60px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.6);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #facc15, #22c55e);
          box-shadow: 0 0 40px #facc15;
          transition: width 1s ease;
        }

        .target {
          font-size: 2rem;
          color: #bbf7d0;
          margin-top: 1rem;
        }

        .mosque {
          position: absolute;
          bottom: 2rem;
          font-size: 1.5rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}