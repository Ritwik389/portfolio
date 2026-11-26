"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

/* Illustrative waveforms (generated, not model output): one overlapping
   mixture that splits into five speaker tracks. */

const SPEAKERS = 5;
const BARS = 72;

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

export default function VoiceSepVisual() {
  const [separated, setSeparated] = useState(true);
  const tracks = useMemo(() => {
    const rand = rng(5150);
    return Array.from({ length: SPEAKERS }, (_, s) => {
      const segments: [number, number][] = [];
      let t = Math.floor(rand() * 8);
      while (t < BARS) {
        const len = 6 + Math.floor(rand() * 12);
        segments.push([t, Math.min(BARS, t + len)]);
        t += len + 4 + Math.floor(rand() * 16);
      }
      return Array.from({ length: BARS }, (_, i) => {
        const on = segments.some(([a, b]) => i >= a && i < b);
        const env = on ? 0.35 + rand() * 0.65 : rand() * 0.06;
        return Math.max(0.04, env * (0.6 + 0.4 * Math.sin((i + s * 3) * 0.9) ** 2));
      });
    });
  }, []);
  const mixture = useMemo(
    () => Array.from({ length: BARS }, (_, i) => Math.min(1, tracks.reduce((sum, track) => sum + track[i] * 0.55, 0))),
    [tracks],
  );

  return (
    <div className="vs" data-separated={separated}>
      <div className="vs-head">
        <span className="vs-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="vs-title">voicesep · workspace</span>
        <button type="button" className="vs-toggle" aria-pressed={separated} onClick={() => setSeparated(!separated)}>
          {separated ? "Show mixture" : "Separate voices"}
        </button>
      </div>
      <div className="vs-rows" role="img" aria-label={separated ? "Five separated speaker tracks (illustration)" : "One overlapping five-speaker mixture (illustration)"}>
        <div className="vs-row vs-mix">
          <span className="vs-label">mix</span>
          <div className="vs-wave">
            {mixture.map((v, i) => (
              <motion.i key={i} animate={{ scaleY: v }} initial={false} transition={{ duration: 0.3 }} />
            ))}
          </div>
        </div>
        {tracks.map((track, s) => (
          <div className={`vs-row vs-s${s}`} key={s}>
            <span className="vs-label">spk {s + 1}</span>
            <div className="vs-wave">
              {track.map((v, i) => (
                <motion.i
                  key={i}
                  initial={false}
                  animate={{ scaleY: separated ? v : 0.03, opacity: separated ? 1 : 0.35 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: separated ? s * 0.05 + i * 0.002 : 0 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="vs-foot">
        <span>EN + HI</span>
        <span>8 kHz · TF-Locoformer ×5</span>
        <span>illustration</span>
      </p>
    </div>
  );
}
