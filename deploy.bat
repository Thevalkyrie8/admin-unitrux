@echo off
REM Unitrux Admin Deployment Script for Windows
REM This script handles the deployment process for production

setlocal enabledelayedexpansion

REM Configuration
set APP_NAME=unitrux-admin
set DOCKER_IMAGE=unitrux-admin:latest
set CONTAINER_NAME=unitrux-admin-prod

echo 🚀 Starting Unitrux Admin Deployment

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Check if required files exist
if not exist "Dockerfile" (
    echo ❌ Required file Dockerfile not found!
    exit /b 1
)
if not exist "nginx.conf" (
    echo ❌ Required file nginx.conf not found!
    exit /b 1
)
if not exist "docker-compose.prod.yml" (
    echo ❌ Required file docker-compose.prod.yml not found!
    exit /b 1
)

echo ✅ All required files found

REM Clean up previous builds
echo ✅ Cleaning up previous builds...
docker system prune -f
for /f "tokens=1" %%i in ('docker ps -q -f name=%CONTAINER_NAME%') do (
    echo ⚠️  Stopping existing container...
    docker stop %%i
    docker rm %%i
)

REM Build the Docker image
echo ✅ Building Docker image...
docker build -t %DOCKER_IMAGE% .

if %errorlevel% neq 0 (
    echo ❌ Failed to build Docker image
    exit /b 1
)

echo ✅ Docker image built successfully

REM Run the container
echo ✅ Starting production container...
docker run -d --name %CONTAINER_NAME% --restart unless-stopped -p 80:80 -e NODE_ENV=production -e VITE_APP_ENV=production -e VITE_API_BASE_URL=https://unitrux-api.up.railway.app/api %DOCKER_IMAGE%

if %errorlevel% neq 0 (
    echo ❌ Failed to start container
    exit /b 1
)

echo ✅ Container started successfully

REM Wait for container to be ready
echo ✅ Waiting for application to be ready...
timeout /t 10 /nobreak >nul

REM Health check
echo ✅ Performing health check...
curl -f http://localhost/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Health check passed! Application is running.
    echo 🌐 Application is available at: http://localhost
) else (
    echo ⚠️  Health check failed. Checking container logs...
    docker logs %CONTAINER_NAME%
    echo ❌ Application may not be running correctly
    exit /b 1
)

REM Show container status
echo ✅ Container status:
docker ps -f name=%CONTAINER_NAME%

REM Show logs
echo ✅ Recent logs:
docker logs --tail 20 %CONTAINER_NAME%

echo 🎉 Deployment completed successfully!
echo 📝 To view logs: docker logs -f %CONTAINER_NAME%
echo 🛑 To stop: docker stop %CONTAINER_NAME%
echo 🔄 To restart: docker restart %CONTAINER_NAME%

pause
