"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";
import HowItWorks from "@/components/ui/how-it-works";

export default function Education() {
  const educationFeatures = education.map((e) => ({
    title: e.degree,
    description: `${e.school} (${e.period}) - ${e.detail}`,
    colorTheme: "orange" as const, 
  }));

  return (
    <section id="education" className="relative px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
          className="eyebrow mb-4 text-center"
        >
          Education
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-center font-display text-4xl text-espresso md:text-5xl"
        >
          Academic path.
        </motion.h2>

        <div className="mt-10">
          <HowItWorks features={educationFeatures} />
        </div>
      </div>
    </section>
  );
}
