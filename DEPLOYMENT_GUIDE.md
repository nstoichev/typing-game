# GitHub Pages Deployment Guide

This guide will walk you through deploying your React typing game to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your machine
- Node.js and npm/yarn installed
- Your project pushed to a GitHub repository

## Changes Made for Production Deployment

The following changes have been made to prepare your project for GitHub Pages deployment:

1. **Vite Configuration** (`vite.config.js`):
   - Added base path configuration for GitHub Pages (`/typing-game/`)
   - Optimized production build settings
   - Added code splitting for better performance

2. **Router Configuration** (`src/App.jsx`):
   - Changed from `BrowserRouter` to `HashRouter` for GitHub Pages compatibility
   - GitHub Pages doesn't support client-side routing with BrowserRouter, so HashRouter is required

3. **Build Scripts** (`package.json`):
   - Added `build:prod` script for production builds
   - Added `preview:prod` script to test production builds locally

## Step 1: Update Repository Name in Config (If Needed)

If your GitHub repository has a different name than `typing-game`, update the `REPO_NAME` constant in `vite.config.js`:

```javascript
const REPO_NAME = 'your-repo-name' // Change this to match your repository name
```

**Important**: If your repository is at `github.com/username/typing-game`, the base path should be `/typing-game/`. If you're using a custom domain or deploying to the root, change it to `/`.

## Step 2: Test Production Build Locally

Before deploying, test your production build locally to ensure everything works:

### 2.1 Build the Production Version

```bash
npm run build
```

or

```bash
npm run build:prod
```

This will create an optimized production build in the `dist` folder.

### 2.2 Preview the Production Build

Test the production build locally:

```bash
npm run preview
```

or

```bash
npm run preview:prod
```

Open the URL shown in the terminal (usually `http://localhost:4173`) and verify:
- ✅ The app loads correctly
- ✅ All routes work (use the hash-based URLs like `/#/speed-test`)
- ✅ Firebase authentication works
- ✅ All features function as expected
- ✅ No console errors

**Note**: The preview will show URLs with hash routing (e.g., `/#/` instead of `/`), which is expected for GitHub Pages.

## Step 3: Choose Deployment Method

You have two options for deploying to GitHub Pages:

### Option A: GitHub Actions (Recommended - Automated)

This method automatically builds and deploys your site whenever you push to the main branch.

### Option B: Manual Deployment

This method requires you to manually build and push the `dist` folder to a `gh-pages` branch.

---

## Option A: Deploy Using GitHub Actions (Recommended)

### Step 3A.1: Create GitHub Actions Workflow

1. Create a `.github` folder in your project root (if it doesn't exist)
2. Create a `workflows` folder inside `.github`
3. Create a file named `deploy.yml` in `.github/workflows/`

### Step 3A.2: Add Deployment Workflow

Copy the following content into `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # Change to 'master' if your default branch is 'master'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 3A.3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 3A.4: Push and Deploy

1. Commit and push your changes:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

2. Go to your repository on GitHub
3. Click on the **Actions** tab
4. You should see the workflow running
5. Wait for it to complete (usually 2-3 minutes)
6. Once complete, your site will be available at:
   ```
   https://your-username.github.io/typing-game/
   ```

**Note**: Replace `your-username` with your GitHub username and `typing-game` with your repository name.

---

## Option B: Manual Deployment

### Step 3B.1: Install gh-pages Package (Optional but Recommended)

```bash
npm install --save-dev gh-pages
```

Add a deploy script to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### Step 3B.2: Build and Deploy

If you installed `gh-pages`:

```bash
npm run deploy
```

If you prefer manual deployment:

1. Build the project:
   ```bash
   npm run build
   ```

2. Create or checkout the `gh-pages` branch:
   ```bash
   git checkout --orphan gh-pages
   ```

3. Remove all files except `dist`:
   ```bash
   git rm -rf .
   ```

4. Copy dist contents to root:
   ```bash
   cp -r dist/* .
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

### Step 3B.3: Configure GitHub Pages Source

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select the `gh-pages` branch and `/ (root)` folder
5. Click **Save**

Your site will be available at:
```
https://your-username.github.io/typing-game/
```

---

## Step 4: Verify Deployment

After deployment, verify the following:

1. ✅ Site loads at the GitHub Pages URL
2. ✅ All routes work (test navigation)
3. ✅ Firebase authentication works
4. ✅ All features function correctly
5. ✅ No console errors
6. ✅ Assets (CSS, JS, images) load correctly

## Step 5: Update Firebase Configuration (If Needed)

If you encounter CORS or authentication issues, you may need to:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Add `your-username.github.io` to the authorized domains list

## Troubleshooting

### Issue: 404 Errors on Routes

**Solution**: Make sure you're using `HashRouter` (already configured). Routes should work with hash URLs like `/#/speed-test`.

### Issue: Assets Not Loading (404 on CSS/JS files)

**Solution**: 
- Verify the `base` path in `vite.config.js` matches your repository name
- Ensure the base path starts and ends with `/` (e.g., `/typing-game/`)

### Issue: Firebase Errors

**Solution**:
- Add your GitHub Pages domain to Firebase authorized domains
- Check that Firebase config in `src/firebase/config.js` is correct

### Issue: Build Fails

**Solution**:
- Check for TypeScript/ESLint errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`
- Check the build output for specific error messages

### Issue: Site Shows Blank Page

**Solution**:
- Open browser DevTools and check the Console for errors
- Verify the base path in `vite.config.js` is correct
- Check that all imports are using relative paths

## Updating Your Deployment

### For GitHub Actions (Option A):

Simply push changes to your main branch:

```bash
git add .
git commit -m "Update features"
git push origin main
```

The GitHub Action will automatically rebuild and redeploy.

### For Manual Deployment (Option B):

Run the deploy command again:

```bash
npm run deploy
```

Or manually rebuild and push:

```bash
npm run build
# Follow steps 3B.2 again
```

## Custom Domain (Optional)

If you want to use a custom domain:

1. Update the `base` in `vite.config.js` to `/`
2. Add a `CNAME` file in the `public` folder with your domain name
3. Configure DNS settings as per GitHub Pages documentation
4. Update Firebase authorized domains

## Summary

Your project is now configured for GitHub Pages deployment with:

- ✅ Production-optimized build configuration
- ✅ HashRouter for GitHub Pages compatibility
- ✅ Proper base path configuration
- ✅ Automated deployment workflow (if using Option A)

The site will be available at: `https://your-username.github.io/typing-game/`

Remember to:
- Update the `REPO_NAME` in `vite.config.js` if your repository has a different name
- Test the production build locally before deploying
- Add your GitHub Pages domain to Firebase authorized domains if needed

