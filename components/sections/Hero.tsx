"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useAnimationControls, useSpring } from "motion/react";
import { ArrowDown, ArrowUpRight, Hand, Pause, Play } from "lucide-react";
import Scene, { interactiveSceneQuery, useMediaQuery } from "@/components/Scene";
import Speckle from "@/components/fx/Speckle";
import { assetPath } from "@/lib/paths";
import { heroStats, profile } from "@/lib/data";
import { setNotebook, toast, useUi } from "@/lib/ui-store";

const greetings = [
  "Hi! I’m the portfolio robot. Ritwik built the interesting parts.",
  "Beep. Try the notebook: press ` on your keyboard.",
  "I have no GPU quota either.",
  "Fun fact: my head is a Spline scene. My jokes are hand-written.",
];

export default function Hero() {
  const [paused, setPaused] = useState(false);
  const [line, setLine] = useState(-1);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const fine = useMediaQuery(interactiveSceneQuery);
  const overfitting = useUi((s) => s.overfit);
  const greeting = useAnimationControls();
  const tiltX = useSpring(0, { stiffness: 170, damping: 22 });
  const tiltY = useSpring(0, { stiffness: 170, damping: 22 });
  const bounds = useRef<DOMRect | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function settle() {
    tiltX.set(0);
    tiltY.set(0);
  }
  function follow(event: PointerEvent<HTMLDivElement>) {
    if (!fine || reduced || paused || !bounds.current) return;
    const r = bounds.current;
    tiltY.set(((event.clientX - r.left) / r.width - 0.5) * 12);
    tiltX.set(-((event.clientY - r.top) / r.height - 0.5) * 8);
  }
  function sayHello() {
    const next = (line + 1) % greetings.length;
    setLine(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLine(-1), 4200);
    if (!reduced && !paused) {
      greeting.stop();
      void greeting.start({
        y: [0, -16, 0],
        rotate: [0, -6, 6, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      });
    }
  }

  useEffect(() => {
    if (!overfitting || reduced) return;
    void greeting.start({
      rotate: [0, -10, 10, -10, 10, 0],
      scale: [1, 1.04, 0.97, 1.03, 1],
      transition: { duration: 1.2, ease: "easeInOut" },
    });
  }, [overfitting, reduced, greeting]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      greeting.stop();
    },
    [greeting],
  );

  const words = ["Ritwik", "Jain"];

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <Speckle className="hero-speckle" />
      <div className="hero-sweep" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            {profile.status}
          </p>
          <h1 id="hero-title" className="hero-name" aria-label={profile.name}>
            {words.map((word, i) => (
              <span className="hero-line" key={word} aria-hidden="true">
                <motion.span
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.08 + i * 0.09 }}
                >
                  {word}
                  {i === words.length - 1 && <span className="hero-dot">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="hero-lede">
              I’m an IT student at DTU working on machine learning research.
            </p>
            <p className="hero-sub">
              Mostly vision-language models and speech separation, plus full projects built around them. This summer I was an{" "}
              <strong>AI/ML intern at Deloitte</strong>.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#research">
                See the research <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a className="btn btn-ghost" href={profile.resumeUrl} download="Ritwik_Jain_Resume.pdf">
                Résumé <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <button type="button" className="btn btn-code" onClick={() => setNotebook(true)}>
                <span aria-hidden="true">&gt;_</span> open ritwik.ipynb
              </button>
            </div>
          </motion.div>
        </div>

        <motion.figure
          className="hero-figure plate"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="plate-tick tl" aria-hidden="true" />
          <span className="plate-tick tr" aria-hidden="true" />
          <span className="plate-tick bl" aria-hidden="true" />
          <span className="plate-tick br" aria-hidden="true" />
          <div className="plate-meta" aria-hidden="true">
            <span>FIG. 01</span>
            <span>spline://robot · live</span>
          </div>
          <motion.div
            className="robot-canvas"
            style={{ rotateX: reduced || paused ? 0 : tiltX, rotateY: reduced || paused ? 0 : tiltY }}
            onPointerEnter={(e) => {
              bounds.current = e.currentTarget.getBoundingClientRect();
            }}
            onPointerMove={follow}
            onPointerLeave={settle}
            onDoubleClick={() => toast("🤖 Double-click detected. Robot is flattered.")}
          >
            <motion.div className="robot-greeting" animate={greeting}>
              <Scene
                scene={assetPath("/scenes/hero.splinecode")}
                poster={assetPath("/scenes/hero-white.webp")}
                darkPoster={assetPath("/scenes/hero-dark.webp")}
                fitWidth={552}
                paused={paused}
                background="var(--plate)"
              />
            </motion.div>
            {line >= 0 && (
              <motion.p
                key={line}
                className="robot-bubble"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
              >
                {greetings[line]}
              </motion.p>
            )}
          </motion.div>
          <figcaption className="plate-caption">
            <span role="status" aria-live="polite" className="sr-only">
              {line >= 0 ? greetings[line] : ""}
            </span>
            <span className="plate-caption-text">{fine && !reduced ? "Move your cursor — it follows." : "The portfolio robot."}</span>
            <span className="plate-actions">
              <button type="button" className="chip-btn" onClick={sayHello}>
                <Hand size={14} aria-hidden="true" /> Say hello
              </button>
              {fine && !reduced && (
                <button
                  type="button"
                  className="chip-btn"
                  aria-pressed={paused}
                  onClick={() => {
                    setPaused(!paused);
                    settle();
                    greeting.stop();
                    greeting.set({ y: 0, rotate: 0 });
                  }}
                >
                  {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                  {paused ? "Resume" : "Pause"}
                </button>
              )}
            </span>
          </figcaption>
        </motion.figure>
      </div>

      <dl className="wrap hero-stats">
        {heroStats.map((stat, i) => (
          <motion.div
            className="hero-stat"
            key={stat.label}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <dt>{stat.label}</dt>
            <dd>
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-detail">{stat.detail}</span>
            </dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
