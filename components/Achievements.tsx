"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { achievements } from "@/lib/data";
import { fallbackRatings, isRatingsPayload, type Platform, type RatingsPayload } from "@/lib/ratings";
import { assetPath } from "@/lib/paths";

export default function Achievements() {
  const [ratings, setRatings] = useState<RatingsPayload>(fallbackRatings);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    fetch(assetPath("/api/ratings/"), { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Ratings unavailable");
      const data: unknown = await response.json();
      if (isRatingsPayload(data)) setRatings(data);
    }).catch(() => { /* Keep the last verified snapshot visible. */ }).finally(() => { window.clearTimeout(timeout); setLoading(false); });
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);
  const platforms: Platform[] = ["codeforces", "codechef", "leetcode", "leetcode"];
  const live = [ratings.codeforces, ratings.codechef, ratings.leetcode].every((rating) => rating.source !== "fallback");
  return (
    <section id="achievements" aria-labelledby="achievements-heading" className="relative px-6 py-16 md:px-12 md:py-24">
      <h2 id="achievements-heading" className="sr-only">Competitive programming achievements</h2>
      <div className="glass-panel-strong mx-auto max-w-6xl rounded-[2rem] px-5 py-10 sm:px-8 md:py-14">
        <div className="grid grid-cols-1 gap-8 min-[360px]:grid-cols-2 md:grid-cols-4">
          {achievements.map((a, i) => (
            <motion.a
              key={a.id}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="block min-w-0 text-center"
            >
              <p className="font-display text-4xl text-oxblood lg:text-6xl">
                {i === 3 ? ratings.leetcode.solved ?? a.stat : ratings[platforms[i]].peakRating === null ? "Unrated" : Math.round(ratings[platforms[i]].peakRating!)}
              </p>
              <p className="mt-2 font-body text-xs font-semibold uppercase tracking-wide text-espresso/70">
                {a.label}
              </p>
              {i < 3 && <p className="mt-2 font-body text-xs text-espresso/60">Current · {ratings[platforms[i]].currentRating === null ? "Unrated" : Math.round(ratings[platforms[i]].currentRating!)}</p>}
            </motion.a>
          ))}
        </div>
        <p role="status" aria-live="polite" className="mt-7 text-center font-body text-[0.65rem] text-espresso/50">
          {loading ? "Checking coding profiles…" : ratings.mode === "snapshot" ? "Ratings as of the latest site build" : live ? "Synced with coding profiles · updates hourly" : "Some profiles unavailable · showing saved ratings"}
        </p>
      </div>
    </section>
  );
}
