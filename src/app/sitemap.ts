import type { MetadataRoute } from "next";
import { days } from "@/lib/challenge";

const SITE = "https://dhruv-vicodathon-abtalks.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...days.map((d) => ({
      url: `${SITE}/day/${d.day}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
