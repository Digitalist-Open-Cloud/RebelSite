# GitHub Pages Deployment Guide

This guide will help you deploy RebelMetrics.io to GitHub Pages.

## Prerequisites

- A GitHub account
- The repository cloned to your local machine
- Git configured on your machine

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Digitalist-Open-Cloud/RebelSite`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select **main** and **/(root)**
6. Click **Save**

## Step 2: Configure Custom Domain (Optional)

If you want to use a custom domain like `rebelmetrics.io`:

1. In the Pages settings, enter your domain in the **Custom domain** field
2. Click **Save**
3. The `CNAME` file will be automatically created
4. Configure your DNS provider to point to GitHub Pages:
   - Add a CNAME record: `rebelmetrics.io` → `yourusername.github.io`
   - Or add A records pointing to GitHub Pages IPs

## Step 3: Deploy

The deployment is automatic! Every time you push to the `main` branch, GitHub Actions will:

1. Build the site
2. Deploy it to GitHub Pages
3. Make it available at your configured URL

## Step 4: Verify Deployment

1. Wait a few minutes for the deployment to complete
2. Check the **Actions** tab to see deployment status
3. Visit your site URL to verify it's working

## URL Structure

Your site will be available at:

- **GitHub Pages URL**: `https://yourusername.github.io/RebelSite`
- **Custom Domain** (if configured): `https://rebelmetrics.io`

### Language Paths

- English: `/` or `/en/`
- Swedish: `/sv/`
- German: `/de/`

## Troubleshooting

### Common Issues

1. **404 errors on language paths**
   - The `404.html` file handles routing for language paths
   - Make sure it's in the root directory

2. **Images not loading**
   - Check that all image paths are relative to the root
   - Verify images exist in the `images/` directory

3. **CSS/JS not loading**
   - Ensure all file paths are correct
   - Check browser console for errors

4. **Deployment not working**
   - Check the **Actions** tab for error messages
   - Verify the workflow file exists: `.github/workflows/static.yml`

### Manual Deployment

If automatic deployment isn't working:

1. Go to **Actions** tab
2. Click **Deploy static content to Pages**
3. Click **Run workflow**
4. Select **main** branch
5. Click **Run workflow**

## Local Testing

Before deploying, test locally:

```bash
./start-server.sh
```

Visit `http://localhost:8000` to test all features.

## Files for GitHub Pages

The following files are essential for GitHub Pages:

- `index.html` - Root redirect
- `404.html` - SPA routing
- `CNAME` - Custom domain (if used)
- `.github/workflows/static.yml` - Deployment workflow
- All language HTML files in their respective directories

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify all files are committed and pushed
3. Check the browser console for JavaScript errors
4. Contact support if needed 