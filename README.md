# ShieldHood App

A local SEO platform for Shield Hood Services that publishes location-based informational pages to help users understand commercial kitchen hood cleaning services and make informed decisions.

## Project Overview

This platform publishes educational, location-specific pages intended to help restaurant operators understand hood cleaning requirements, compliance, and service options. The system emphasizes:

- **Human-first content** - Written to genuinely help people understand their situation
- **Quality over volume** - Each page is manually reviewed before publishing
- **Local specificity** - Content is tailored to each city/state, not interchangeable
- **Long-term authority** - Built as an authority engine, not a content farm

## Architecture

- **Framework:** Next.js 15+ (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **AI Content Generation:** OpenAI GPT-4o-mini
- **Deployment:** Vercel (recommended) or any Node.js hosting

## Key Features

### Public-Facing Site
- Location-specific pages (`/locations/[slug]`)
- Services overview (`/services`)
- Contact page (`/contact`)
- Locations index (`/locations`)
- Homepage with featured locations

### Admin System
- Protected admin routes (`/admin/*`)
- Location CRUD operations
- AI-powered content generation
- Global settings management
- FAQ management (global and location-specific)
- Manual review workflow before publishing

### SEO Features
- Dynamic sitemap generation
- Robots.txt configuration
- Canonical URLs
- Structured data (LocalBusiness, FAQPage, BreadcrumbList)
- OpenGraph and Twitter Card metadata
- Server-side rendering for search engines

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (for content generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shieldhood-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for content generation
- `ADMIN_PASSWORD` - Password for admin area (Basic Auth)
- `NEXT_PUBLIC_BASE_URL` - Base URL for canonical URLs (optional)

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Usage

### Creating a Location Page

1. Navigate to `/admin/locations/new`
2. Enter city and state (required)
3. Optionally use AI generation:
   - Click "Generate with AI" to generate all content
   - Or generate specific sections (body, FAQ, testimonials)
4. Review and edit the generated content
5. Add any additional details (neighborhoods, landmarks, etc.)
6. Set `published: true` when ready to publish
7. Save the location

### AI Content Generation

The system uses OpenAI to generate location-specific content. The AI is instructed to:
- Write human-first, helpful content
- Avoid keyword stuffing or doorway-page tactics
- Reference real concerns and confusion operators face
- Never invent facts, statistics, or testimonials
- Create city-specific content that isn't interchangeable

**Important:** Always review AI-generated content before publishing. The system requires manual review to ensure quality.

### Admin Access

Admin routes are protected with Basic Authentication. When accessing `/admin/*` routes, you'll be prompted for credentials:
- Username: (any value, not checked)
- Password: Value of `ADMIN_PASSWORD` environment variable

### Global Settings

Configure global settings at `/admin/settings`:
- Business name
- Primary phone number
- Primary email
- Base domain (for canonical URLs)
- Default address (used when location-specific address isn't provided)
- Global FAQ items

## Content Quality Standards

Every page must meet these requirements:

1. **Human Experience** - Addresses real concerns, confusion, and situations
2. **Situational Awareness** - Reflects how issues unfold in that specific city/region
3. **Practical Clarity** - Explains what happens, what options exist, common mistakes
4. **Emotional Grounding** - Calm, respectful tone (never alarming or sales-driven)
5. **Specificity** - Content cannot be reused for another city without meaningful edits

### Required Page Sections

- Clear H1 aligned with search intent
- Short intro (2-3 sentences)
- Long intro (2 paragraphs)
- Main body (800-1200 words)
- **"What typically happens next"** section (explains the process flow)
- Services intro
- FAQs (4-8 questions)
- Internal links to relevant pages

## Database Schema

Key models:
- `GlobalSettings` - Site-wide configuration
- `Location` - Location-specific pages
- `Service` - Service offerings
- `LocationService` - Many-to-many relationship
- `Lead` - Contact form submissions
- `AIContentLog` - Tracks AI content generation

See `prisma/schema.prisma` for full schema.

## API Routes

### Public Routes
- `GET /api/locations` - List all locations
- `POST /api/lead` - Submit contact form

### Admin Routes (Protected)
- `GET /api/locations` - List all locations (admin view)
- `POST /api/locations` - Create location
- `GET /api/locations/[id]` - Get location
- `PATCH /api/locations/[id]` - Update location
- `DELETE /api/locations/[id]` - Delete location
- `POST /api/admin/generate-location-content` - Generate AI content
- `GET /api/settings` - Get global settings
- `PUT /api/settings` - Update global settings
- `POST /api/revalidate` - Revalidate Next.js cache

## SEO Best Practices

### For Search Engines
- All published pages are statically generated
- Dynamic sitemap includes all published locations
- Proper robots.txt configuration
- Canonical URLs prevent duplicate content

### For Users
- Fast page loads (static generation)
- Mobile-responsive design
- Clear navigation
- Helpful, informative content

## Development

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages (protected)
│   ├── api/                # API routes
│   ├── locations/          # Location pages
│   └── ...
├── components/             # React components
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── LocationForm.tsx
│   └── ...
└── lib/                    # Utility functions
    ├── data.ts            # Data fetching
    ├── seo.ts             # SEO utilities
    ├── faq.ts             # FAQ parsing
    └── prisma.ts          # Prisma client
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prisma for type-safe database access

## Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

Ensure:
- PostgreSQL database is accessible
- Environment variables are set
- Node.js 18+ is available

## Content Guidelines

### What Content Should Do
- Help users understand their situation
- Provide clarity and reassurance
- Explain next steps
- Reference real concerns and confusion

### What Content Must NOT Do
- Provide legal advice
- Make guarantees or outcome promises
- Use fear-based messaging
- Invent statistics or facts
- Feel mass-produced or automated

## Troubleshooting

### Database Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` is correct
- Run migrations: `npx prisma migrate dev`

### AI Generation Fails
- Verify `OPENAI_API_KEY` is set
- Check API key has sufficient credits
- Review error logs in console

### Pages Not Indexing
- Verify `published: true` is set
- Check robots.txt allows crawling
- Verify sitemap.xml is accessible
- Check canonical URLs are correct

## Contributing

1. Follow the content quality standards
2. Ensure all pages meet structural requirements
3. Test admin workflows before committing
4. Review AI-generated content before publishing

## License

[Add your license here]

## Support

For questions or issues, contact [your contact information].

---

**Remember:** Quality always beats volume. This system operates as a long-term authority engine, not a content farm.
