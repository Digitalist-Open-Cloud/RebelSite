#!/bin/bash

echo "🚀 Deploying RebelMetrics to GitHub Pages..."
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Add all changes
echo "📝 Adding changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Fix GitHub Pages menu links and improve redirect logic

- Updated loadHeader() to use correct GitHub Pages base path
- Fixed menu links to work with /RebelSite/ repository path
- Enhanced redirect logic with better error handling
- Improved 404 page with GitHub Pages path detection
- Added fallback links for better user experience"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push origin main

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Your site is available at:"
echo "   https://digitalist-open-cloud.github.io/RebelSite/"
echo ""
echo "📋 Language URLs:"
echo "   English:  https://digitalist-open-cloud.github.io/RebelSite/en/"
echo "   Swedish:  https://digitalist-open-cloud.github.io/RebelSite/sv/"
echo "   German:   https://digitalist-open-cloud.github.io/RebelSite/de/"
echo ""
echo "🔧 Features:"
echo "   - Smart redirects based on browser language"
echo "   - Correct menu links for GitHub Pages"
echo "   - Beautiful loading page with fallback options"
echo "   - Enhanced 404 page with language selection"
echo ""
echo "⏱️  Changes will be live in 1-2 minutes" 