#!/bin/bash

# Git Authentication Setup Script
# This script helps you configure Git authentication for GitHub

echo "🔐 GitHub Authentication Setup"
echo "================================"
echo ""

# Check if git is configured
echo "📋 Current Git Configuration:"
echo "Username: $(git config --global user.name)"
echo "Email: $(git config --global user.email)"
echo ""

echo "📝 To fix GitHub authentication, you have two options:"
echo ""
echo "Option 1: Personal Access Token (Recommended)"
echo "---------------------------------------------"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select 'repo' scope"
echo "4. Copy the token"
echo "5. When Git asks for password, use the token instead"
echo ""

echo "Option 2: SSH Keys (Advanced)"
echo "-----------------------------"
echo "1. Generate SSH key: ssh-keygen -t ed25519 -C 'your.email@example.com'"
echo "2. Add to GitHub: https://github.com/settings/keys"
echo "3. Change remote URL to SSH: git remote set-url origin git@github.com:username/repo.git"
echo ""

echo "🔧 Quick Fix - Update your credentials:"
echo "Run: git config --global credential.helper store"
echo "Then try: git push (enter username and token when prompted)"
echo ""

# Update credential helper
git config --global credential.helper store

echo "✅ Credential helper updated!"
echo "💡 Next time you push, use your GitHub username and Personal Access Token as password"
