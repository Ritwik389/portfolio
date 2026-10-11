import { fallbackRatings, ratingProfiles, type Platform, type PlatformRating, type RatingsPayload } from "./ratings";

const TTL = 60 * 60 * 1000;
const RETRY_DELAY = 5 * 60 * 1000;
const TIMEOUT = 8000;
type Fetcher = typeof fetch;

function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export function parseCodeforces(value: unknown): Pick<PlatformRating, "currentRating" | "peakRating"> {
  const data = value as { status?: string; result?: { handle?: string; rating?: unknown; maxRating?: unknown }[] };
  const user = data?.result?.[0];
  if (data?.status !== "OK" || user?.handle?.toLowerCase() !== ratingProfiles.codeforces.handle.toLowerCase()) throw new Error("Invalid Codeforces response");
  return { currentRating: number(user.rating), peakRating: number(user.maxRating) };
}

export function parseCodechef(html: string): Pick<PlatformRating, "currentRating" | "peakRating"> {
  // New profiles also contain a separate DSA rating. Read only the contest block.
  const block = html.split(/id=["']rating-block-all["']/i)[1]?.split(/id=["']rating-block-dsa["']/i)[0] || html;
  const current = block.match(/class=["'][^"']*\brating-number\b[^"']*["'][^>]*>\s*(\d+)\s*</i);
  const peak = block.match(/Highest\s+Rating\s*(\d+)/i);
  if (!current || !peak) throw new Error("CodeChef profile did not expose contest ratings");
  return { currentRating: Number(current[1]), peakRating: Number(peak[1]) };
}

interface LeetcodeData {
  errors?: unknown[];
  data?: {
    userContestRanking?: { rating?: unknown } | null;
    userContestRankingHistory?: { attended: boolean; rating?: unknown }[] | null;
    matchedUser?: { submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count?: unknown }[] } } | null;
  };
}
export function parseLeetcode(value: unknown): Pick<PlatformRating, "currentRating" | "peakRating" | "solved"> {
  const { data, errors } = value as LeetcodeData;
  if (errors?.length || !data?.matchedUser) throw new Error("Invalid LeetCode response");
  const current = number(data.userContestRanking?.rating);
  const history = (data.userContestRankingHistory || []).filter((entry) => entry.attended).map((entry) => number(entry.rating)).filter((rating): rating is number => rating !== null);
  if (current !== null) history.push(current);
  const solved = number(data.matchedUser.submitStatsGlobal?.acSubmissionNum?.find((entry) => entry.difficulty === "All")?.count);
  if (solved === null) throw new Error("Missing LeetCode solved count");
  return { currentRating: current, peakRating: history.length ? Math.max(...history) : null, solved };
}

const query = `query PortfolioStats($username: String!) {
  userContestRanking(username: $username) { rating }
  userContestRankingHistory(username: $username) { attended rating }
  matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } }
}`;

// One request per platform, shared by concurrent visitors. No credentials or user-supplied URLs.
export function createRatingsService(fetcher: Fetcher = fetch, now: () => number = Date.now) {
  const cache = new Map<Platform, { rating: PlatformRating; expires: number; retryAfter: number }>();
  let pending: Promise<RatingsPayload> | null = null;
  async function platformRating(platform: Platform): Promise<PlatformRating> {
    const previous = cache.get(platform);
    const time = now();
    if (previous && previous.expires > time) return { ...previous.rating, source: "cached" };
    if (previous && previous.retryAfter > time) return { ...previous.rating, source: previous.rating.source === "fallback" ? "fallback" : "cached" };
    try {
      let url: string;
      let options: RequestInit = {};
      if (platform === "codeforces") url = `https://codeforces.com/api/user.info?handles=${ratingProfiles.codeforces.handle}`;
      else if (platform === "codechef") url = ratingProfiles.codechef.href;
      else {
        url = "https://leetcode.com/graphql/";
        options = { method: "POST", headers: { "Content-Type": "application/json", Referer: ratingProfiles.leetcode.href }, body: JSON.stringify({ query, variables: { username: ratingProfiles.leetcode.handle } }) };
      }
      // The service owns its TTL. Disable Next's separate fetch cache so ISR
      // cannot repeatedly reuse an old upstream response after that TTL expires.
      const response = await fetcher(url, { ...options, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT) });
      if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
      const stats = platform === "codechef" ? parseCodechef(await response.text()) : platform === "codeforces" ? parseCodeforces(await response.json()) : parseLeetcode(await response.json());
      const rating: PlatformRating = { handle: ratingProfiles[platform].handle, solved: null, ...stats, updatedAt: new Date(time).toISOString(), source: "live" };
      cache.set(platform, { rating, expires: time + TTL, retryAfter: 0 });
      return rating;
    } catch {
      const rating = previous?.rating || { ...fallbackRatings[platform], source: "fallback" as const };
      cache.set(platform, { rating, expires: 0, retryAfter: time + RETRY_DELAY });
      return { ...rating, source: previous?.rating.source === "live" || previous?.rating.source === "cached" ? "cached" : "fallback" };
    }
  }
  return function getRatings(): Promise<RatingsPayload> {
    if (!pending) pending = Promise.all([platformRating("codeforces"), platformRating("codechef"), platformRating("leetcode")])
      .then(([codeforces, codechef, leetcode]) => ({ codeforces, codechef, leetcode, checkedAt: new Date(now()).toISOString(), mode: "live" as const }))
      .finally(() => { pending = null; });
    return pending;
  };
}

export const getRatings = createRatingsService();
