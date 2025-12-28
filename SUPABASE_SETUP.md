# Supabase Setup - Step by Step

## Step 1: Get Your Database URL from Supabase

1. Go to https://supabase.com and log in
2. Open your project (or create a new one)
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Copy the **URI** connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - Or use the **Connection pooling** URI (recommended for serverless)

## Step 2: Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Add these variables:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: Paste your Supabase connection string
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 2:**
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (from https://platform.openai.com/api-keys)
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 3:**
   - Name: `ADMIN_PASSWORD`
   - Value: Choose a strong password (e.g., `MySecurePassword123!`)
   - Environments: ✅ Production ✅ Preview ✅ Development

5. Click **Save** for each variable

## Step 3: Run Database Migrations

After adding DATABASE_URL, you need to create the database tables:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

**Option B: Using Supabase SQL Editor**
1. Go to Supabase → **SQL Editor**
2. Copy and paste the SQL from `prisma/migrations` folder
3. Or run: `npx prisma migrate deploy` locally with DATABASE_URL set

**Option C: Using Prisma Studio (Easiest)**
```bash
# Set DATABASE_URL locally
export DATABASE_URL="your-supabase-connection-string"

# Push schema (creates tables)
npx prisma db push

# Optional: Seed data
npx prisma db seed
```

## Step 4: Redeploy

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click the **⋯** menu on latest deployment
4. Click **Redeploy**

Or just push a new commit:
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

## Step 5: Verify

1. Wait for deployment to finish
2. Visit your site URL
3. Check that pages load (they'll use defaults if database is empty)
4. Go to `/admin` and test login with your ADMIN_PASSWORD

## Done! ✅

Your site should now be working with Supabase.

---

## Quick Troubleshooting

**Build still fails?**
- Check DATABASE_URL is correct (no extra spaces)
- Make sure password in connection string is URL-encoded
- Verify Supabase allows connections from Vercel IPs (should work by default)

**Pages show errors?**
- Run migrations: `npx prisma migrate deploy`
- Check Supabase → Database → Tables to see if tables exist

**Admin area not working?**
- Verify ADMIN_PASSWORD is set in Vercel
- Check browser console for errors
