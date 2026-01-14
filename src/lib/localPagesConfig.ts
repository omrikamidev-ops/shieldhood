/**
 * Configuration for Local SEO pages
 * Defines primary keywords and their metadata
 */

export type PrimaryKeyword = {
  slug: string;
  label: string;
  intent: string[];
};

export const PRIMARY_KEYWORDS: PrimaryKeyword[] = [
  {
    slug: 'hood-cleaning',
    label: 'Hood Cleaning',
    intent: ['service-request', 'information', 'compliance'],
  },
  {
    slug: 'kitchen-exhaust-cleaning',
    label: 'Kitchen Exhaust Cleaning',
    intent: ['service-request', 'information', 'compliance'],
  },
  {
    slug: 'commercial-hood-cleaning',
    label: 'Commercial Hood Cleaning',
    intent: ['service-request', 'information'],
  },
  {
    slug: 'restaurant-hood-cleaning',
    label: 'Restaurant Hood Cleaning',
    intent: ['service-request', 'information'],
  },
];

export const INTENT_OPTIONS = [
  { value: 'service-request', label: 'Service Request' },
  { value: 'information', label: 'Information Seeking' },
  { value: 'compliance', label: 'Compliance Questions' },
  { value: 'urgent-service', label: 'Urgent Service' },
];

export function getPrimaryKeywordBySlug(slug: string): PrimaryKeyword | undefined {
  return PRIMARY_KEYWORDS.find((kw) => kw.slug === slug);
}

export function isValidPrimaryKeyword(slug: string): boolean {
  return PRIMARY_KEYWORDS.some((kw) => kw.slug === slug);
}
