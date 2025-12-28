# How to Get Your Supabase DATABASE_URL

## Step-by-Step Instructions

### Step 1: Log into Supabase
1. Go to: **https://supabase.com**
2. Click **"Sign in"** (top right)
3. Log in with your account

### Step 2: Open Your Project
1. After logging in, you'll see your projects
2. Click on your project (or create a new one if you don't have one)

### Step 3: Go to Settings
1. In your project dashboard, look at the **left sidebar**
2. Click the **⚙️ Settings** icon (gear icon, usually at the bottom)
3. Or click **"Project Settings"**

### Step 4: Go to Database Settings
1. In the Settings menu, click **"Database"** (in the left sidebar)
2. Scroll down to find **"Connection string"** section

### Step 5: Copy the Connection String
You'll see tabs: **URI**, **JDBC**, **Golang**, etc.

**Option A: Use URI (Direct Connection)**
1. Click the **"URI"** tab
2. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. **Replace `[YOUR-PASSWORD]`** with your actual database password
   - If you don't know it: Click **"Reset database password"** button
   - Copy the new password
   - Replace `[YOUR-PASSWORD]` in the connection string

**Option B: Use Connection Pooling (Recommended for Vercel)**
1. In the same section, look for **"Connection pooling"** tab
2. Click it
3. Copy the **"Session mode"** or **"Transaction mode"** URI
4. It looks like:
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[PASSWORD]` with your database password

### Step 6: Copy the Full URL
- Copy the **entire connection string**
- It should look like:
  ```
  postgresql://postgres.xxxxx:yourpassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

## What to Do With It

Once you have the connection string:

1. **Add to Vercel:**
   - Vercel → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` = your connection string

2. **Or use locally:**
   ```bash
   export DATABASE_URL="your-connection-string-here"
   npx prisma db push
   ```

## Visual Guide

The connection string section looks like this:

```
Connection string
┌─────────────────────────────────────────┐
│ URI │ JDBC │ Golang │ ...               │
├─────────────────────────────────────────┤
│                                         │
│ postgresql://postgres:[YOUR-PASSWORD]@ │
│ db.xxxxx.supabase.co:5432/postgres     │
│                                         │
│ [Copy] button                           │
└─────────────────────────────────────────┘
```

## Quick Checklist

- [ ] Logged into Supabase
- [ ] Opened your project
- [ ] Went to Settings → Database
- [ ] Found "Connection string" section
- [ ] Copied the URI (or Connection pooling URI)
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] Copied the complete connection string

## Need Help Finding Your Password?

If you don't know your database password:
1. In Supabase → Settings → Database
2. Look for **"Database password"** section
3. Click **"Reset database password"**
4. Copy the new password
5. Use it in your connection string

---

**That's it!** Once you have the connection string, paste it as `DATABASE_URL` in Vercel or use it locally.
