import type { MetadataRoute } from "next";
import { assetPath } from "@/lib/paths";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ritwik Jain · Multimodal AI Researcher",
    short_name: "Ritwik Jain",
    description: "Portfolio of Ritwik Jain: vision-language reasoning, speech separation and evidence-grounded LLM systems.",
    start_url: assetPath("/"),
    scope: assetPath("/"),
    display: "standalone",
    background_color: "#f6f2e9",
    theme_color: "#121a2b",
    icons: [
      { src: assetPath("/favicon.svg"), sizes: "any", type: "image/svg+xml" },
      { src: assetPath("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: assetPath("/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: assetPath("/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
