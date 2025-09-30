#!/bin/bash

# Static Hosting Deployment Script
# This script helps deploy the static website to various platforms

set -e  # Exit on any error

echo "🌐 Static Hosting Deployment Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
STATIC_DIR="$PROJECT_ROOT/static-hosting"

echo -e "${BLUE}📁 Static Directory: $STATIC_DIR${NC}"

# Check if static directory exists
if [ ! -d "$STATIC_DIR" ]; then
    echo -e "${RED}❌ Error: static-hosting directory not found.${NC}"
    exit 1
fi

# Check if required files exist
REQUIRED_FILES=("index.html" "privacy.html" "terms.html" "support.html")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$STATIC_DIR/$file" ]; then
        echo -e "${RED}❌ Error: $file not found in static-hosting directory.${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All required files found!${NC}"

# Function to deploy to GitHub Pages
deploy_github() {
    echo -e "${YELLOW}🚀 Deploying to GitHub Pages...${NC}"
    
    cd "$STATIC_DIR"
    
    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit - Static hosting setup"
    fi
    
    # Check if remote exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  No remote repository found. Please add one:${NC}"
        echo "git remote add origin https://github.com/username/repository.git"
        echo "Then run this script again."
        exit 1
    fi
    
    # Push to main branch
    git add .
    git commit -m "Update static hosting - $(date)" || echo "No changes to commit"
    git push origin main
    
    echo -e "${GREEN}✅ Deployed to GitHub Pages!${NC}"
    echo -e "${BLUE}📱 Your site should be available at:${NC}"
    echo "https://username.github.io/repository-name"
}

# Function to deploy to Netlify
deploy_netlify() {
    echo -e "${YELLOW}🚀 Deploying to Netlify...${NC}"
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
        npm install -g netlify-cli
    fi
    
    cd "$STATIC_DIR"
    netlify deploy --dir=. --prod
    
    echo -e "${GREEN}✅ Deployed to Netlify!${NC}"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi
    
    cd "$STATIC_DIR"
    vercel --prod
    
    echo -e "${GREEN}✅ Deployed to Vercel!${NC}"
}

# Function to create deployment package
create_package() {
    echo -e "${YELLOW}📦 Creating deployment package...${NC}"
    
    PACKAGE_NAME="static-hosting-$(date +%Y%m%d-%H%M%S).zip"
    PACKAGE_PATH="$PROJECT_ROOT/$PACKAGE_NAME"
    
    cd "$STATIC_DIR"
    zip -r "../$PACKAGE_NAME" . -x "*.DS_Store" "*.git*" "*.svn*"
    
    echo -e "${GREEN}✅ Package created: $PACKAGE_NAME${NC}"
    echo -e "${BLUE}📁 Location: $PACKAGE_PATH${NC}"
    
    # Show file size
    FILE_SIZE=$(du -h "$PACKAGE_PATH" | cut -f1)
    echo -e "${BLUE}📏 File size: $FILE_SIZE${NC}"
}

# Main menu
echo -e "${BLUE}Choose deployment option:${NC}"
echo "1) GitHub Pages"
echo "2) Netlify"
echo "3) Vercel"
echo "4) Create deployment package"
echo "5) Show deployment instructions"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_github
        ;;
    2)
        deploy_netlify
        ;;
    3)
        deploy_vercel
        ;;
    4)
        create_package
        ;;
    5)
        show_instructions
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
