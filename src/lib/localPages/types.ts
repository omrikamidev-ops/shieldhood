/**
 * Type definitions for Local SEO pages system
 */

export type LocalPageStatus = 'draft' | 'published';

export type SafetyFlag =
  | 'low_word_count'
  | 'low_city_mentions'
  | 'low_local_context'
  | 'missing_court_reference'
  | 'missing_notice_timeline'
  | 'prohibited_claims'
  | 'insufficient_sections'
  | 'insufficient_faq'
  | 'missing_required_link'
  | 'high_similarity';

export interface LocalPageContent {
  title: string;
  metaDescription: string;
  h1: string;
  shortIntro: string;
  longIntro: string;
  mainBody: string;
  whatTypicallyHappensNext: string;
  servicesIntro: string;
  neighborhoodsOrAreas: string;
  localStatsOrRegulationNotes: string;
  localTestimonials: Array<{ name: string; quote: string; role?: string; area?: string }>;
  locationFAQ: Array<{ question: string; answer: string }>;
}

export interface LocalPageData {
  id: string;
  primaryKeyword: string;
  primaryKeywordSlug: string;
  city: string;
  county?: string;
  state: string;
  zip?: string;
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  contentJson: LocalPageContent;
  renderedHtml: string;
  faqJson?: Array<{ question: string; answer: string }>;
  schemaJsonld?: Record<string, unknown>;
  internalLinksJson?: Array<{ text: string; url: string }>;
  uniquenessScore?: number;
  safetyFlags: SafetyFlag[];
  status: LocalPageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateDraftRequest {
  primaryKeyword: string;
  primaryKeywordSlug: string;
  city?: string;
  zip?: string;
  county?: string;
  state: string;
  intent: string;
  slug?: string;
}

export interface PublishRequest {
  id: string;
  force?: boolean;
}

export interface BulkCsvRow {
  primary_keyword_slug: string;
  city?: string;
  zip?: string;
  county?: string;
  intent: string;
  slug?: string;
}
