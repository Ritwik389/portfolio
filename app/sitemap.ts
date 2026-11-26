import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/paths";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/social-preview.png`, `${siteUrl}/portrait.webp`],
    },
  ];
}
