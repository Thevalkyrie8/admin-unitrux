@echo off
REM Deploy to Netlify - Windows Script

echo 🚀 Deploying to Netlify...

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Netlify CLI...
    npm install -g netlify-cli
)

REM Check if logged in to Netlify
netlify status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Netlify...
    netlify login
)

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm ci

REM Build the project
echo 🔨 Building project...
npm run build:prod

REM Check if build was successful
if not exist dist (
    echo ❌ Build failed! dist directory not found.
    pause
    exit /b 1
)

REM Deploy to Netlify (preview first)
echo 🚀 Deploying preview...
netlify deploy --dir=dist

REM Ask if user wants to deploy to production
echo 🤔 Deploy to production? (y/n)
set /p response=
if /i "%response%"=="y" (
    echo 🚀 Deploying to production...
    netlify deploy --prod --dir=dist
    echo ✅ Deployed to production!
) else (
    echo ℹ️  Preview deployed. Use 'netlify deploy --prod --dir=dist' to deploy to production.
)

REM Show site info
echo 📊 Site Information:
netlify status

echo 🎉 Deployment completed!
echo 🌐 Your app is live at the URL shown above

pause
