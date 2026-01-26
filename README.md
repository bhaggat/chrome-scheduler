# Chrome Scheduler Extension

A modern Chrome extension that automatically opens specific websites at scheduled times. Features daily, weekly, monthly, and yearly scheduling options with beautiful, modern UI.

## 📦 Install from Chrome Web Store

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl?authuser=0&hl=en-GB)

**Download the extension:** [Scheduled Website Opener](https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl?authuser=0&hl=en-GB)

## Features

- 🎨 **Modern UI**: Beautiful gradient design with glassmorphism effects
- ⏰ **Flexible Scheduling**: Daily, weekly, monthly, and yearly options
- 🔄 **Smart Triggers**: "Every time on Chrome open" or "Once per day" options
- 📌 **Pin Support**: Option to pin scheduled tabs
- ⚡ **Real-time**: Built with React 19 and Vite 6
- 🎯 **Time Windows**: Set specific time ranges for when websites should open

## Version 2.0.0 Updates

- ✨ Completely redesigned UI with modern glassmorphism design
- 🚀 Updated to React 19 and Vite 6
- 🎨 Beautiful gradient backgrounds and smooth animations
- 🔧 Fixed all linting issues and improved code structure
- 📱 Responsive design that works on all screen sizes
- ⚡ Improved performance and build optimization

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `dist` folder as an unpacked extension in Chrome

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🚀 Deployment

### Automated Deployment (Recommended)

Deploy to Chrome Web Store with a single command:

```bash
npm run deploy
```

This will automatically:

- ✅ Build your extension
- 📦 Package it into a zip file
- 📤 Upload to Chrome Web Store
- 🚀 Publish the update

**Setup required**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for first-time setup instructions.

**Quick reference**: See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for daily usage.

### Manual Publishing

For manual publishing process, see [PUBLISHING.md](./PUBLISHING.md).

### Version Management

```bash
npm run version:patch  # Bug fixes (2.0.1 → 2.0.2)
npm run version:minor  # New features (2.0.1 → 2.1.0)
npm run version:major  # Breaking changes (2.0.1 → 3.0.0)
```

## Usage

1. Click the extension icon to open the scheduler
2. Click "Add New Scheduler" to create a new scheduled website
3. Fill in the website details and scheduling options
4. The extension will automatically open websites according to your schedule

## Technical Stack

- React 19
- Vite 6
- Modern CSS with glassmorphism effects
- Chrome Extension Manifest V3
- ESLint for code quality

## Privacy & Legal

- [Privacy Policy](https://bhaggat.github.io/chrome-scheduler/static-hosting/)
