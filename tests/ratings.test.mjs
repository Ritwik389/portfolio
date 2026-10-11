import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Execute the actual TypeScript parsers/service without a second test toolchain.
const fallback = JSON.parse(readFileSync(new URL("../lib/ratings-fallback.json", import.meta.url), "utf8"));
function load(name, imports) {
  const source = readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  const exports = {};
  new Function("require", "exports", outputText)((id) => imports[id], exports);
  return exports;
}
const common = load("ratings", { "@/lib/ratings-fallback.json": fallback });
const { createRatingsService, parseCodeforces, parseCodechef, parseLeetcode } = load("ratings-server", { "./ratings": common });
const cf = { status: "OK", result: [{ handle: "Ritwik_08", rating: 916, maxRating: 950 }] };
const cc = '<div id="rating-block-all"><div class="rating-number">1426</div><small>(Highest Rating 1462)</small></div><div id="rating-block-dsa"><div class="rating-number">1500</div><small>(Highest Rating 1581)</small></div>';
const lc = { data: { userContestRanking: { rating: 1651.76 }, userContestRankingHistory: [{ attended: true, rating: 1694.46 }, { attended: false, rating: 9999 }], matchedUser: { submitStatsGlobal: { acSubmissionNum: [{ difficulty: "All", count: 128 }, { difficulty: "Easy", count: 71 }] } } } };

test("parsers keep current, peak, and solved counts separate", () => {
  assert.deepEqual(parseCodeforces(cf), { currentRating: 916, peakRating: 950 });
  assert.deepEqual(parseCodechef(cc), { currentRating: 1426, peakRating: 1462 });
  assert.deepEqual(parseLeetcode(lc), { currentRating: 1651.76, peakRating: 1694.46, solved: 128 });
  assert.throws(() => parseCodeforces({ status: "FAILED" }));
  assert.throws(() => parseCodechef("Cloudflare verification"));
  assert.throws(() => parseLeetcode({ errors: [{ message: "Unavailable" }] }));
});

test("concurrent requests share a fetch; a failed platform keeps its last success", async () => {
  let time = 1000000, calls = 0, failLeetcode = false;
  const fetcher = async (url, options) => {
    assert.equal(options.cache, "no-store", "Next's fetch cache must not extend the service TTL");
    calls++;
    if (url.includes("leetcode") && failLeetcode) return new Response("Unavailable", { status: 503 });
    return url.includes("codeforces") ? Response.json(cf) : url.includes("codechef") ? new Response(cc) : Response.json(lc);
  };
  const get = createRatingsService(fetcher, () => time);
  const first = get(), concurrent = get();
  assert.equal(first, concurrent);
  const result = await first;
  assert.equal(calls, 3);
  assert.equal(result.leetcode.source, "live");
  assert.equal(common.isRatingsPayload(result), true);
  assert.equal((await get()).codeforces.source, "cached");
  assert.equal(calls, 3);
  time += 3600001; failLeetcode = true;
  const partial = await get();
  assert.equal(calls, 6);
  assert.equal(partial.leetcode.peakRating, 1694.46);
  assert.equal(partial.leetcode.updatedAt, result.leetcode.updatedAt);
  assert.equal(partial.leetcode.source, "cached");
  assert.equal(partial.codeforces.source, "live");
  await get();
  assert.equal(calls, 6, "failed upstream retries are throttled");
});

test("cold-start failures remain explicitly marked as fallback", async () => {
  const get = createRatingsService(async () => { throw new Error("Offline"); });
  const result = await get();
  const again = await get();
  assert.equal(result.leetcode.source, "fallback");
  assert.equal(again.leetcode.source, "fallback");
  assert.equal(result.leetcode.solved, fallback.leetcode.solved);
  assert.equal(common.isRatingsPayload(result), true);
  assert.equal(common.isRatingsPayload({ ...result, leetcode: { ...result.leetcode, solved: NaN } }), false);
});
