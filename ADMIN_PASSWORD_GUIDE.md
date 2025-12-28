# ADMIN_PASSWORD - What You Need to Know

## What is ADMIN_PASSWORD?

It's **YOUR password** that you create to protect the admin area of your site.

- **You choose it** - there's no default password
- **You create it** - just pick a strong password
- **You set it** - add it as an environment variable in Vercel

## How to Create a Good Password

Choose something:
- ✅ At least 12 characters long
- ✅ Mix of letters, numbers, and symbols
- ✅ Easy for YOU to remember
- ✅ Hard for others to guess

**Examples:**
- `ShieldHood2024!Admin`
- `MySecurePass123!`
- `HoodCleaning#2024`

## Where to Set It

### In Vercel:
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** Your chosen password (e.g., `ShieldHood2024!Admin`)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Click **Save**

### Locally (for testing):
Create a `.env.local` file:
```
ADMIN_PASSWORD=ShieldHood2024!Admin
```

## How to Use It

1. Deploy your site
2. Visit: `https://yoursite.com/admin`
3. Your browser will ask for login:
   - **Username:** Anything (not checked, can be blank)
   - **Password:** The password you set for `ADMIN_PASSWORD`
4. Enter your password
5. You're in! 🎉

## Important Notes

- ⚠️ **Don't share this password** - it protects your admin area
- ⚠️ **Use a strong password** - especially in production
- ⚠️ **Remember it** - or write it down securely
- ✅ **You can change it anytime** - just update the environment variable and redeploy

## What Happens If You Forget?

1. Go to Vercel → Environment Variables
2. Update `ADMIN_PASSWORD` with a new password
3. Redeploy your site
4. Use the new password

## Security Tip

For production, use a password manager to generate and store a strong password:
- 1Password
- LastPass
- Bitwarden
- Or just write it down securely

---

**TL;DR:** Just create a password you'll remember, like `ShieldHood2024!Admin`, and add it to Vercel as `ADMIN_PASSWORD`. That's it! 🎯
