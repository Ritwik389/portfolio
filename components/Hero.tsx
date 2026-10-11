"use client";

import { motion } from "framer-motion";
import Scene from "@/components/Scene";
import { profile } from "@/lib/data";
import WaveBackground from "@/components/effects/WaveBackground";
import { assetPath } from "@/lib/paths";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  const currentYear = new Date().getFullYear();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-12 pt-32 md:px-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-terracotta/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-champagne/20 blur-[100px]"
      />

      <WaveBackground />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-1 min-w-0"
        >
          <motion.p variants={item} className="eyebrow mb-5">
            Portfolio · {currentYear}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-5xl leading-[1.05] text-espresso md:text-7xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-4 font-display text-xl italic text-oxblood md:text-2xl"
          >
            {profile.title}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-6 max-w-md font-body text-base leading-relaxed text-espresso/80"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <a
              href={profile.resumeUrl}
              download="Ritwik_Jain_Resume.pdf"
              data-cursor-hover
              className="glass-panel rounded-full px-7 py-3 font-body text-sm font-semibold uppercase tracking-wide text-oxblood transition-transform hover:-translate-y-0.5"
            >
              Download resume
            </a>
            <a
              href="#contact"
              data-cursor-hover
              className="rounded-full border border-oxblood/70 bg-oxblood px-7 py-3 font-body text-sm font-semibold uppercase tracking-wide text-bone shadow-glass transition-transform hover:-translate-y-0.5"
            >
              Contact
            </a>
          </motion.div>
        </motion.div>

        {/* 3D hero character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative order-2 flex aspect-square w-full max-w-xs items-center justify-center justify-self-center md:max-w-none"
        >
          <Scene
            scene={assetPath("/scenes/hero.splinecode")}
          />
        </motion.div>
      </div>
    </section>
  );
}
