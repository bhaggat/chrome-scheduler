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

printf "${BLUE}📁 Static Directory: $STATIC_DIR${NC}\n"

# Check if static directory exists
if [ ! -d "$STATIC_DIR" ]; then
    printf "${RED}❌ Error: static-hosting directory not found.${NC}\n"
    exit 1
fi

# Check if required files exist
REQUIRED_FILES=("index.html" "privacy.html" "terms.html" "support.html")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$STATIC_DIR/$file" ]; then
        printf "${RED}❌ Error: $file not found in static-hosting directory.${NC}\n"
        exit 1
    fi
done

printf "${GREEN}✅ All required files found!${NC}\n"

# Function to deploy to GitHub Pages
deploy_github() {
    printf "${YELLOW}🚀 Deploying to GitHub Pages...${NC}\n"
    
    cd "$STATIC_DIR"
    
    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit - Static hosting setup"
    fi
    
    # Check if remote exists, if not, try to detect from project root
    if ! git remote get-url origin >/dev/null 2>&1; then
        printf "${BLUE}🔍 Detecting remote from project root...${NC}\n"
        PROJECT_REMOTE=$(git -C "$PROJECT_ROOT" remote get-url origin 2>/dev/null || echo "")
        
        if [ -n "$PROJECT_REMOTE" ]; then
            printf "${GREEN}✅ Found remote: $PROJECT_REMOTE${NC}\n"
            git remote add origin "$PROJECT_REMOTE"
        else
            printf "${YELLOW}⚠️  No remote repository found. Please add one manually:${NC}\n"
            printf "cd static-hosting && git remote add origin <your-repo-url>\n"
            exit 1
        fi
    fi
    
    # Push to gh-pages branch (safer than main)
    git add .
    git commit -m "Update static hosting - $(date)" || echo "No changes to commit"
    
    CURRENT_BRANCH=$(git branch --show-current)
    printf "${YELLOW}📤 Pushing to gh-pages branch...${NC}\n"
    git push origin "$CURRENT_BRANCH:gh-pages" --force
    
    printf "${GREEN}✅ Deployed to GitHub Pages!${NC}\n"
    printf "${BLUE}📱 Your site should be available at (after a few minutes):${NC}\n"
    
    # Try to extract username and repo for the URL
    REMOTE_URL=$(git remote get-url origin)
    if [[ $REMOTE_URL =~ github.com[:/]([^/]+)/([^/.]+)(\.git)? ]]; then
        USER="${BASH_REMATCH[1]}"
        REPO="${BASH_REMATCH[2]}"
        printf "https://$USER.github.io/$REPO/\n"
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    printf "${YELLOW}🚀 Deploying to Netlify...${NC}\n"
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        printf "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}\n"
        npm install -g netlify-cli
    fi
    
    cd "$STATIC_DIR"
    netlify deploy --dir=. --prod
    
    printf "${GREEN}✅ Deployed to Netlify!${NC}\n"
}

# Function to deploy to Vercel
deploy_vercel() {
    printf "${YELLOW}🚀 Deploying to Vercel...${NC}\n"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        printf "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}\n"
        npm install -g vercel
    fi
    
    cd "$STATIC_DIR"
    vercel --prod
    
    printf "${GREEN}✅ Deployed to Vercel!${NC}\n"
}

# Function to create deployment package
create_package() {
    printf "${YELLOW}📦 Creating deployment package...${NC}\n"
    
    PACKAGE_NAME="static-hosting-$(date +%Y%m%d-%H%M%S).zip"
    PACKAGE_PATH="$PROJECT_ROOT/$PACKAGE_NAME"
    
    cd "$STATIC_DIR"
    zip -r "../$PACKAGE_NAME" . -x "*.DS_Store" "*.git*" "*.svn*"
    
    printf "${GREEN}✅ Package created: $PACKAGE_NAME${NC}\n"
    printf "${BLUE}📁 Location: $PACKAGE_PATH${NC}\n"
    
    # Show file size
    FILE_SIZE=$(du -h "$PACKAGE_PATH" | cut -f1)
    printf "${BLUE}📏 File size: $FILE_SIZE${NC}\n"
}

# Main menu
printf "${BLUE}Choose deployment option:${NC}\n"
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
        printf "${RED}❌ Invalid choice. Please run the script again.${NC}\n"
        exit 1
        ;;
esac

echo ""
printf "${GREEN}🎉 Deployment process completed!${NC}\n"
