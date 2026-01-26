# Quick Deploy Guide

## First Time Setup (5 minutes)

1. **Get Chrome Web Store API credentials** (see DEPLOYMENT.md for detailed steps)
2. **Create `.env.local` file**:
   ```bash
   cp .env.example .env.local
   ```
3. **Fill in your credentials** in `.env.local`

## Daily Usage

### Deploy to Production

```bash
npm run deploy
```

### Update Version & Deploy

```bash
# Patch version (bug fixes)
npm run version:patch && npm run deploy

# Minor version (new features)
npm run version:minor && npm run deploy

# Major version (breaking changes)
npm run version:major && npm run deploy
```

## What Gets Automated

✅ Build the extension  
✅ Package into zip file  
✅ Upload to Chrome Web Store  
✅ Publish the update

## Need Help?

- **Full setup guide**: See `DEPLOYMENT.md`
- **Manual publishing**: See `PUBLISHING.md`
- **Static hosting**: See `STATIC_HOSTING_IMPROVEMENTS.md`

## Troubleshooting

**"Missing credentials" error?**  
→ Make sure `.env.local` exists with all required variables

**"Upload failed" error?**  
→ Check Chrome Web Store Developer Dashboard for policy issues

**Build errors?**  
→ Run `npm install` and try again
