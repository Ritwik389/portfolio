import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { geoBounds, geoContains } from "d3";

// Natural Earth is public domain. Prepare geometry and dots once, rather than
// downloading a map or running thousands of polygon checks in each browser.
const source = "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json";
const raw = process.argv[2]
  ? await readFile(process.argv[2], "utf8")
  : await fetch(source).then((response) => {
    if (!response.ok) throw new Error(`Map download failed: ${response.status}`);
    return response.text();
  });
const land = JSON.parse(raw);
if (land.type !== "FeatureCollection") throw new Error("Expected a GeoJSON FeatureCollection");

const step = 16 * 0.08;
const dots = new Map();
for (const feature of land.features) {
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(feature);
  const endLng = maxLng < minLng ? maxLng + 360 : maxLng;
  for (let lng = Math.ceil(minLng / step) * step; lng <= endLng; lng += step) {
    for (let lat = Math.ceil(minLat / step) * step; lat <= maxLat; lat += step) {
      const point = [Number((((lng + 180) % 360 + 360) % 360 - 180).toFixed(4)), Number(lat.toFixed(4))];
      if (geoContains(feature, point)) dots.set(point.join(","), point);
    }
  }
}
const geometry = {
  type: "FeatureCollection",
  features: land.features.map(({ geometry }) => ({ type: "Feature", properties: {}, geometry })),
};
await writeFile(new URL("../lib/globe-land-geometry.json", import.meta.url), JSON.stringify(geometry) + "\n");
await writeFile(new URL("../lib/globe-land.json", import.meta.url), JSON.stringify([...dots.values()]) + "\n");
await writeFile(new URL("../lib/globe-land-source.json", import.meta.url), JSON.stringify({
  source,
  license: "Public domain (Natural Earth)",
  sha256: createHash("sha256").update(raw).digest("hex"),
  features: land.features.length,
  dots: dots.size,
  spacingDegrees: step,
}, null, 2) + "\n");
console.log(`Prepared ${land.features.length} land features and ${dots.size} dots.`);
