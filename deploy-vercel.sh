#!/bin/bash

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build:prod

# Deploy to Vercel
echo "🚀 Deploying..."
vercel --prod

echo "✅ Deployed to Vercel!"
echo "🌐 Your app is live at the URL shown above"
