# Vercel Deployment Guide

## Required Environment Variables

Add these in your Vercel project settings (Settings → Environment Variables):

### Required:
- **`DATABASE_URL`** - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?sslmode=require`
  - Get from your database provider (Vercel Postgres, Neon, Supabase, etc.)

- **`OPENAI_API_KEY`** - OpenAI API key for content generation
  - Get from: https://platform.openai.com/api-keys

- **`ADMIN_PASSWORD`** - Password for admin area (Basic Auth)
  - Use a strong password for production

### Optional:
- **`NEXT_PUBLIC_BASE_URL`** - Your production domain
  - Example: `https://shieldhoodservice.com`
  - Used for canonical URLs

## Setup Steps

1. **Connect Repository:**
   - Import your GitHub repository in Vercel
   - Vercel will auto-detect Next.js

2. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables above
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

3. **Database Setup:**
   - If using Vercel Postgres:
     - Add Vercel Postgres integration
     - `DATABASE_URL` will be auto-populated
   - If using external database:
     - Add `DATABASE_URL` manually
     - Ensure database allows connections from Vercel IPs

4. **Run Database Migrations:**
   - After first deployment, run migrations:
   ```bash
   npx prisma migrate deploy
   ```
   - Or use Vercel's build command to include migrations

5. **Deploy:**
   - Push to `main` branch
   - Vercel will auto-deploy
   - Or trigger manual deployment from dashboard

## Build Configuration

The project is configured to:
- Generate Prisma Client during build (`prisma generate`)
- Handle missing DATABASE_URL gracefully (falls back to defaults)
- Build static pages where possible
- Use ISR (Incremental Static Regeneration) for location pages

## Troubleshooting

### Build Fails with "DATABASE_URL not found"
- ✅ **Solution:** Add `DATABASE_URL` in Vercel Environment Variables
- The build will complete but pages will use fallback defaults until DATABASE_URL is set

### Pages Show Default Content
- ✅ **Solution:** Ensure `DATABASE_URL` is set and database is accessible
- Run migrations: `npx prisma migrate deploy`
- Seed database if needed: `npx prisma db seed`

### Admin Area Not Accessible
- ✅ **Solution:** Set `ADMIN_PASSWORD` environment variable
- Use Basic Auth when accessing `/admin/*` routes

### Next.js Security Warning
- ✅ **Fixed:** Updated to Next.js 16.0.4+ (run `npm install` locally and push)

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded (if needed)
- [ ] Admin password set
- [ ] Test admin area access
- [ ] Verify location pages load correctly
- [ ] Check sitemap.xml is accessible
- [ ] Verify robots.txt is correct

## Database Providers

### Recommended Options:
1. **Vercel Postgres** - Integrated, easy setup
2. **Neon** - Serverless Postgres, free tier available
3. **Supabase** - Full-featured, includes auth
4. **Railway** - Simple Postgres hosting
5. **Render** - Managed Postgres

All support PostgreSQL and work with Prisma.
