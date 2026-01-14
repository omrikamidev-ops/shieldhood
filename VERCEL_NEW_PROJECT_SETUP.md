# Vercel New Project Setup Guide for hoodscleaning.net

## Step-by-Step Instructions

### Step 1: Import Repository
1. **Click "Import"** next to the "shieldhood" repository in the left column
2. This will import your existing GitHub repository

### Step 2: Configure Project Settings
After clicking Import, you'll see the project configuration screen:

#### Project Name
- **Name:** `hoodscleaning` (or `hoodscleaning-app`)
- This is just for Vercel's internal reference

#### Framework Preset
- **Framework:** Next.js (should auto-detect)
- **Build Command:** `npm run build` (should auto-detect)
- **Output Directory:** `.next` (should auto-detect)
- **Install Command:** `npm install` (should auto-detect)

#### Root Directory
- Leave as **`.`** (root of repository)

### Step 3: Add Environment Variables
**CRITICAL:** Add these BEFORE your first deployment:

Click **"Environment Variables"** section and add:

1. **`DATABASE_URL`**
   - Value: `postgresql://postgres:OmriIsDaBomb01@db.gubaubuwohrrqlaylecn.supabase.co:5432/postgres`
   - Environment: Select **Production**, **Preview**, and **Development**

2. **`OPENAI_API_KEY`**
   - Value: Your OpenAI API key
   - Environment: Select **Production**, **Preview**, and **Development**

3. **`ADMIN_PASSWORD`**
   - Value: `HoodCleaning#Secure` (or your preferred password)
   - Environment: Select **Production**, **Preview**, and **Development**

4. **`NEXT_PUBLIC_BASE_URL`** (Optional but recommended)
   - Value: `https://hoodscleaning.net`
   - Environment: Select **Production**, **Preview**, and **Development**

### Step 4: Deploy
1. Click **"Deploy"** button
2. Wait for the build to complete (should take 2-3 minutes)
3. Note the deployment URL (e.g., `https://hoodscleaning-xxx.vercel.app`)

### Step 5: Configure Domain
After deployment succeeds:

1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `hoodscleaning.net`
4. Click **"Add"**
5. Vercel will show DNS configuration instructions:
   - **Type:** A or CNAME
   - **Name:** `@` or `www`
   - **Value:** Vercel's provided value
6. Update your DNS records at your domain registrar
7. Wait for DNS propagation (5-60 minutes)

### Step 6: Verify Deployment
1. Visit `https://hoodscleaning.net` (once DNS propagates)
2. Visit `https://hoodscleaning.net/admin`
3. You should see the admin login prompt
4. Enter password: `HoodCleaning#Secure`

### Step 7: Run Database Migrations (If Needed)
If you haven't run migrations yet:

1. Go to your local terminal
2. Run:
```bash
export DATABASE_URL="postgresql://postgres:OmriIsDaBomb01@db.gubaubuwohrrqlaylecn.supabase.co:5432/postgres"
npx prisma db push
npx prisma db seed
```

## Troubleshooting

### If Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

### If Admin Page Shows 500 Error
- Check Vercel Function Logs (Runtime Logs)
- Verify `ADMIN_PASSWORD` is set correctly
- Check middleware.ts is deployed correctly

### If Domain Doesn't Work
- Verify DNS records are correct
- Check DNS propagation: https://dnschecker.org
- Wait up to 24 hours for full propagation

## Important Notes

✅ **Do NOT** copy settings from the old project - start fresh
✅ **Do** add all environment variables before first deployment
✅ **Do** wait for DNS propagation before testing the domain
✅ **Do** verify the admin page works after deployment

## What This Fixes

- Fresh Vercel project eliminates any cached configuration issues
- Clean deployment environment for `hoodscleaning.net`
- Proper domain configuration from the start
- All environment variables properly configured
