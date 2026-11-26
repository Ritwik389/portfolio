"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";

/* Schematic of the failure mode described in the research: language-guided
   segmenters capture large, compact floes but miss dispersed ones.
   Procedurally generated. It is an illustration, not research data. */

type Floe = { d: string; cx: number; cy: number; r: number; small: boolean };

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function floe(cx: number, cy: number, r: number, rand: () => number, small: boolean): Floe {
  const n = small ? 7 : 11;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.72 + rand() * 0.42);
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * (0.8 + rand() * 0.25)).toFixed(1)}`);
  }
  return { d: `M${pts.join("L")}Z`, cx, cy, r, small };
}

const floes: Floe[] = (() => {
  const rand = rng(20261126);
  const big: [number, number, number][] = [
    [110, 105, 52],
    [330, 230, 62],
    [395, 85, 34],
  ];
  const list = big.map(([x, y, r]) => floe(x, y, r, rand, false));
  let guard = 0;
  while (list.filter((f) => f.small).length < 22 && guard++ < 800) {
    const x = 20 + rand() * 440, y = 30 + rand() * 280, r = 5 + rand() * 7;
    if (list.every((f) => Math.hypot(f.cx - x, f.cy - y) > f.r + r + 8)) list.push(floe(x, y, r, rand, true));
  }
  return list;
})();

const modes = [
  { id: "query", label: "Query", note: "A text query asks for the scattered floes in a radar scene." },
  { id: "typical", label: "Typical model", note: "Large compact floes are captured; small dispersed ones are missed. This is the main failure I found in current models." },
  { id: "target", label: "Goal", note: "What I’m working towards with the new model and RL reward: catch the scattered ones too." },
] as const;

export default function SeaIceFigure() {
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("typical");
  const uid = useId().replace(/:/g, "");
  const current = modes.find((m) => m.id === mode)!;
  const show = (f: Floe) => (mode === "target" ? true : mode === "typical" ? !f.small : false);
  const caught = floes.filter(show).length;

  return (
    <figure className="ice-figure">
      <div className="ice-head">
        <span className="ice-fig">FIG. 02 · schematic</span>
        <div className="seg" role="radiogroup" aria-label="Figure state">
          {modes.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={mode === m.id ? "is-on" : ""} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="ice-stage">
        <svg viewBox="0 0 480 340" role="img" aria-label={`Synthetic radar scene with ${floes.length} ice floes; ${caught} highlighted. ${current.note}`}>
          <defs>
            <filter id={`sp-${uid}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="4" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="table" tableValues="0 0.55" />
              </feComponentTransfer>
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <rect width="480" height="340" className="ice-water" />
          <rect width="480" height="340" className="ice-noise" filter={`url(#sp-${uid})`} />
          {floes.map((f, i) => (
            <path key={i} d={f.d} className="ice-floe" />
          ))}
          {floes.map((f, i) => (
            <motion.path
              key={`m${i}`}
              d={f.d}
              className="ice-mask"
              initial={false}
              animate={{ opacity: show(f) ? 1 : 0 }}
              transition={{ duration: 0.35, delay: show(f) ? (f.small ? 0.15 + (i % 7) * 0.04 : 0.05) : 0 }}
            />
          ))}
          {mode === "typical" &&
            floes
              .filter((f) => f.small)
              .map((f, i) => (
                <motion.circle
                  key={`x${i}`}
                  cx={f.cx}
                  cy={f.cy}
                  r={f.r + 6}
                  className="ice-miss"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.025 }}
                  style={{ transformOrigin: `${f.cx}px ${f.cy}px` }}
                />
              ))}
          <g className="ice-query">
            <rect x="12" y="12" width="268" height="26" rx="13" />
            <text x="26" y="29">“segment the scattered ice floes”</text>
          </g>
        </svg>
      </div>
      <figcaption className="ice-caption">
        <span className="ice-count">
          {caught}/{floes.length} floes masked
        </span>
        <span>{current.note}</span>
        <span className="ice-disclaimer">Illustration only. Not research data or results.</span>
      </figcaption>
    </figure>
  );
}
