# How to Get Runtime Logs for Middleware Error

## The Error
You're getting: `500: INTERNAL_SERVER_ERROR` with code `MIDDLEWARE_INVOCATION_FAILED` when accessing `/admin`.

## What Logs I Need

### Step 1: Access the Admin Page
1. Visit: `https://hoodscleaning.net/admin`
2. This will trigger the error

### Step 2: Get Runtime Logs (NOT Build Logs)
1. Go to: https://vercel.com/dashboard
2. Click on your **shieldhood** project
3. Click **Deployments** (top menu)
4. Click on your **latest deployment** (the one that just finished)
5. Click the **"Functions"** tab (or look for "Runtime Logs" or "Function Logs")
6. Look for logs with timestamp matching when you accessed `/admin`
7. Look for any error messages, especially ones mentioning:
   - `__dirname`
   - `ReferenceError`
   - `MIDDLEWARE_INVOCATION_FAILED`
   - Any stack traces

### Step 3: Alternative - Real-time Logs
1. In Vercel dashboard, go to your project
2. Click **Logs** tab (if available)
3. Filter by:
   - Route: `/admin`
   - Status: `500` or `Error`
4. Copy the error message and stack trace

### Step 4: What to Look For
The logs should show something like:
```
[Error] ReferenceError: __dirname is not defined
    at ... (some file path)
    at ... (middleware code)
```

Or it might show:
```
[Error] MIDDLEWARE_INVOCATION_FAILED
[Details] ... (error message)
```

## What I'll Do With the Logs
Once I see the exact error message and stack trace, I can:
1. Identify what's causing `__dirname` to be referenced
2. Fix the middleware code
3. Or identify if it's a Next.js/Vercel bundling issue

---

**Important:** The build logs won't help - I need the **runtime logs** from when you actually visit `/admin`.
