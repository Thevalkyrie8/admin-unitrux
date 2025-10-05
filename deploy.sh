#!/bin/bash

# Unitrux Admin Deployment Script
# This script handles the deployment process for production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="unitrux-admin"
DOCKER_IMAGE="unitrux-admin:latest"
CONTAINER_NAME="unitrux-admin-prod"

echo -e "${GREEN}🚀 Starting Unitrux Admin Deployment${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if required files exist
required_files=("Dockerfile" "nginx.conf" "docker-compose.prod.yml")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file $file not found!"
        exit 1
    fi
done

print_status "All required files found"

# Clean up previous builds
print_status "Cleaning up previous builds..."
docker system prune -f
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    print_warning "Stopping existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t $DOCKER_IMAGE .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Run the container
print_status "Starting production container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 80:80 \
    -e NODE_ENV=production \
    -e VITE_APP_ENV=production \
    -e VITE_API_BASE_URL=https://unitrux-api.up.railway.app/api \
    $DOCKER_IMAGE

if [ $? -eq 0 ]; then
    print_status "Container started successfully"
else
    print_error "Failed to start container"
    exit 1
fi

# Wait for container to be ready
print_status "Waiting for application to be ready..."
sleep 10

# Health check
print_status "Performing health check..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "Health check passed! Application is running."
    print_status "🌐 Application is available at: http://localhost"
else
    print_warning "Health check failed. Checking container logs..."
    docker logs $CONTAINER_NAME
    print_error "Application may not be running correctly"
    exit 1
fi

# Show container status
print_status "Container status:"
docker ps -f name=$CONTAINER_NAME

# Show logs
print_status "Recent logs:"
docker logs --tail 20 $CONTAINER_NAME

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 To view logs: docker logs -f $CONTAINER_NAME${NC}"
echo -e "${YELLOW}🛑 To stop: docker stop $CONTAINER_NAME${NC}"
echo -e "${YELLOW}🔄 To restart: docker restart $CONTAINER_NAME${NC}"
