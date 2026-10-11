"use client";

import { motion } from "framer-motion";
import { certifications } from "@/lib/data";

function Crest() {
  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 28 32"
      fill="none"
      aria-hidden
      className="text-champagne"
    >
      <path
        d="M14 1L26 6V15C26 22.5 21 28 14 31C7 28 2 22.5 2 15V6L14 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M9 15L12.5 18.5L19 11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
          className="eyebrow mb-4"
        >
          Credentials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-4xl text-espresso md:text-5xl"
        >
          Certifications.
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
              className="glass-panel flex flex-col items-center rounded-2xl p-6 text-center shadow-glass"
            >
              <Crest />
              <h3 className="mt-4 font-display text-xl text-espresso">
                {c.name}
              </h3>
              <p className="mt-1 font-body text-xs font-semibold uppercase tracking-wide text-oxblood">
                {c.issuer}
              </p>
              <p className="mt-1 font-body text-xs text-espresso/60">
                {c.date}
              </p>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-center pt-5 font-body text-xs font-semibold uppercase tracking-wide text-oxblood underline underline-offset-4" aria-label={`View ${c.name} certificate (opens in a new tab)`}>View certificate ↗</a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
