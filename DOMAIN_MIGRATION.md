# Domain Migration: shieldhoodservice.com → hoodscleaning.net

## ✅ Migration Complete

All domain references have been updated from `shieldhoodservice.com` to `hoodscleaning.net`.

## Files Updated

### Core Application Files:
1. ✅ `src/lib/data.ts` - Default baseDomain updated
2. ✅ `src/app/layout.tsx` - metadataBase updated
3. ✅ `src/lib/seo.ts` - Fallback domain updated
4. ✅ `src/app/robots.ts` - Fallback domain updated
5. ✅ `src/app/sitemap.ts` - Fallback domain updated
6. ✅ `src/components/SettingsForm.tsx` - Placeholder updated
7. ✅ `prisma/seed.ts` - Seed data domain and email updated

### Documentation:
8. ✅ `VERCEL_DEPLOYMENT.md` - Example domain updated

## What Was Changed

### Domain References:
- **Old:** `https://shieldhoodservice.com`
- **New:** `https://hoodscleaning.net`

### Email References:
- **Old:** `hello@shieldhoodservice.com`
- **New:** `hello@hoodscleaning.net`

## Functions Verified ✅

All functions will work correctly with the new domain:

### ✅ Canonical URLs
- Uses `settings.baseDomain` dynamically
- Fallback: `https://hoodscleaning.net`
- Location pages: `https://hoodscleaning.net/locations/[slug]`

### ✅ SEO Metadata
- `metadataBase` in layout.tsx: `https://hoodscleaning.net`
- OpenGraph URLs use canonical URLs
- Twitter Card URLs use canonical URLs

### ✅ Sitemap
- Uses `settings.baseDomain` dynamically
- Fallback: `https://hoodscleaning.net`
- All URLs will be: `https://hoodscleaning.net/...`

### ✅ Robots.txt
- Sitemap URL uses `settings.baseDomain`
- Fallback: `https://hoodscleaning.net`

### ✅ Structured Data (JSON-LD)
- LocalBusiness schema: Uses canonical URL
- BreadcrumbList schema: Uses baseDomain
- FAQPage schema: No domain dependency

### ✅ Admin Settings
- Admin can update `baseDomain` in Settings
- Form placeholder shows new domain
- Changes persist in database

## Next Steps

### 1. Update Database (If Already Deployed)
If you've already deployed and have data in the database:

1. Go to `/admin/settings`
2. Update **Base domain** to: `https://hoodscleaning.net`
3. Update **Primary email** to: `hello@hoodscleaning.net` (if needed)
4. Save settings

### 2. Update Vercel Environment Variables
If you have `NEXT_PUBLIC_BASE_URL` set:
- Update it to: `https://hoodscleaning.net`

### 3. DNS Configuration
Point your DNS to Vercel:
- Add `hoodscleaning.net` as a domain in Vercel
- Configure DNS records as instructed by Vercel
- Wait for DNS propagation (usually 5-60 minutes)

### 4. SSL Certificate
- Vercel will automatically provision SSL for `hoodscleaning.net`
- Usually takes a few minutes after DNS is configured

### 5. Test After DNS is Live
- ✅ Visit `https://hoodscleaning.net`
- ✅ Check canonical URLs in page source
- ✅ Verify sitemap: `https://hoodscleaning.net/sitemap.xml`
- ✅ Check robots.txt: `https://hoodscleaning.net/robots.txt`
- ✅ Test admin area: `https://hoodscleaning.net/admin`

## Verification Checklist

- [x] All hardcoded domains updated
- [x] Fallback domains updated
- [x] Seed data updated
- [x] Canonical URLs use dynamic baseDomain
- [x] SEO metadata uses new domain
- [x] Sitemap uses new domain
- [x] Robots.txt uses new domain
- [x] Structured data uses new domain
- [ ] DNS configured (your step)
- [ ] Domain added to Vercel (your step)
- [ ] Settings updated in admin (if database exists)

## Important Notes

1. **Database Settings:** If you have existing data, update `baseDomain` in admin settings
2. **No Code Changes Needed:** All URLs are built dynamically from `settings.baseDomain`
3. **Backward Compatible:** Old URLs will redirect if you set up redirects in Vercel
4. **Same Functionality:** All features work exactly the same, just with new domain

## Rollback (If Needed)

If you need to rollback:
1. Revert the git commit
2. Update database settings to old domain
3. Or simply update `baseDomain` in admin settings

---

**Status:** ✅ Ready for DNS configuration and deployment!
