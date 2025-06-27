#!/bin/bash

echo "🚀 Deploying RebelMetrics to GitHub Pages..."

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
git commit -m "Fix GitHub Pages deployment issues

- Added 404.html for SPA routing
- Updated index.html for GitHub Pages compatibility
- Fixed language switching in main.js
- Added CNAME for custom domain
- Created deployment documentation"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://digitalist-open-cloud.github.io/RebelSite/"
echo ""
echo "📋 Next steps:"
echo "   1. Go to: https://github.com/Digitalist-Open-Cloud/RebelSite/settings/pages"
echo "   2. Enable GitHub Pages if not already enabled"
echo "   3. Check the Actions tab for deployment status"
echo "   4. Wait 2-5 minutes for the site to be live"
echo ""
echo "🔗 Language URLs:"
echo "   English: https://digitalist-open-cloud.github.io/RebelSite/"
echo "   Swedish: https://digitalist-open-cloud.github.io/RebelSite/sv/"
echo "   German:  https://digitalist-open-cloud.github.io/RebelSite/de/" 