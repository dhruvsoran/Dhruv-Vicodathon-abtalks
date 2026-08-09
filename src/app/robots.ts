import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://dhruv-vicodathon-abtalks.vercel.app/sitemap.xml",
  };
}
