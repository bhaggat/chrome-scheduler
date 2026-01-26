# Automated Chrome Extension Deployment

This guide explains how to set up and use the automated deployment process for your Chrome extension.

## 🚀 Quick Start

Once configured, deploying is as simple as:

```bash
npm run deploy
```

This single command will:

1. ✅ Build your extension
2. 📦 Package it into a zip file
3. 📤 Upload to Chrome Web Store
4. 🚀 Publish the update

## 📋 Prerequisites

Before you can use automated deployment, you need to obtain Chrome Web Store API credentials.

### Step 1: Enable Chrome Web Store API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Chrome Web Store API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Chrome Web Store API"
   - Click "Enable"

### Step 2: Create OAuth2 Credentials

1. In Google Cloud Console, go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Desktop app" as the application type
4. Name it (e.g., "Chrome Extension Deployer")
5. Click "Create"
6. **Save the Client ID and Client Secret** - you'll need these!

### Step 3: Get Refresh Token

You need to obtain a refresh token. Here's how:

1. Install the Chrome Web Store Upload CLI tool globally:

   ```bash
   npm install -g chrome-webstore-upload-cli
   ```

2. Run the following command (replace with your Client ID and Client Secret):

   ```bash
   chrome-webstore-upload authorize --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
   ```

3. This will open a browser window asking you to authorize the application
4. After authorization, you'll receive a **refresh token** - save this!

### Step 4: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your credentials:

   ```env
   EXTENSION_ID=peimippheccjbhianpahacphickkbbjl
   CHROME_CLIENT_ID=your_actual_client_id
   CHROME_CLIENT_SECRET=your_actual_client_secret
   CHROME_REFRESH_TOKEN=your_actual_refresh_token
   PUBLISH_TARGET=default
   ```

3. **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## 🎯 Usage

### Deploy to Production

```bash
npm run deploy
```

This will build, package, upload, and publish your extension to all users.

### Deploy to Trusted Testers Only

If you want to publish to trusted testers first (beta testing):

1. Edit `.env.local` and set:

   ```env
   PUBLISH_TARGET=trustedTesters
   ```

2. Run:
   ```bash
   npm run deploy
   ```

### Version Management

Before deploying, update your version number:

```bash
# For bug fixes (2.0.1 → 2.0.2)
npm run version:patch

# For new features (2.0.1 → 2.1.0)
npm run version:minor

# For breaking changes (2.0.1 → 3.0.0)
npm run version:major
```

Then deploy:

```bash
npm run deploy
```

## 📁 Files Overview

- **`scripts/deploy-chrome.js`** - Main deployment script
- **`.env.example`** - Template for environment variables
- **`.env.local`** - Your actual credentials (git-ignored)
- **`package.json`** - Contains the `deploy` script

## 🔒 Security Best Practices

1. **Never commit credentials** - Always use `.env.local` for sensitive data
2. **Rotate tokens regularly** - Refresh your OAuth tokens periodically
3. **Limit API access** - Only enable necessary APIs in Google Cloud Console
4. **Use trusted testers** - Test with `trustedTesters` before public release

## 🛠️ Troubleshooting

### "Missing credentials" Error

Make sure your `.env.local` file exists and contains all required variables:

- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`

### "Upload failed" Error

1. Check that your extension ID is correct
2. Verify your OAuth credentials are valid
3. Ensure you have permission to publish this extension
4. Check Chrome Web Store Developer Dashboard for any policy violations

### "Invalid refresh token" Error

Your refresh token may have expired. Re-run the authorization process:

```bash
chrome-webstore-upload authorize --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
```

### Build Errors

If the build fails:

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 📊 What Happens During Deployment

1. **Build Phase**: Vite compiles your React app and extension files
2. **Package Phase**: Creates a zip file from the `dist` folder
3. **Upload Phase**: Uploads the zip to Chrome Web Store using the API
4. **Publish Phase**: Submits the extension for review/publication

## 🔗 Useful Links

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Chrome Web Store API Documentation](https://developer.chrome.com/docs/webstore/using_webstore_api/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Extension URL](https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl)

## 🎉 Complete Workflow Example

Here's a complete workflow from making changes to deploying:

```bash
# 1. Make your code changes
# ... edit files ...

# 2. Test locally
npm run dev

# 3. Update version
npm run version:patch

# 4. Deploy
npm run deploy
```

That's it! Your extension will be built, packaged, uploaded, and published automatically.

---

**Note**: The first deployment after setup may take a few minutes as Chrome reviews your extension. Subsequent updates are usually faster.
