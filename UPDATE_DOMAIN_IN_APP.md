# How to Update Domain in Your App (After DNS is Setup)

## Important: You Don't Change Domain in Supabase!

Supabase is just your database - it doesn't need domain configuration. The domain is stored **in your app's database** and configured through the **admin panel**.

## Step-by-Step: Update Domain in Admin Settings

### Step 1: Deploy Your App First
Make sure your app is deployed on Vercel and accessible:
- Visit: `https://hoodscleaning.net` (or your Vercel URL if DNS isn't live yet)
- The app should load (even if DNS isn't configured yet)

### Step 2: Access Admin Panel
1. Go to: `https://hoodscleaning.net/admin`
   - Or: `https://your-vercel-url.vercel.app/admin`
2. Your browser will ask for login:
   - **Username:** Anything (can be blank)
   - **Password:** Your `ADMIN_PASSWORD` (the one you set in Vercel environment variables)
3. Click **Sign in**

### Step 3: Go to Settings
1. In the admin panel, look for **"Settings"** in the navigation
2. Click **"Settings"** (or go to: `https://hoodscleaning.net/admin/settings`)

### Step 4: Update Base Domain
1. Find the field labeled **"Base domain (for canonical)"**
2. Change it from: `https://shieldhoodservice.com`
3. To: `https://hoodscleaning.net`
4. Make sure there's no trailing slash: `https://hoodscleaning.net` ✅ (not `https://hoodscleaning.net/`)

### Step 5: Update Email (Optional)
1. Find **"Primary email"** field
2. Change from: `hello@shieldhoodservice.com`
3. To: `hello@hoodscleaning.net` (or your preferred email)

### Step 6: Save
1. Scroll down
2. Click **"Update settings"** or **"Save"** button
3. Wait for confirmation message

### Step 7: Verify
1. Visit any location page: `https://hoodscleaning.net/locations/[any-slug]`
2. Right-click → **"View Page Source"**
3. Search for: `canonical`
4. You should see: `<link rel="canonical" href="https://hoodscleaning.net/locations/...">`

## If You Can't Access Admin Panel

### Option A: Database is Empty (No Settings Yet)
If you haven't created any settings yet, the app will use the default domain (`hoodscleaning.net`) automatically. You're already set!

### Option B: Update via Database Directly
If you can't access admin, you can update directly in Supabase:

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Open your project

2. **Go to Table Editor:**
   - Click **"Table Editor"** in left sidebar
   - Find **"GlobalSettings"** table
   - Click on it

3. **Update the Record:**
   - Find the row (there should be one)
   - Click to edit
   - Change `baseDomain` field to: `https://hoodscleaning.net`
   - Change `primaryEmail` to: `hello@hoodscleaning.net` (optional)
   - Click **Save**

### Option C: Use SQL Editor
1. In Supabase, go to **"SQL Editor"**
2. Run this SQL:
   ```sql
   UPDATE "GlobalSettings"
   SET "baseDomain" = 'https://hoodscleaning.net',
       "primaryEmail" = 'hello@hoodscleaning.net'
   WHERE id = 1;
   ```
3. Click **Run**

## Visual Guide: Finding Settings in Admin

```
Admin Dashboard
├── Locations
│   ├── All locations
│   └── New location
├── Settings  ← CLICK HERE
└── (other menu items)

Settings Page
├── Business name: Shield Hood Services
├── Primary phone: (844) 555-0100
├── Primary email: hello@hoodscleaning.net
├── Base domain: https://hoodscleaning.net  ← UPDATE THIS
├── Default address fields...
└── [Update settings button]
```

## Quick Checklist

- [ ] App is deployed on Vercel
- [ ] Can access `/admin` with ADMIN_PASSWORD
- [ ] Went to `/admin/settings`
- [ ] Updated "Base domain" to `https://hoodscleaning.net`
- [ ] Updated "Primary email" (optional)
- [ ] Clicked Save
- [ ] Verified canonical URLs show new domain

## Troubleshooting

**"I can't find Settings"**
- Make sure you're logged into admin (`/admin`)
- Look for "Settings" in the navigation menu
- Or go directly to: `/admin/settings`

**"Settings page is blank"**
- This means no settings exist yet
- The app will use defaults (already set to `hoodscleaning.net`)
- You can create settings by filling the form and saving

**"Can't login to admin"**
- Check `ADMIN_PASSWORD` is set in Vercel environment variables
- Use that exact password (case-sensitive)

**"Domain still shows old domain"**
- Clear browser cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check page source to verify canonical URL

---

**Remember:** Supabase is just the database storage. The domain configuration is in your app's `GlobalSettings` table, which you update through the admin panel or directly in Supabase's table editor.
