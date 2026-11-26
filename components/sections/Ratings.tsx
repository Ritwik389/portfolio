"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { fallbackRatings, isRatingsPayload, ratingProfiles, type RatingsPayload } from "@/lib/ratings";
import { assetPath } from "@/lib/paths";

const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const show = (n: number | null) => (n === null ? "—" : format.format(n));

export default function Ratings() {
  const [ratings, setRatings] = useState<RatingsPayload>(fallbackRatings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    fetch(assetPath("/ratings.json"), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Ratings unavailable");
        const data: unknown = await response.json();
        if (isRatingsPayload(data)) setRatings(data);
      })
      .catch(() => {
        /* keep the bundled snapshot */
      })
      .finally(() => {
        window.clearTimeout(timeout);
        setLoading(false);
      });
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const rows = [
    { name: "LeetCode", href: ratingProfiles.leetcode.href, peak: ratings.leetcode.peakRating, extra: `${show(ratings.leetcode.solved)} solved` },
    { name: "CodeChef", href: ratingProfiles.codechef.href, peak: ratings.codechef.peakRating, extra: `current ${show(ratings.codechef.currentRating)}` },
    { name: "Codeforces", href: ratingProfiles.codeforces.href, peak: ratings.codeforces.peakRating, extra: `current ${show(ratings.codeforces.currentRating)}` },
  ];

  return (
    <div className="reveal">
      <h3 className="sub-title">Competitive programming</h3>
      <ul className="ratings">
        {rows.map((row) => (
          <li key={row.name}>
            <a href={row.href} target="_blank" rel="noopener noreferrer">
              <span className="rating-name">{row.name}</span>
              <span className="rating-peak">
                {show(row.peak)} <small>peak</small>
              </span>
              <span className="rating-extra">{row.extra}</span>
              <ArrowUpRight size={15} aria-hidden="true" className="cert-arrow" />
            </a>
          </li>
        ))}
      </ul>
      <p className="ratings-status" role="status" aria-live="polite">
        {loading ? "Checking profiles…" : ratings.mode === "snapshot" ? "As of the latest site build" : "Synced with coding profiles"}
      </p>
    </div>
  );
}
