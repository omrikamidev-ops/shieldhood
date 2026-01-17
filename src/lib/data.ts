import { GlobalSettings, Location, Service } from "@prisma/client";
import { prisma } from "./prisma";
import { FAQItem, parseFaqString } from "./faq";

export type LocalTestimonial = {
  name: string;
  role?: string;
  quote: string;
  area?: string;
};

export type SettingsWithFaq = GlobalSettings & { faqItems: FAQItem[] };
export type LocationWithFaq = Location & {
  faqItems: FAQItem[];
  testimonials: LocalTestimonial[];
};
export type LocationWithServices = LocationWithFaq & {
  services: { service: Service; localNotes: string | null }[];
};

const defaultSettings = {
  businessName: "Hoods Cleaning",
  primaryPhone: "818-518-8161",
  baseDomain: "https://hoodscleaning.net",
};

export const getGlobalSettings = async (): Promise<SettingsWithFaq> => {
  try {
    const record =
      (await prisma.globalSettings.findFirst()) ??
      (await prisma.globalSettings.create({ data: defaultSettings }));

    return {
      ...record,
      faqItems: parseFaqString(record.globalFAQ),
    };
  } catch (error) {
    console.error("Falling back to default settings", error);
    const now = new Date();
    return {
      id: 0,
      businessName: defaultSettings.businessName,
      primaryPhone: defaultSettings.primaryPhone,
      primaryEmail: "",
      baseDomain: defaultSettings.baseDomain,
      defaultStreetAddress: "",
      defaultCity: "",
      defaultState: "",
      defaultZip: "",
      defaultCountry: "",
      globalServiceDescription: "",
      globalFAQ: "[]",
      createdAt: now,
      updatedAt: now,
      faqItems: [],
    };
  }
};

export const getPublishedLocations = async (): Promise<LocationWithServices[]> => {
  try {
    const locations = await prisma.location.findMany({
      where: { published: true },
      include: {
        services: {
          include: { service: true },
        },
      },
      orderBy: { city: "asc" },
    });

    return locations.map((loc) => ({
      ...loc,
      faqItems: parseFaqString(loc.locationFAQ),
      testimonials: parseTestimonials(loc.localTestimonials),
      services: loc.services.map((link) => ({
        service: link.service,
        localNotes: link.localNotes,
      })),
    }));
  } catch (error) {
    console.error("Failed to load published locations", error);
    return [];
  }
};

export const getLocationBySlug = async (
  slug: string,
): Promise<LocationWithServices | null> => {
  try {
    const location =
      (await prisma.location.findUnique({
        where: { slug },
        include: { services: { include: { service: true } } },
      })) ||
      (slug.startsWith("hood-cleaning-")
        ? await prisma.location.findUnique({
            where: { slug: `${slug.replace(/^hood-cleaning-/, "")}-hood-cleaning` },
            include: { services: { include: { service: true } } },
          })
        : slug.endsWith("-hood-cleaning")
          ? await prisma.location.findUnique({
              where: { slug: `hood-cleaning-${slug.replace(/-hood-cleaning$/, "")}` },
              include: { services: { include: { service: true } } },
            })
          : null);

    if (!location) return null;

    return {
      ...location,
      faqItems: parseFaqString(location.locationFAQ),
      testimonials: parseTestimonials(location.localTestimonials),
      services: location.services.map((link) => ({
        service: link.service,
        localNotes: link.localNotes,
      })),
    };
  } catch (error) {
    console.error("Failed to load location", error);
    return null;
  }
};

export const getServices = async () => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
    });

    return services;
  } catch (error) {
    console.error("Failed to load services", error);
    return [];
  }
};

export const getLocationsForSitemap = async () => {
  try {
    return await prisma.location.findMany({
      where: { published: true },
      select: { slug: true, city: true, state: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Failed to load locations for sitemap", error);
    return [];
  }
};

export const getNearbyLocations = async (slug: string, state?: string, limit = 2) => {
  try {
    const all = await prisma.location.findMany({
      where: {
        published: true,
        slug: { not: slug },
        ...(state ? { state } : {}),
      },
      select: { city: true, state: true, slug: true },
      orderBy: { updatedAt: "desc" },
    });

    return all.slice(0, limit);
  } catch (error) {
    console.error("Failed to load nearby locations", error);
    return [];
  }
};

const parseTestimonials = (raw?: string | null): LocalTestimonial[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LocalTestimonial[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.name && item?.quote)
      : [];
  } catch (error) {
    console.warn("Failed to parse testimonials", error);
    return [];
  }
};

export { parseTestimonials };
