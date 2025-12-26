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
   - You'll see a yellow dot while it's running
   - A green checkmark means it succeeded
   - A red X means it failed (click to see errors)
5. Once complete with a green checkmark, wait an additional 1-2 minutes for GitHub Pages to update
6. Your site will be available at: `https://nstoichev.github.io/typing-game/`

**Important:** If you see 404 errors:
- Make sure GitHub Pages is set to use **GitHub Actions** (not a branch)
- Check the Actions tab to ensure the workflow completed successfully
- Wait a few minutes - GitHub Pages can take time to propagate

#### Step 4: Verify Deployment

1. Visit your site: `https://nstoichev.github.io/typing-game/`
2. Test all routes to ensure they work correctly
3. The URL will use hash-based routing (e.g., `#/speed-test`, `#/auth`)

### Option 2: Manual Deployment with gh-pages

This method allows you to manually deploy whenever you want.

#### Step 1: Install Dependencies

**⚠️ IMPORTANT: You must install dependencies first before running the deploy command!**

1. Open your terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd D:\Server\Projects\typing-game-git\typing-game
   ```

3. Install all dependencies (including the new `gh-pages` package):
   ```bash
   npm install
   ```
   
   This will install all packages including `gh-pages` which is needed for deployment.

4. Verify installation (optional):
   ```bash
   npm list gh-pages
   ```
   
   You should see `gh-pages@6.1.1` (or similar version) listed.

#### Step 2: Build and Deploy

1. Run the deploy script:
   ```bash
   npm run deploy
   ```
   
   **Note:** If you get an error saying `'gh-pages' is not recognized`, make sure you've completed Step 1 above.

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

### Build Errors / Deployment Failed

**Error:** "Разгръщане в GitHub Pages / build - Неуспешно" (Deployment failed)

**How to see the actual error:**
1. Go to your repository: `https://github.com/nstoichev/typing-game`
2. Click on the **Actions** tab
3. Click on the failed workflow run (it will have a red X)
4. Click on the **build** job (left sidebar)
5. Expand each step to see the error messages
6. Look for red error messages - they will tell you what went wrong

**Common causes and solutions:**

1. **Build script fails:**
   - Test locally first: `npm run build`
   - Fix any errors that appear
   - Common issues: syntax errors, missing imports, type errors

2. **Missing dependencies:**
   - Make sure `package.json` and `package-lock.json` are committed
   - The workflow uses `npm ci` which requires `package-lock.json`
   - If you don't have `package-lock.json`, run `npm install` locally and commit it

3. **ESLint errors (if linting is part of build):**
   - Check if your build script includes linting
   - Fix linting errors or temporarily disable strict linting

4. **Node version mismatch:**
   - The workflow uses Node.js 20
   - Make sure your code works with Node.js 20
   - You can test locally with the same Node version

5. **Missing files:**
   - Make sure all source files are committed to git
   - Check that `vite.config.js` exists and is correct
   - Verify `index.html` is in the root directory

**Quick fix steps:**
```bash
# 1. Test build locally
npm run build

# 2. If build succeeds locally but fails on GitHub:
#    - Make sure package-lock.json is committed
#    - Check the Actions tab for specific error messages
#    - Compare your local environment with GitHub Actions
```

### 'gh-pages' is not recognized

**Error:** `'gh-pages' is not recognized as an internal or external command`

**Solution:**
1. Make sure you've installed dependencies first:
   ```bash
   npm install
   ```
2. Wait for the installation to complete
3. Then run the deploy command again:
   ```bash
   npm run deploy
   ```

**Why this happens:** The `gh-pages` package needs to be installed in `node_modules` before you can use it. Running `npm install` will install all packages listed in `package.json`, including `gh-pages`.

### Assets Not Loading / 404 Errors on GitHub Pages

**Symptoms:** Site works with `npm run preview` but shows 404 errors on GitHub Pages

**Possible Causes & Solutions:**

1. **GitHub Pages not enabled or configured incorrectly:**
   - Go to your repository: `https://github.com/nstoichev/typing-game`
   - Click **Settings** → **Pages**
   - Under **Source**, make sure **GitHub Actions** is selected (NOT "Deploy from a branch")
   - If it's not set to GitHub Actions, change it and save

2. **Deployment hasn't completed:**
   - Go to **Actions** tab in your repository
   - Check if there's a workflow run for "Deploy to GitHub Pages"
   - If there's no workflow run, you need to push your changes first
   - If there's a failed workflow, check the error messages

3. **Workflow hasn't run yet:**
   - Make sure you've pushed the `.github/workflows/deploy.yml` file
   - Push your changes:
     ```bash
     git add .
     git commit -m "Add GitHub Pages deployment"
     git push origin main
     ```
   - Wait for the workflow to complete (check the Actions tab)

4. **Base path mismatch:**
   - Verify `vite.config.js` has `base: '/typing-game/'`
   - Make sure your repository name matches exactly: `typing-game`
   - If your repo name is different, update the base path accordingly

5. **Cache issues:**
   - Clear your browser cache
   - Try opening in an incognito/private window
   - GitHub Pages can take a few minutes to update after deployment

6. **Verify deployment:**
   - After the workflow completes, wait 1-2 minutes
   - Check the Actions tab - the workflow should show "Deploy to GitHub Pages" step as completed
   - Visit: `https://nstoichev.github.io/typing-game/` (note the trailing slash)

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

