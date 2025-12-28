# Simple Supabase Setup - Copy & Paste Guide

## What You Need (3 Things)

1. **DATABASE_URL** from Supabase
2. **OPENAI_API_KEY** from OpenAI  
3. **ADMIN_PASSWORD** (you choose this)

---

## Step 1: Get DATABASE_URL from Supabase

### A. Log into Supabase
1. Go to: https://supabase.com
2. Click **"Start your project"** or **"Sign in"**
3. Log in with your account

### B. Open Your Project
1. You'll see your projects list
2. Click on your project (or create a new one)

### C. Get the Connection String
1. In your project, click **Settings** (gear icon, bottom left)
2. Click **Database** (in the left sidebar)
3. Scroll down to **"Connection string"** section
4. You'll see tabs: **URI**, **JDBC**, **Golang**, etc.
5. Click the **URI** tab
6. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. **Copy this entire string**
8. Replace `[YOUR-PASSWORD]` with your actual database password
   - If you don't know it: Click **"Reset database password"** in Supabase
   - Or use the **Connection pooling** URI (recommended - it's in the same section)

### D. Use Connection Pooling (Recommended)
- In the same **Connection string** section
- Look for **"Connection pooling"** tab
- Copy that URI instead (it's better for Vercel)
- It looks like: `postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

---

## Step 2: Add to Vercel

### A. Go to Vercel
1. Go to: https://vercel.com
2. Log in
3. Click on your **shieldhood** project

### B. Add Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Click **"Add New"** button

### Add Variable 1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** Paste your Supabase connection string (from Step 1)
- **Environments:** Check all ✅ Production ✅ Preview ✅ Development
- Click **Save**

### Add Variable 2: OPENAI_API_KEY
- **Name:** `OPENAI_API_KEY`
- **Value:** Your OpenAI API key
  - Get it from: https://platform.openai.com/api-keys
  - Click "Create new secret key"
  - Copy the key (starts with `sk-`)
- **Environments:** Check all ✅ Production ✅ Preview ✅ Development
- Click **Save**

### Add Variable 3: ADMIN_PASSWORD
- **Name:** `ADMIN_PASSWORD`
- **Value:** Choose a password (e.g., `MySecurePass123!`)
- **Environments:** Check all ✅ Production ✅ Preview ✅ Development
- Click **Save**

---

## Step 3: Create Database Tables

### Option 1: Using Terminal (Easiest)

1. Open your terminal
2. Go to your project folder:
   ```bash
   cd "/Users/edosmacmini/Desktop/Projects/Omri/ ShieldHood Service/shieldhood-app"
   ```

3. Set your DATABASE_URL:
   ```bash
   export DATABASE_URL="paste-your-supabase-connection-string-here"
   ```

4. Create the tables:
   ```bash
   npx prisma db push
   ```

5. (Optional) Add sample data:
   ```bash
   npx prisma db seed
   ```

**Done!** ✅

---

## Step 4: Redeploy in Vercel

1. Go back to Vercel dashboard
2. Click **Deployments** (top menu)
3. Find your latest deployment
4. Click the **⋯** (three dots) menu
5. Click **Redeploy**

Or just push an empty commit:
```bash
git commit --allow-empty -m "redeploy"
git push
```

---

## Step 5: Test

1. Wait for Vercel to finish deploying (2-3 minutes)
2. Visit your site URL
3. Go to `/admin` 
4. Log in with your ADMIN_PASSWORD
5. You should see the admin dashboard!

---

## Troubleshooting

**"Can't connect to database"**
- Check DATABASE_URL has no extra spaces
- Make sure password is correct
- Try the Connection Pooling URI instead

**"Tables don't exist"**
- Run: `npx prisma db push` again
- Check Supabase → Database → Tables to see if they're there

**"Build still fails"**
- Make sure all 3 variables are added in Vercel
- Check they're enabled for Production environment
- Redeploy after adding variables

---

## Quick Copy-Paste Commands

Once you have your DATABASE_URL:

```bash
# Set the connection string
export DATABASE_URL="your-supabase-connection-string-here"

# Create tables
npx prisma db push

# Add sample data (optional)
npx prisma db seed
```

That's it! 🎉
