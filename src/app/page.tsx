"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./page.module.scss";

const DONATIONS = [10, 20, 50, 100, 200, 500];

const FAJR_HOUR = 5;
const FAJR_MINUTE = 15;

function randomDonation() {
  return DONATIONS[Math.floor(Math.random() * DONATIONS.length)];
}

function randomDelay() {
  return 120000 + Math.random() * 780000; // 2–15 minutes
}

export default function LaylatDisplay() {
  const [realAmount, setRealAmount] = useState(145500);
  const [displayed, setDisplayed] = useState(141500);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [target, setTarget] = useState(301400);
  const [currentMessage, setCurrentMessage] = useState(0);

  const simulateTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrame = useRef<number | null>(null);

  /* ================= SPIRITUAL MESSAGES ================= */

  const messages = [
    {
      arabic:
        "«من بنى لله مسجداً يبتغي به وجه الله بنى الله له مثله في الجنة»",
      french:
        "Celui qui construit une mosquée pour Allah, Allah lui construit l’équivalent au Paradis.",
    },
    {
      arabic:
        "«من قام ليلة القدر إيماناً واحتساباً غُفر له ما تقدم من ذنبه»",
      french:
        "Celui qui veille la Nuit du Destin avec foi et espérance verra ses péchés pardonnés.",
    },
    {
      arabic:
        "اللهم اجعل صدقاتهم نوراً لهم في قبورهم وبركةً في أرزاقهم وسبباً في رفع درجاتهم وبناءً لهم في الجنة",
      french:
        "Ô Allah, fais de leurs dons une lumière dans leurs tombes, une bénédiction dans leurs biens et une demeure au Paradis.",
    },
  ];

  /* ================= FETCH REAL DATA ================= */

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch("/api/alihssani/laylat/get", {
        cache: "no-store",
      });

      const data = await res.json();

      if (typeof data.amount === "number") {
        setRealAmount(data.amount);
        setTarget(data.target);

        // If first load → sync immediately
        setDisplayed((prev) => {
          if (prev === 0) {
            setAnimatedValue(data.amount);
            return data.amount;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  // Poll every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchLatest, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLatest]);

  /* ================= SIMULATOR ================= */

  useEffect(() => {
    if (realAmount <= displayed) return;

    const simulate = () => {
      setDisplayed((prev) => {
        if (prev >= realAmount) return realAmount;

        const next = prev + randomDonation();
        return next > realAmount ? realAmount : next;
      });

      simulateTimeout.current = setTimeout(
        simulate,
        randomDelay()
      );
    };

    simulateTimeout.current = setTimeout(
      simulate,
      randomDelay()
    );

    return () => {
      if (simulateTimeout.current)
        clearTimeout(simulateTimeout.current);
    };
  }, [realAmount]);

  /* ================= FAJR SYNC ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const fajr = new Date();

      fajr.setHours(FAJR_HOUR);
      fajr.setMinutes(FAJR_MINUTE);
      fajr.setSeconds(0);

      if (now >= fajr) {
        setDisplayed(realAmount);
        setAnimatedValue(realAmount);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [realAmount]);

  /* ================= SMOOTH COUNTER ================= */

  useEffect(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    const start = animatedValue;
    const end = displayed;
    const duration = 800;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);

      const easeOut = 1 - Math.pow(1 - percent, 3);
      const value = Math.floor(start + (end - start) * easeOut);

      setAnimatedValue(value);

      if (percent < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current)
        cancelAnimationFrame(animationFrame.current);
    };
  }, [displayed]);

  /* ================= ROTATE MESSAGES ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const percent =
    target > 0
      ? Math.min((animatedValue / target) * 100, 100)
      : 0;

  /* ================= RENDER ================= */

  return (
    <div className={styles.tvContainer}>
      <div className={styles.stars} />
      <div className={styles.crescent} />

      <div className={styles.topSection}>
        <h1 className={styles.arabicTitle}>
          ليلة القدر المباركة
        </h1>
      </div>

      <div className={styles.middleSection}>
        <div className={styles.message}>
          <p className={styles.messageAr}>
            {messages[currentMessage].arabic}
          </p>
          <p className={styles.messageFr}>
            {messages[currentMessage].french}
          </p>
        </div>

        <div className={styles.counter}>
          {animatedValue.toLocaleString()} €
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className={styles.target}>
          Objectif : {target.toLocaleString()} €
        </div>

        <div className={styles.mosque}>
          Mosquée Al Ihssani
        </div>
      </div>
    </div>
  );
}