#!/bin/bash

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Install Netlify CLI if not installed
if ! command -v netlify &> /dev/null; then
    echo -e "${BLUE}📦 Installing Netlify CLI...${NC}"
    npm install -g netlify-cli
fi

# Check if logged in to Netlify
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Netlify...${NC}"
    netlify login
fi

# Clean previous build
echo -e "${BLUE}🧹 Cleaning previous build...${NC}"
rm -rf dist

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build:prod

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed! dist directory not found.${NC}"
    exit 1
fi

# Deploy to Netlify (preview first)
echo -e "${BLUE}🚀 Deploying preview...${NC}"
netlify deploy --dir=dist

# Ask if user wants to deploy to production
echo -e "${YELLOW}🤔 Deploy to production? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}🚀 Deploying to production...${NC}"
    netlify deploy --prod --dir=dist
    echo -e "${GREEN}✅ Deployed to production!${NC}"
else
    echo -e "${YELLOW}ℹ️  Preview deployed. Use 'netlify deploy --prod --dir=dist' to deploy to production.${NC}"
fi

# Show site info
echo -e "${BLUE}📊 Site Information:${NC}"
netlify status

echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${BLUE}🌐 Your app is live at the URL shown above${NC}"
