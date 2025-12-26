# GitHub Pages Deployment Guide

This guide will walk you through deploying your typing-game React application to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Node.js and npm installed
- Your project already pushed to GitHub at: `https://github.com/nstoichev/typing-game`

## What Has Been Updated

The following changes have been made to prepare your project for GitHub Pages:

1. **vite.config.js**: Added base path `/typing-game/` for GitHub Pages
2. **src/App.jsx**: Changed from `BrowserRouter` to `HashRouter` for GitHub Pages compatibility
3. **package.json**: Added `gh-pages` package and deploy script
4. **.github/workflows/deploy.yml**: Created GitHub Actions workflow for automatic deployment
5. **public/404.html**: Added fallback page for client-side routing

## Deployment Methods

You have two options for deployment:

### Option 1: Automatic Deployment with GitHub Actions (Recommended)

This method automatically deploys your site whenever you push to the `main` branch.

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/nstoichev/typing-game`
2. Click on **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
5. Click **Save**

#### Step 2: Push Your Changes

1. Open your terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd D:\Server\Projects\typing-game-git\typing-game
   ```

3. Stage all the changes:
   ```bash
   git add .
   ```

4. Commit the changes:
   ```bash
   git commit -m "Configure project for GitHub Pages deployment"
   ```

5. Push to GitHub:
   ```bash
   git push origin main
   ```

#### Step 3: Monitor Deployment

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see a workflow run called "Deploy to GitHub Pages"
4. Wait for it to complete (usually takes 1-2 minutes)
5. Once complete, go back to **Settings** → **Pages**
6. Your site will be available at: `https://nstoichev.github.io/typing-game/`

#### Step 4: Verify Deployment

1. Visit your site: `https://nstoichev.github.io/typing-game/`
2. Test all routes to ensure they work correctly
3. The URL will use hash-based routing (e.g., `#/speed-test`, `#/auth`)

### Option 2: Manual Deployment with gh-pages

This method allows you to manually deploy whenever you want.

#### Step 1: Install Dependencies

1. Open your terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd D:\Server\Projects\typing-game-git\typing-game
   ```

3. Install the gh-pages package:
   ```bash
   npm install
   ```

#### Step 2: Build and Deploy

1. Run the deploy script:
   ```bash
   npm run deploy
   ```

   This command will:
   - Build your production-ready app
   - Deploy it to the `gh-pages` branch
   - Make it available on GitHub Pages

#### Step 3: Configure GitHub Pages

1. Go to your repository on GitHub: `https://github.com/nstoichev/typing-game`
2. Click on **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch and **/ (root)** folder
6. Click **Save**

#### Step 4: Access Your Site

1. Wait a few minutes for GitHub to process the deployment
2. Your site will be available at: `https://nstoichev.github.io/typing-game/`

## Important Notes

### Base Path

- The base path is set to `/typing-game/` in `vite.config.js`
- If you change your repository name, update the `base` value in `vite.config.js`
- If you use a custom domain, you can change the base to `/` in `vite.config.js`

### Routing

- The app now uses `HashRouter` instead of `BrowserRouter`
- URLs will look like: `https://nstoichev.github.io/typing-game/#/speed-test`
- This is necessary because GitHub Pages doesn't support server-side routing

### Firebase Configuration

- Make sure your Firebase configuration allows your GitHub Pages domain
- Add `https://nstoichev.github.io` to your Firebase authorized domains if needed
- Check your Firebase Console → Authentication → Settings → Authorized domains

### Future Updates

**With GitHub Actions (Option 1):**
- Simply push changes to the `main` branch
- The workflow will automatically rebuild and redeploy

**With Manual Deployment (Option 2):**
- After making changes, run `npm run deploy` again
- This will rebuild and redeploy your site

## Troubleshooting

### Site Not Loading

1. Check the GitHub Actions workflow for errors (if using Option 1)
2. Verify the base path in `vite.config.js` matches your repository name
3. Ensure GitHub Pages is enabled in repository settings
4. Wait a few minutes - GitHub Pages can take time to update

### Routes Not Working

1. Verify you're using hash-based URLs (with `#`)
2. Check that `HashRouter` is being used in `src/App.jsx`
3. Clear your browser cache and try again

### Build Errors

1. Run `npm run build` locally to check for build errors
2. Check that all dependencies are installed: `npm install`
3. Review the error messages in GitHub Actions (if using Option 1)

### Assets Not Loading

1. Verify the base path in `vite.config.js` is correct
2. Check that all asset paths are relative (not absolute)
3. Ensure the `public` folder contents are being copied correctly

## Testing Locally

Before deploying, test your production build locally:

1. Build the project:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

3. Open the preview URL (usually `http://localhost:4173`)
4. Test all routes and functionality

## Custom Domain (Optional)

If you want to use a custom domain:

1. Update `vite.config.js` and change `base: '/typing-game/'` to `base: '/'`
2. Add a `CNAME` file in the `public` folder with your domain name
3. Configure DNS settings for your domain
4. Update Firebase authorized domains if needed

## Summary

Your project is now configured for GitHub Pages deployment. Choose one of the deployment methods above and follow the steps. The recommended approach is **Option 1 (GitHub Actions)** as it provides automatic deployment whenever you push changes.

Your live site will be available at: **https://nstoichev.github.io/typing-game/**

