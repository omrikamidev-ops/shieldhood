# How to Get Your GitHub Token

## Important: You CANNOT use your Google password!

Even though you log into GitHub with Google, Git operations require a **Personal Access Token**.

## Steps to Create a Token:

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub.com → Your Profile (top right) → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token:**
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: `shieldhood-app` (or any name you like)
   - Expiration: Choose how long (90 days, 1 year, or no expiration)

3. **Select Scopes:**
   - ✅ Check **`repo`** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
   - That's all you need!

4. **Generate:**
   - Click "Generate token" at the bottom
   - ⚠️ **COPY THE TOKEN IMMEDIATELY** - you won't see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. **Use the Token:**
   ```bash
   ./setup-token.sh ghp_your_token_here
   ```

## That's it!

After running the setup script with your token, all pushes will work automatically.

---

**Note:** Your Google password will NEVER work for Git operations. Always use a Personal Access Token.
