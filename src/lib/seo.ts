import { GlobalSettings, Location } from "@prisma/client";
import { FAQItem } from "./faq";

const stripTrailingSlash = (value?: string | null) =>
  (value ?? "").replace(/\/+$/, "");

export const getLocationPhone = (
  location: Pick<Location, "phoneOverride">,
  settings: Pick<GlobalSettings, "primaryPhone">,
) => location.phoneOverride || settings.primaryPhone;

export const buildLocationTitle = (
  location: Pick<Location, "pageTitleOverride" | "city" | "state">,
  settings: Pick<GlobalSettings, "businessName">,
) =>
  location.pageTitleOverride ||
  `${settings.businessName} in ${location.city}, ${location.state} | Hood Cleaning & Fire Safety Experts`;

export const buildLocationDescription = (
  location: Pick<
    Location,
    "metaDescriptionOverride" | "city" | "state" | "phoneOverride"
  >,
  settings: Pick<GlobalSettings, "businessName" | "primaryPhone">,
) =>
  location.metaDescriptionOverride ||
  `${settings.businessName} provides NFPA 96 compliant hood & kitchen exhaust cleaning in ${location.city}, ${location.state}. Photo reports & service stickers. Call ${
    location.phoneOverride || settings.primaryPhone
  }.`;

export const buildCanonicalUrl = (settings: GlobalSettings, slug: string) =>
  `${stripTrailingSlash(settings.baseDomain)}/locations/${slug}`;

export const buildRobots = (published: boolean) =>
  published ? { index: true, follow: true } : { index: false, follow: false };

export const buildLocalBusinessJsonLd = ({
  location,
  settings,
  canonicalUrl,
}: {
  location: Location;
  settings: GlobalSettings;
  canonicalUrl: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${canonicalUrl}#localbusiness`,
  name: settings.businessName,
  url: canonicalUrl,
  telephone: getLocationPhone(location, settings),
  ...(settings.primaryEmail ? { email: settings.primaryEmail } : {}),
  address: {
    "@type": "PostalAddress",
    streetAddress: location.streetAddress || settings.defaultStreetAddress,
    addressLocality: location.city || settings.defaultCity,
    addressRegion: location.state || settings.defaultState,
    postalCode: location.zip || settings.defaultZip,
    addressCountry: location.country || settings.defaultCountry,
  },
  areaServed: [location.city, location.state].filter(Boolean).join(", "),
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [
      location.streetAddress || settings.defaultStreetAddress,
      location.city || settings.defaultCity,
      location.state || settings.defaultState,
      location.zip || settings.defaultZip,
    ]
      .filter(Boolean)
      .join(", "),
  )}`,
  sameAs: [],
});

export const buildFaqJsonLd = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const buildBreadcrumbJsonLd = ({
  settings,
  location,
  canonicalUrl,
}: {
  settings: GlobalSettings;
  location: Pick<Location, "city" | "state" | "slug">;
  canonicalUrl: string;
}) => {
  const base = stripTrailingSlash(settings.baseDomain || "https://shieldhoodservice.com");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${base}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: `${base}/locations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${location.city}, ${location.state}`,
        item: canonicalUrl,
      },
    ],
  };
};
