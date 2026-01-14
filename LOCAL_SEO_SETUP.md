# Local SEO System Setup Guide

This guide will help you set up the Local SEO pages system for hoodscleaning.net.

## Overview

The Local SEO system allows you to generate, review, and publish location-based SEO pages at scale. It includes:

- **Database tables**: `LocalPage`, `LocalPageGenerationLog`, `LocalCityContext`
- **Admin UI**: `/admin/local-pages` with Generate Draft, Bulk CSV, and Recent Pages tabs
- **Public pages**: Dynamic routes for city and ZIP-based pages
- **Locations hubs**: Hub pages that list all published pages for each keyword
- **Content generation**: AI-powered content with quality validation and uniqueness scoring

## Step 1: Database Migration

Run the Prisma migration to create the new tables:

```bash
npx prisma migrate dev --name add_local_seo_tables
npx prisma generate
```

This creates:
- `LocalPage` - Stores generated local SEO pages
- `LocalPageGenerationLog` - Tracks generation history
- `LocalCityContext` - Optional local notes/resources by city/ZIP

## Step 2: Environment Variables

Ensure these are set in your `.env` and Vercel:

- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- `OPENAI_API_KEY` - OpenAI API key for content generation
- `ADMIN_PASSWORD` - Password for admin routes
- `NEXT_PUBLIC_BASE_URL` - Base URL (https://hoodscleaning.net)

## Step 3: Verify Setup

1. **Check admin access**: Visit `https://hoodscleaning.net/admin/local-pages`
2. **Verify database**: Tables should exist in Supabase
3. **Test generation**: Try generating a draft page

## Step 4: Generate Your First Page

1. Go to `/admin/local-pages`
2. Select "Generate Draft" tab
3. Fill in:
   - Primary Keyword: `hood-cleaning`
   - Intent: `information`
   - Location Type: `City`
   - City: `Los Angeles`
   - County: `Los Angeles` (optional)
   - Slug: Auto-generated (editable)
4. Click "Generate Draft"
5. Review the draft in "Recent Pages" tab
6. Click "Publish" when ready

## Step 5: Bulk Generation (CSV)

1. Prepare a CSV file with this format:
```csv
primary_keyword_slug,city,zip,county,intent,slug
hood-cleaning,Los Angeles,,Los Angeles,information,
hood-cleaning,,90001,Los Angeles,information,/hood-cleaning-90001
kitchen-exhaust-cleaning,San Diego,,San Diego,information,
```

2. Go to "Bulk CSV" tab
3. Paste CSV content
4. Enable "Skip existing slugs" if desired
5. Click "Generate Drafts"
6. Monitor the log panel for progress

## Primary Keywords

Available keywords (configured in `src/lib/localPagesConfig.ts`):

- `hood-cleaning` - Hood Cleaning
- `kitchen-exhaust-cleaning` - Kitchen Exhaust Cleaning
- `commercial-hood-cleaning` - Commercial Hood Cleaning
- `restaurant-hood-cleaning` - Restaurant Hood Cleaning

## URL Structure

### City Pages
- Pattern: `/{keywordSlug}/{city}-{state}`
- Example: `/hood-cleaning/los-angeles-ca`

### ZIP Pages
- Pattern: `/{keywordSlug}-{zip}`
- Example: `/hood-cleaning-90001`

### Locations Hub
- Pattern: `/{keywordSlug}/locations/`
- Example: `/hood-cleaning/locations/`

## Content Quality

All generated content includes:

- **Validation**: Safety flags for low quality, similarity, missing elements
- **Uniqueness scoring**: Jaccard similarity vs existing pages
- **Required sections**: H1, intro, main body, "what typically happens next", FAQs
- **Local context**: City/state mentions, local references

## Publishing Workflow

1. **Generate Draft** - Creates draft with validation
2. **Review** - Check uniqueness score and safety flags
3. **Publish** - Requires confirmation if flags exist
4. **Unpublish** - Can unpublish to make edits

## Safety Flags

Pages may have safety flags:
- `low_word_count` - Less than 750 words
- `low_city_mentions` - Less than 6 location mentions
- `low_local_context` - Insufficient local paragraphs
- `insufficient_sections` - Less than 4 sections
- `insufficient_faq` - Less than 5 FAQs
- `high_similarity` - Uniqueness below 90%
- `prohibited_claims` - Contains prohibited language

You can publish with flags using "force" mode (with confirmation).

## Troubleshooting

### "Slug already exists"
- Change the slug before generating
- Or use "Skip existing slugs" in bulk CSV

### "Invalid primary keyword"
- Use one of the configured keywords from `localPagesConfig.ts`

### "Failed to generate draft"
- Check `OPENAI_API_KEY` is set
- Verify API key has credits
- Check console logs for details

### Pages not appearing
- Ensure pages are `published` (not `draft`)
- Check sitemap includes local pages
- Verify routes match slug pattern

## Next Steps

1. Generate initial batch of pages for major cities
2. Review and publish high-quality drafts
3. Monitor uniqueness scores
4. Add local city context for important locations
5. Link to locations hubs from homepage/footer

## Support

For issues or questions:
- Check console logs for errors
- Review Prisma schema for data structure
- Verify environment variables are set
- Test API routes directly if needed
