import type { MetadataRoute } from "next";
import { getGlobalSettings, getLocationsForSitemap } from "@/lib/data";
import { generateLocationSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { PRIMARY_KEYWORDS } from "@/lib/localPagesConfig";

const stripTrailingSlash = (value?: string | null) => (value ?? "").replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, locations, localPages] = await Promise.all([
    getGlobalSettings(),
    getLocationsForSitemap(),
    prisma.localPage.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const base = stripTrailingSlash(settings.baseDomain || "https://hoodscleaning.net");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/locations`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${base}/${generateLocationSlug(loc.city, loc.state)}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: loc.updatedAt,
  }));

  // Locations hubs for each primary keyword
  const locationsHubs: MetadataRoute.Sitemap = PRIMARY_KEYWORDS.map((keyword) => ({
    url: `${base}/${keyword.slug}/locations/`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Local SEO pages
  const localSeoPages: MetadataRoute.Sitemap = localPages.map((page) => ({
    url: `${base}${page.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: page.updatedAt,
  }));

  return [...staticPages, ...locationPages, ...locationsHubs, ...localSeoPages];
}
