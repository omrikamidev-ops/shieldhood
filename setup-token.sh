#!/bin/bash
# GitHub Token Setup Script
# Usage: ./setup-token.sh YOUR_ACTUAL_TOKEN_HERE

if [ -z "$1" ]; then
  echo "❌ Error: Please provide your GitHub token"
  echo ""
  echo "Usage: ./setup-token.sh YOUR_GITHUB_TOKEN"
  echo ""
  echo "Example: ./setup-token.sh ghp_xxxxxxxxxxxxxxxxxxxx"
  exit 1
fi

TOKEN="$1"

# Validate token format (starts with ghp_ or github_pat_)
if [[ ! "$TOKEN" =~ ^(ghp_|github_pat_) ]]; then
  echo "⚠️  Warning: Token doesn't look like a GitHub token (should start with ghp_ or github_pat_)"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "🔐 Configuring GitHub credentials..."

# Store credentials
echo "https://omrikamidev-ops:${TOKEN}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# Configure git
git config --global credential.helper store

echo "✅ Credentials configured!"
echo ""
echo "🚀 Testing push..."

if git push origin main 2>&1; then
  echo ""
  echo "✅ Success! Your commits have been pushed."
  echo "✅ Auto-push is now enabled for all future commits."
else
  echo ""
  echo "❌ Push failed. Please check:"
  echo "   1. Token has 'repo' permissions"
  echo "   2. Token is not expired"
  echo "   3. Repository exists and you have access"
fi
