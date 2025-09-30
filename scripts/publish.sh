#!/bin/bash

# Chrome Extension Publisher Script
# This script builds and packages your extension for Chrome Web Store

set -e  # Exit on any error

echo "🚀 Chrome Extension Publisher"
echo "=============================="
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

echo -e "${BLUE}📦 Project Root: $PROJECT_ROOT${NC}"

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Get version from package.json
VERSION=$(node -p "require('$PROJECT_ROOT/package.json').version")
echo -e "${BLUE}📦 Current version: $VERSION${NC}"

# Check if node_modules exists
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
fi

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Check if dist directory exists
if [ ! -d "$PROJECT_ROOT/dist" ]; then
    echo -e "${RED}❌ Dist directory not found after build!${NC}"
    exit 1
fi

# Create zip file
ZIP_NAME="scheduled-website-opener-v$VERSION.zip"
ZIP_PATH="$PROJECT_ROOT/$ZIP_NAME"

echo -e "${YELLOW}📦 Creating zip file for Chrome Web Store...${NC}"

# Remove existing zip if it exists
if [ -f "$ZIP_PATH" ]; then
    rm "$ZIP_PATH"
fi

# Create zip file
cd "$PROJECT_ROOT/dist"
zip -r "../$ZIP_NAME" . -x "*.DS_Store" "*.git*" "*.svn*"
cd "$PROJECT_ROOT"

if [ -f "$ZIP_PATH" ]; then
    echo -e "${GREEN}✅ Zip file created: $ZIP_NAME${NC}"
    echo -e "${BLUE}📁 Location: $ZIP_PATH${NC}"
    
    # Show file size
    FILE_SIZE=$(du -h "$ZIP_PATH" | cut -f1)
    echo -e "${BLUE}📏 File size: $FILE_SIZE${NC}"
else
    echo -e "${RED}❌ Failed to create zip file!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎯 Next Steps:${NC}"
echo -e "${GREEN}==============${NC}"
echo "1. Go to Chrome Web Store Developer Dashboard:"
echo "   https://chrome.google.com/webstore/devconsole/"
echo "2. Find your extension: \"Scheduled Website Opener\""
echo "3. Click \"Upload new package\""
echo "4. Upload the file: $ZIP_NAME"
echo "5. Update the version number if needed"
echo "6. Add release notes describing the changes"
echo "7. Submit for review"
echo ""

echo -e "${GREEN}📋 Release Notes Template:${NC}"
echo -e "${GREEN}==========================${NC}"
echo "Version $VERSION Updates:"
echo "- Reduced UI spacing and made interface more compact"
echo "- Improved modal responsiveness and mobile experience"
echo "- Enhanced visual consistency and modern design"
echo "- Optimized performance and reduced bundle size"
echo "- Fixed styling issues and improved user experience"
echo ""

echo -e "${GREEN}🔗 Extension URL:${NC}"
echo "https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl"
echo ""

echo -e "${GREEN}✨ Publishing script completed successfully!${NC}"
