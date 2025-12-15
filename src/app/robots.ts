import type { MetadataRoute } from "next";
import { getGlobalSettings } from "@/lib/data";

const stripTrailingSlash = (value?: string | null) => (value ?? "").replace(/\/+$/, "");

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getGlobalSettings();
  const base = stripTrailingSlash(settings.baseDomain || "https://shieldhoodservice.com");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
