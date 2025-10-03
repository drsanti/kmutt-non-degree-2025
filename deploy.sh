#!/bin/bash

# Auto Deploy Script for ND2025 Course Materials
# Usage: ./deploy.sh [commit_message]

# Set default commit message if none provided
COMMIT_MSG=${1:-"add slides"}

echo "🚀 Starting deployment process..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "📁 Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit."
    exit 0
fi

# Commit changes
echo "💾 Committing changes with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo "✅ Commit successful!"
else
    echo "❌ Commit failed!"
    exit 1
fi

# Push to remote
echo "🌐 Pushing to remote repository..."
git push

# Check if push was successful
if [ $? -eq 0 ]; then
    echo "🎉 Deployment completed successfully!"
    echo "📊 Repository status:"
    git status
else
    echo "❌ Push failed!"
    exit 1
fi
