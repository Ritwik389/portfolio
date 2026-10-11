"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/data";
import Scene from "@/components/Scene";
import { assetPath } from "@/lib/paths";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="relative mx-auto flex h-64 w-full max-w-sm items-center justify-center sm:h-80 lg:col-span-2 lg:h-[540px] lg:max-w-none">
          <Scene scene={assetPath("/scenes/about.splinecode")} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} className="min-w-0 lg:col-span-3">
          <p className="eyebrow mb-4">About</p>
          <h2 className="font-display text-4xl text-espresso md:text-5xl">The short version.</h2>
          <p className="mt-6 font-body leading-relaxed text-espresso/80">{about.bio}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {about.skillGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-wide text-oxblood">{group.title}</h3>
                <ul className="flex flex-wrap gap-2" aria-label={group.title}>
                  {group.skills.map((skill) => <li key={skill} className="glass-panel rounded-full px-3 py-1.5 font-body text-xs font-semibold text-oxblood">{skill}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
