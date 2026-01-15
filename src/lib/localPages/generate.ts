/**
 * Main generation pipeline for Local SEO pages
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { generateLocalPageContent, PROMPT_VERSION } from './openai';
import { validateContent } from './validation';
import { calculateUniquenessScore } from './similarity';
import { renderLocalPageHtml } from './render';
import type { GenerateDraftRequest, LocalPageContent, SafetyFlag } from './types';
import { isValidPrimaryKeyword } from '@/lib/localPagesConfig';

export async function generateLocalPageDraft(request: GenerateDraftRequest) {
  const { primaryKeywordSlug, city, zip, county, state, intent, slug: providedSlug } = request;
  const keywordDisplay = primaryKeywordSlug
    .split('-')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ')
    .trim();

  // Validate primary keyword
  if (!isValidPrimaryKeyword(primaryKeywordSlug)) {
    throw new Error(`Invalid primary keyword: ${primaryKeywordSlug}`);
  }

  // Must provide city or zip
  if (!city && !zip) {
    throw new Error('Must provide either city or zip');
  }

  // ZIP must be 5 digits
  if (zip && !/^\d{5}$/.test(zip)) {
    throw new Error('ZIP must be 5 digits');
  }

  // Generate slug if not provided
  const slug =
    providedSlug ||
    (zip
      ? `/${primaryKeywordSlug}-${zip}`
      : city
        ? `/${primaryKeywordSlug}/${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`
        : '');

  if (!slug) {
    throw new Error('Unable to generate slug. Must provide city or zip.');
  }

  // Check if slug already exists
  const existing = await prisma.localPage.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`Slug already exists: ${slug}`);
  }

  // Get local city context if available
  const cityContext = city
    ? await prisma.localCityContext.findFirst({
        where: { city: { equals: city, mode: 'insensitive' }, state },
      })
    : zip
      ? await prisma.localCityContext.findUnique({ where: { zip } })
      : null;

  // Generate content (retry once if quality flags are triggered)
  const retryFlags = new Set<SafetyFlag>([
    'low_word_count',
    'insufficient_faq',
    'insufficient_sections',
    'low_city_mentions',
  ]);
  let content: LocalPageContent;
  let safetyFlags: SafetyFlag[] = [];
  let attempt = 0;

  do {
    attempt += 1;
    content = await generateLocalPageContent(
      keywordDisplay || primaryKeywordSlug,
      city || '',
      state,
      county,
      zip,
      cityContext?.localNotes || undefined,
      { strict: attempt > 1 },
    );
    safetyFlags = validateContent(content, city || zip || '', state);
  } while (attempt < 2 && safetyFlags.some((flag) => retryFlags.has(flag)));

  // Calculate uniqueness
  const existingPages = await prisma.localPage.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 80,
    select: { renderedHtml: true },
  });

  const draftText = `${content.shortIntro} ${content.longIntro} ${content.mainBody}`;
  const existingTexts = existingPages.map((p) => p.renderedHtml);
  const uniquenessScore = calculateUniquenessScore(draftText, existingTexts);

  if (uniquenessScore < 0.9) {
    safetyFlags.push('high_similarity');
  }

  // Render HTML
  const renderedHtml = renderLocalPageHtml(content, city || zip || '', state);

  // Build internal links
  const internalLinks = [
    { text: 'Locations Hub', url: `/${primaryKeywordSlug}/locations/` },
    { text: 'Contact Us', url: '/contact' },
  ];

  // Create draft
  const localPage = await prisma.localPage.create({
    data: {
      primaryKeyword: primaryKeywordSlug,
      primaryKeywordSlug,
      city: city || '',
      zip: zip || null,
      county: county || null,
      state,
      slug,
      title: content.title,
      metaDescription: content.metaDescription,
      h1: content.h1,
      contentJson: content as unknown as Prisma.InputJsonValue,
      renderedHtml,
      faqJson: content.locationFAQ as unknown as Prisma.InputJsonValue,
      internalLinksJson: internalLinks as unknown as Prisma.InputJsonValue,
      uniquenessScore: uniquenessScore,
      safetyFlags: safetyFlags as string[],
      status: 'draft',
    },
  });

  // Log generation
  await prisma.localPageGenerationLog.create({
    data: {
      localPageId: localPage.id,
      slug: localPage.slug,
      promptVersion: PROMPT_VERSION,
      status: safetyFlags.length > 0 ? 'flagged' : 'success',
      similarityScore: 1 - uniquenessScore,
      safetyFlags: safetyFlags as string[],
    },
  });

  return localPage;
}
