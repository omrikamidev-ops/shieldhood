# How to Verify Domain in Supabase

## Step-by-Step: Check GlobalSettings Table

### Step 1: Open GlobalSettings Table
1. In the Supabase Table Editor (left sidebar)
2. Click on **"GlobalSettings"** table
3. The table will open in the main area

### Step 2: Check the Domain
You should see a row with:
- **id**: `1`
- **baseDomain**: `https://hoodscleaning.net` ✅
- **primaryEmail**: `hello@hoodscleaning.net` ✅
- **businessName**: `Shield Hood Services`
- **primaryPhone**: `(844) 555-0100`

### Step 3: If Domain is Wrong
If you see the old domain (`shieldhoodservice.com`):

**Option A: Edit Directly**
1. Click on the row (or click the edit icon)
2. Find `baseDomain` column
3. Change to: `https://hoodscleaning.net`
4. Click **Save** or press Enter

**Option B: Use SQL Editor**
1. Click **"SQL Editor"** in left sidebar
2. Run this SQL:
   ```sql
   UPDATE "GlobalSettings"
   SET "baseDomain" = 'https://hoodscleaning.net',
       "primaryEmail" = 'hello@hoodscleaning.net'
   WHERE id = 1;
   ```
3. Click **Run**

## What You Should See

When you click on **GlobalSettings**, you should see:

| Column | Value |
|--------|-------|
| id | 1 |
| businessName | Shield Hood Services |
| primaryPhone | (844) 555-0100 |
| primaryEmail | hello@hoodscleaning.net |
| **baseDomain** | **https://hoodscleaning.net** ✅ |
| defaultStreetAddress | 123 Service Lane |
| defaultCity | Los Angeles |
| defaultState | CA |
| defaultZip | 90012 |
| defaultCountry | USA |

## Quick Check

1. ✅ Click **GlobalSettings** table
2. ✅ Look for `baseDomain` column
3. ✅ Should say: `https://hoodscleaning.net`
4. ✅ If not, edit it directly or use SQL above

---

**Once verified, your app is ready to use the new domain!**
