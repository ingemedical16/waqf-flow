"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";

const EID_START = new Date("2026-03-19T12:00:00");
const PRAYER_TIME = new Date("2026-03-20T08:00:00");
const AFTER_PRAYER = new Date("2026-03-20T10:00:00");
const TARGET_VOLUME = 0.7;

export default function Page() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mode, setMode] = useState<"before" | "countdown" | "prayer" | "after">("before");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const updateLogic = () => {
      const now = new Date();

      if (now < EID_START) {
        setMode("before");
      } else if (now >= EID_START && now < PRAYER_TIME) {
        setMode("countdown");

        const diff = PRAYER_TIME.getTime() - now.getTime();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        setTimeLeft(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        );
      } else if (now >= PRAYER_TIME && now < AFTER_PRAYER) {
        setMode("prayer");
      } else {
        setMode("after");
      }
    };

    updateLogic();
    const interval = setInterval(updateLogic, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startAudio = async () => {
      try {
        audio.muted = true;
        await audio.play();
        audio.muted = false;
        audio.volume = TARGET_VOLUME;
      } catch {
        setTimeout(startAudio, 2000);
      }
    };

    if (mode === "countdown") startAudio();
    else audio.pause();

  }, [mode]);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/takbir.mp3" loop preload="auto" playsInline />

      <div className={styles.stars}></div>
      <div className={styles.mosque}></div>

      <div className={styles.content}>

        {mode === "countdown" && (
          <>
            <h1 className={styles.title}>تكبيرات العيد</h1>

            <div className={styles.arabic}>
              الله أكبر، الله أكبر، الله أكبر، لا إله إلا الله،
              <br />
              الله أكبر، الله أكبر، ولله الحمد
            </div>

            <div className={styles.phonetic}>
              Allahou Akbar, Allahou Akbar, Allahou Akbar,
              Lâ ilâha illa Allah,
              <br />
              Allahou Akbar, Allahou Akbar, wa lillâhi al-hamd
            </div>

            <div className={styles.countdown}>
              صلاة العيد بعد:
              <div className={styles.timer}>{timeLeft}</div>
            </div>
          </>
        )}

        {mode === "prayer" && (
          <div className={styles.prayerNow}>
            🕌 حان الآن وقت صلاة العيد
          </div>
        )}

        {mode === "after" && (
          <div className={styles.after}>
            🎉 تقبل الله منا ومنكم صالح الأعمال 🎉
          </div>
        )}

      </div>
    </div>
  );
}