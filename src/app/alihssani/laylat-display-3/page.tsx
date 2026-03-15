"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./laylat-display.module.scss";

const DONATIONS = [10, 20, 50, 100, 200, 500];

function randomDonation() {
  return DONATIONS[Math.floor(Math.random() * DONATIONS.length)];
}

function randomDelay() {
  return 1500 + Math.random() * 2500;
}

export default function LaylatDisplay() {
  const [realAmount, setRealAmount] = useState(141500);
  const [displayed, setDisplayed] = useState(141500);
  const [target, setTarget] = useState(301400);
  const [currentMessage, setCurrentMessage] = useState(0);

  const timer = useRef<NodeJS.Timeout | null>(null);

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

  // Simulate increasing until realAmount
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

  // Rotate messages every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const percent = Math.min((displayed / target) * 100, 100);

  return (
    <div className={styles.tvContainer}>
      <div className={styles.stars} />
      <div className={styles.crescent} />

      <h1 className={styles.arabicTitle}>
        ليلة القدر المباركة
      </h1>

      <div className={styles.message}>
        <div className={styles.messageContent}>
          <p className={styles.messageAr}>
            {messages[currentMessage].arabic}
          </p>
          <p className={styles.messageFr}>
            {messages[currentMessage].french}
          </p>
        </div>
      </div>

      <div className={styles.counter}>
        {displayed.toLocaleString()} €
      </div>

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
  );
}