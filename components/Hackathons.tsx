"use client";

import { motion } from "framer-motion";
import { hackathons } from "@/lib/data";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

export default function Hackathons() {
  return (
    <section id="hackathons" className="relative px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex flex-col gap-6 sm:min-h-[320px] sm:flex-row sm:items-center lg:min-h-[400px]">
          <div className="relative z-10 shrink-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4 }}
              className="eyebrow mb-4"
            >
              Competitions
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-display text-4xl text-espresso md:text-5xl"
            >
              Hackathons.
            </motion.h2>
          </div>
          <div className="relative mx-auto aspect-square w-[min(100%,18rem)] shrink-0 sm:absolute sm:right-0 sm:top-1/2 sm:w-[360px] sm:-translate-y-1/2 lg:w-[480px]">
            <RotatingEarth width={480} height={480} className="absolute inset-0 h-full w-full" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="glass-panel flex flex-col rounded-2xl p-6 shadow-glass"
            >
              <h3 className="font-display text-xl text-espresso">{h.name}</h3>
              <p className="mt-1 font-body text-xs font-semibold uppercase tracking-wide text-oxblood">
                {h.role}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-4 font-body text-sm text-espresso/75">
                {h.points.map((pt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-body text-xs font-semibold uppercase tracking-wide text-terracotta">
                {h.result}
              </p>
              {h.github && <div className="mt-auto flex gap-5 pt-5 font-body text-xs font-semibold uppercase tracking-wide text-oxblood"><a href={h.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">GitHub<span className="sr-only"> (opens in a new tab)</span></a>{h.demo && <a href={h.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Live demo<span className="sr-only"> (opens in a new tab)</span></a>}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
