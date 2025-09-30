# Chrome Extension Publishing Guide

This guide will help you publish updates to your "Scheduled Website Opener" Chrome extension.

## 🚀 Quick Start

### Option 1: Using npm scripts (Recommended)

```bash
# Build and package the extension
npm run package
```

### Option 2: Using shell script

```bash
# Make script executable and run
chmod +x scripts/publish.sh
./scripts/publish.sh
```

### Option 3: Manual process

```bash
# Build the project
npm run build

# Create zip manually
cd dist
zip -r ../scheduled-website-opener-v2.0.0.zip .
```

## 📋 Publishing Steps

### 1. Prepare Your Extension

- Ensure all changes are committed to git
- Update version number in `package.json` and `public/manifest.json`
- Test the extension thoroughly
- Run `npm run lint` to check for code issues

### 2. Build and Package

```bash
npm run package
```

This will:

- Build the project using Vite
- Create a zip file ready for Chrome Web Store
- Display next steps and release notes template

### 3. Upload to Chrome Web Store

1. **Go to Chrome Web Store Developer Dashboard**

   - Visit: https://chrome.google.com/webstore/devconsole/
   - Sign in with your Google account

2. **Find Your Extension**

   - Look for "Scheduled Website Opener"
   - Click on the extension name

3. **Upload New Package**

   - Click "Upload new package"
   - Select the generated zip file (e.g., `scheduled-website-opener-v2.0.0.zip`)

4. **Update Details**

   - Update version number if needed
   - Add release notes describing changes
   - Review all settings

5. **Submit for Review**
   - Click "Submit for review"
   - Wait for Google's approval (usually 1-3 days)

## 📝 Release Notes Template

Use this template for your release notes:

```
Version 2.0.0 Updates:
- Reduced UI spacing and made interface more compact
- Improved modal responsiveness and mobile experience
- Enhanced visual consistency and modern design
- Optimized performance and reduced bundle size
- Fixed styling issues and improved user experience
```

## 🔗 Important Links

- **Chrome Web Store Listing**: https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl
- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole/
- **Chrome Extension Documentation**: https://developer.chrome.com/docs/extensions/

## 🛠️ Troubleshooting

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Zip Creation Issues

```bash
# Install zip if not available
# Ubuntu/Debian:
sudo apt-get install zip

# macOS:
brew install zip
```

### Permission Issues

```bash
# Make scripts executable
chmod +x scripts/publish.sh
```

## 📊 Version Management

### Updating Version Numbers

1. Update `package.json` version
2. Update `public/manifest.json` version
3. Commit changes
4. Run publishing script

### Semantic Versioning

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features
- **Patch** (1.0.0 → 1.0.1): Bug fixes

## 🎯 Best Practices

1. **Test Thoroughly**

   - Test in different browsers
   - Test with different screen sizes
   - Verify all functionality works

2. **Document Changes**

   - Write clear release notes
   - Document any breaking changes
   - Include screenshots if UI changes significantly

3. **Incremental Updates**

   - Don't make too many changes at once
   - Test each feature individually
   - Use feature flags if needed

4. **Security**
   - Review permissions in manifest.json
   - Ensure no sensitive data in code
   - Follow Chrome Web Store policies

## 🚨 Common Issues

### Extension Not Loading

- Check manifest.json syntax
- Verify all files are included in zip
- Check browser console for errors

### Review Rejection

- Read Google's feedback carefully
- Address all policy violations
- Resubmit with fixes

### Performance Issues

- Optimize images and assets
- Minimize bundle size
- Use efficient algorithms

## 📞 Support

If you encounter issues:

1. Check Chrome Web Store policies
2. Review extension documentation
3. Test in incognito mode
4. Check browser console for errors

---

**Happy Publishing! 🎉**
