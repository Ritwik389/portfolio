import fallback from "@/lib/ratings-fallback.json";

export const ratingProfiles = {
  codeforces: { handle: "Ritwik_08", href: "https://codeforces.com/profile/Ritwik_08" },
  codechef: { handle: "eager_beam_07", href: "https://www.codechef.com/users/eager_beam_07" },
  leetcode: { handle: "KYfpafaSHy", href: "https://leetcode.com/u/KYfpafaSHy/" },
} as const;

export type Platform = keyof typeof ratingProfiles;
export interface PlatformRating {
  handle: string;
  currentRating: number | null;
  peakRating: number | null;
  solved: number | null;
  updatedAt: string | null;
  source: "live" | "cached" | "fallback";
}
export interface RatingsPayload {
  codeforces: PlatformRating;
  codechef: PlatformRating;
  leetcode: PlatformRating;
  checkedAt: string | null;
  mode: "live" | "snapshot";
}

export const fallbackRatings = fallback as RatingsPayload;

export function isRatingsPayload(value: unknown): value is RatingsPayload {
  if (!value || typeof value !== "object") return false;
  const data = value as RatingsPayload;
  return ["live", "snapshot"].includes(data.mode) &&
    Object.entries(ratingProfiles).every(([platform, profile]) => {
      const rating = data[platform as Platform];
      return rating?.handle === profile.handle &&
        [rating.currentRating, rating.peakRating, rating.solved].every((n) => n === null || (typeof n === "number" && Number.isFinite(n) && n >= 0)) &&
        ["live", "cached", "fallback"].includes(rating.source) &&
        (rating.updatedAt === null || (typeof rating.updatedAt === "string" && Number.isFinite(Date.parse(rating.updatedAt))));
    });
}
