import type { MetadataRoute } from "next";
import { getGlobalSettings, getLocationsForSitemap } from "@/lib/data";

const stripTrailingSlash = (value?: string | null) => (value ?? "").replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, locations] = await Promise.all([
    getGlobalSettings(),
    getLocationsForSitemap(),
  ]);

  const base = stripTrailingSlash(settings.baseDomain || "https://hoodscleaning.net");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/locations`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${base}/locations/${loc.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: loc.updatedAt,
  }));

  return [...staticPages, ...locationPages];
}
