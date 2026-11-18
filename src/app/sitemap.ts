import type { MetadataRoute } from "next";
import { cv, siteUrl } from "@/content";

/** Both pages, plus the public CV. lastModified is the build time (a static site). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"; // prerendered once at build time (Cache Components), so it ships as a static file
  const base = siteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}${cv.href}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
