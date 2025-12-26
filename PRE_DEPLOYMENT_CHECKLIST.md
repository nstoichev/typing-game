# Pre-Deployment Checklist

Before deploying to GitHub Pages, verify and update the following:

## ✅ Configuration Items to Verify

### 1. Repository Name ✅
- **File**: `vite.config.js`
- **Status**: Already set to `'typing-game'` (correct for your repo)
- **Action**: No changes needed

### 2. Firebase Configuration ⚠️ **ACTION REQUIRED**
- **File**: `src/firebase/config.js`
- **Current Status**: Has actual Firebase credentials
- **Action Required**:
  1. Verify these are the correct Firebase project credentials
  2. **IMPORTANT**: Add GitHub Pages domain to Firebase authorized domains:
     - Go to [Firebase Console](https://console.firebase.google.com/)
     - Select your project: `qwerty-master-f83f1`
     - Navigate to: **Authentication** → **Settings** → **Authorized domains**
     - Click **Add domain**
     - Add: `nstoichev.github.io`
     - Click **Add**

### 3. GitHub Actions Workflow Branch ⚠️ **VERIFY**
- **File**: `.github/workflows/deploy.yml`
- **Current Setting**: Triggers on `main` branch
- **Action Required**: 
  - Check your default branch name on GitHub
  - If your default branch is `master` instead of `main`, update line 6:
    ```yaml
    branches:
      - master  # Change from 'main' to 'master' if needed
    ```

### 4. No Environment Variables Needed ✅
- **Status**: No `.env` files found - all configuration is in code
- **Action**: No changes needed

### 5. No Placeholder Values Found ✅
- **Status**: All configuration values appear to be actual values
- **Action**: No changes needed

## Summary

**Required Actions Before Deployment:**

1. ✅ Repository name - Already correct
2. ⚠️ **Add `nstoichev.github.io` to Firebase authorized domains** (CRITICAL)
3. ⚠️ Verify GitHub Actions branch name matches your default branch

## Quick Verification Steps

1. **Check your default branch**:
   - Go to your GitHub repo: `github.com/nstoichev/typing-game`
   - Check the branch dropdown (usually shows `main` or `master`)

2. **Test Firebase connection**:
   - After adding the GitHub Pages domain, test authentication works
   - The Firebase config in your code should work as-is

3. **Test production build locally**:
   ```bash
   npm run build
   npm run preview
   ```
   - Verify everything works before deploying

## Notes

- Firebase API keys in the code are **public** by design (they're meant to be exposed in client-side code)
- Firebase security is handled through Firestore Security Rules (not by hiding API keys)
- The credentials in `src/firebase/config.js` are safe to commit to GitHub

