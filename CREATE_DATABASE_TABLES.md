# Create Database Tables - Step by Step

## The Problem
You're getting: `relation "GlobalSettings" does not exist`

This means the database tables haven't been created yet. Let's fix this!

## Solution: Create Tables with Prisma

### Step 1: Get Your DATABASE_URL

1. Go to Supabase → Your Project → Settings → Database
2. Copy the **Connection string** (URI or Connection pooling)
3. Replace `[YOUR-PASSWORD]` with your actual password

### Step 2: Set DATABASE_URL Locally

Open your terminal and run:

```bash
cd "/Users/edosmacmini/Desktop/Projects/Omri/ ShieldHood Service/shieldhood-app"

# Set your DATABASE_URL (replace with your actual connection string)
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

**Or use Connection Pooling (Recommended):**
```bash
export DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### Step 3: Create the Tables

Run this command:

```bash
npx prisma db push
```

This will:
- ✅ Create all tables (GlobalSettings, Location, Service, etc.)
- ✅ Set up relationships
- ✅ Create indexes

### Step 4: Verify Tables Were Created

**Option A: Check in Supabase**
1. Go to Supabase → Table Editor
2. You should see these tables:
   - GlobalSettings
   - Location
   - Service
   - LocationService
   - Lead
   - AIContentLog

**Option B: Check via Terminal**
```bash
npx prisma studio
```
This opens a visual database browser at http://localhost:5555

### Step 5: (Optional) Add Sample Data

If you want sample data:

```bash
npx prisma db seed
```

This adds:
- Default global settings
- Sample locations (LA, Orange County, Phoenix)
- Sample services

### Step 6: Update Domain in Settings

**Now** you can update the domain:

**Option A: Via Admin Panel**
1. Go to: `https://hoodscleaning.net/admin/settings`
2. Update "Base domain" to: `https://hoodscleaning.net`
3. Save

**Option B: Via Supabase SQL Editor**
```sql
UPDATE "GlobalSettings"
SET "baseDomain" = 'https://hoodscleaning.net'
WHERE id = 1;
```

**Option C: Via Supabase Table Editor**
1. Supabase → Table Editor → GlobalSettings
2. Edit the row
3. Change `baseDomain` to: `https://hoodscleaning.net`
4. Save

## Quick One-Liner

If you have your DATABASE_URL ready:

```bash
export DATABASE_URL="your-connection-string-here" && npx prisma db push
```

## Troubleshooting

**"Can't connect to database"**
- Check DATABASE_URL is correct
- Make sure password is correct (no extra spaces)
- Try Connection Pooling URI instead

**"Permission denied"**
- Make sure your Supabase database allows connections
- Check if IP restrictions are blocking you

**"Tables still don't exist"**
- Make sure `npx prisma db push` completed successfully
- Check Supabase → Table Editor to verify

**"prisma: command not found"**
- Run: `npm install` first
- Or: `npx prisma db push` (npx will use local version)

## After Tables Are Created

Once tables exist, you can:
1. ✅ Access admin panel: `/admin`
2. ✅ Update settings: `/admin/settings`
3. ✅ Create locations: `/admin/locations/new`
4. ✅ Everything will work!

---

**The key:** Run `npx prisma db push` first to create the tables, THEN you can update the domain settings.
