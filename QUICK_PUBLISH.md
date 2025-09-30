# 🚀 Quick Publish Guide

## One-Command Publishing

```bash
npm run package
```

## Version Management

```bash
# Bump patch version (1.0.0 → 1.0.1)
npm run version:patch

# Bump minor version (1.0.0 → 1.1.0)
npm run version:minor

# Bump major version (1.0.0 → 2.0.0)
npm run version:major
```

## Complete Workflow

```bash
# 1. Make your changes
# 2. Bump version
npm run version:patch

# 3. Test your changes
npm run dev

# 4. Build and package
npm run package

# 5. Upload to Chrome Web Store
# Go to: https://chrome.google.com/webstore/devconsole/
```

## 📁 Generated Files

- `scheduled-website-opener-v2.0.0.zip` - Ready for Chrome Web Store
- `dist/` - Built extension files

## 🔗 Important Links

- **Chrome Web Store**: https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl
- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole/

## 📝 Release Notes Template

```
Version 2.0.0 Updates:
- Reduced UI spacing and made interface more compact
- Improved modal responsiveness and mobile experience
- Enhanced visual consistency and modern design
- Optimized performance and reduced bundle size
- Fixed styling issues and improved user experience
```
