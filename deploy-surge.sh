#!/bin/bash

# Deploy to Surge.sh
echo "🚀 Deploying to Surge.sh..."

# Install Surge CLI if not installed
if ! command -v surge &> /dev/null; then
    echo "📦 Installing Surge CLI..."
    npm install -g surge
fi

# Build the project
echo "🔨 Building project..."
npm run build:prod

# Deploy to Surge
echo "🚀 Deploying..."
cd dist
surge . unitrux-admin-$(date +%s).surge.sh

echo "✅ Deployed to Surge.sh!"
echo "🌐 Your app is live at the URL shown above"
