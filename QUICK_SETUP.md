# Quick GitHub Token Setup

## Problem
The credential file has a placeholder token. You need to replace it with your real GitHub token.

## Solution

Run this command in your terminal (replace `YOUR_TOKEN` with your actual GitHub Personal Access Token):

```bash
./setup-token.sh YOUR_TOKEN
```

## How to get your GitHub token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "shieldhood-app"
4. Select scope: **repo** (full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)
7. Run: `./setup-token.sh ghp_your_token_here`

## After setup:

✅ All commits will auto-push to GitHub  
✅ No more manual pushes needed  
✅ Works automatically forever

## Current status:

You have **3 commits** waiting to be pushed:
- refactor: remove eviction-related terms
- feat: enhance content quality and SEO compliance  
- chore: add git automation scripts

Once you run the setup script with a valid token, these will push automatically!
