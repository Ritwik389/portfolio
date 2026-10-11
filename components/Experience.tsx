"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-4">In practice</p>
        <h2 className="font-display text-4xl text-espresso md:text-5xl">Experience.</h2>
        <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="glass-panel mt-10 rounded-2xl p-6 shadow-glass md:p-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-oxblood">{experience.role}</p>
              <h3 className="max-w-xl font-display text-2xl text-espresso md:text-3xl">{experience.company}</h3>
            </div>
            <p className="shrink-0 font-body text-sm leading-relaxed text-espresso/70 md:text-right">{experience.period}<br />{experience.location}</p>
          </div>
          <ul className="mt-6 list-disc space-y-3 pl-5 font-body text-sm leading-relaxed text-espresso/80 md:text-base">
            {experience.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2">
            {experience.tech.map((tech) => <span key={tech} className="rounded-full border border-champagne/40 px-3 py-1 text-xs font-semibold text-terracotta">{tech}</span>)}
          </div>
        </motion.article>
      </div>
    </section>
  );
}
