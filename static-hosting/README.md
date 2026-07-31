# 🌐 Static Hosting for Scheduled Website Opener

This directory contains the static website files for the Scheduled Website Opener Chrome extension. The site provides information about the extension, privacy policy, terms of service, and support documentation.

## 📁 File Structure

```
static-hosting/
├── index.html          # Main landing page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── support.html        # Support and FAQ
├── README.md           # This file
└── icons/              # Extension icons (if needed)
```

## 🚀 Deployment Options

### Option 1: GitHub Pages

1. Push this directory to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to the `static-hosting` folder
4. Your site will be available at `https://username.github.io/repository-name`

### Option 2: Netlify

1. Connect your GitHub repository to Netlify
2. Set build directory to `static-hosting`
3. Deploy automatically on every push

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the `static-hosting` directory
3. Follow the prompts to deploy

### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting` in the `static-hosting` directory
3. Deploy with `firebase deploy`

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Glassmorphism effects and gradients
- **Fast Loading**: Optimized CSS and minimal dependencies
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessibility**: Good contrast ratios and keyboard navigation

## 📱 Pages Overview

### Home Page (`index.html`)

- Hero section with call-to-action
- Feature highlights with icons
- Statistics and social proof
- Use case examples
- Direct link to Chrome Web Store

### Privacy Policy (`privacy.html`)

- Comprehensive privacy information
- Data handling explanations
- Permission usage details
- Contact information
- GDPR compliance information

### Terms of Service (`terms.html`)

- Usage terms and conditions
- Permitted and prohibited uses
- Liability disclaimers
- Governing law information
- Contact details

### Support (`support.html`)

- Frequently asked questions
- Troubleshooting guides
- Step-by-step instructions
- Contact information
- Tips for best results

## 🔧 Customization

### Colors and Branding

The site uses a consistent color scheme that matches your extension:

- Primary: `#667eea` (Blue)
- Secondary: `#764ba2` (Purple)
- Background: Linear gradient from primary to secondary

### Content Updates

To update content:

1. Edit the relevant HTML files
2. Update version numbers and dates
3. Test locally by opening files in a browser
4. Deploy to your hosting platform

### Adding New Pages

1. Create new HTML file following the existing structure
2. Include the same CSS styles and navigation
3. Add links to the new page in the footer
4. Update the README with the new page

## 📊 Analytics Integration

To add analytics (optional):

1. Add Google Analytics or similar tracking code
2. Insert before the closing `</head>` tag
3. Update privacy policy to mention analytics usage

## 🔍 SEO Optimization

The site includes:

- Meta descriptions for each page
- Proper heading structure (H1, H2, H3)
- Alt text for images
- Semantic HTML structure
- Open Graph meta tags (can be added)

## 🚀 Quick Deploy Commands

### GitHub Pages

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Add remote and push
git remote add origin https://github.com/username/repository.git
git push -u origin main
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=static-hosting --prod
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --cwd static-hosting
```

## 📝 Content Guidelines

### Writing Style

- Use clear, concise language
- Write for a general audience
- Include relevant examples
- Use bullet points for lists
- Keep paragraphs short

### Visual Elements

- Use emojis sparingly for visual appeal
- Include relevant icons and graphics
- Maintain consistent spacing
- Use high contrast for readability

## 🔗 Links to Update

Make sure to update these links in all files:

- Chrome Web Store extension URL
- Contact email address
- Social media links (if applicable)
- Repository links

## 📞 Support

For questions about the static hosting setup:

- Check the deployment platform's documentation
- Review the HTML and CSS for any issues
- Test locally before deploying
- Contact the developer for technical support

---

**Happy Hosting! 🎉**
