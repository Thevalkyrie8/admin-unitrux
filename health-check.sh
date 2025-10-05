#!/bin/bash

# Unitrux Admin Health Check Script
# This script performs comprehensive health checks on the production system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_URL="http://localhost"
HEALTH_ENDPOINT="/health"
API_URL="https://unitrux-api.up.railway.app/api"
CONTAINER_NAME="unitrux-admin-prod"

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

echo -e "${BLUE}🏥 Unitrux Admin Health Check${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_CHECKS++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to run a check
run_check() {
    local check_name="$1"
    local check_command="$2"
    
    ((TOTAL_CHECKS++))
    print_info "Checking: $check_name"
    
    if eval "$check_command" > /dev/null 2>&1; then
        print_status "$check_name - PASSED"
        return 0
    else
        print_error "$check_name - FAILED"
        return 1
    fi
}

# 1. Docker Health Check
echo -e "\n${BLUE}🐳 Docker Health Checks${NC}"
echo "------------------------"

run_check "Docker is running" "docker info"
run_check "Container is running" "docker ps | grep $CONTAINER_NAME"
run_check "Container is healthy" "docker inspect $CONTAINER_NAME | grep -q 'healthy'"

# 2. Application Health Check
echo -e "\n${BLUE}🌐 Application Health Checks${NC}"
echo "-------------------------------"

run_check "Application responds" "curl -f $APP_URL$HEALTH_ENDPOINT"
run_check "Main page loads" "curl -f $APP_URL"
run_check "Static assets load" "curl -f $APP_URL/index.html"

# 3. API Connectivity Check
echo -e "\n${BLUE}🔌 API Connectivity Checks${NC}"
echo "-----------------------------"

run_check "API is reachable" "curl -f $API_URL/health"
run_check "API responds to requests" "curl -f $API_URL/health | grep -q 'status'"

# 4. System Resource Check
echo -e "\n${BLUE}💻 System Resource Checks${NC}"
echo "-----------------------------"

# Check memory usage
MEMORY_USAGE=$(docker stats --no-stream --format "table {{.MemUsage}}" $CONTAINER_NAME | tail -n 1 | cut -d'/' -f1 | sed 's/[^0-9.]//g')
if (( $(echo "$MEMORY_USAGE < 1000" | bc -l) )); then
    print_status "Memory usage is normal ($MEMORY_USAGE MB)"
    ((PASSED_CHECKS++))
else
    print_warning "Memory usage is high ($MEMORY_USAGE MB)"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# Check CPU usage
CPU_USAGE=$(docker stats --no-stream --format "table {{.CPUPerc}}" $CONTAINER_NAME | tail -n 1 | sed 's/%//')
if (( $(echo "$CPU_USAGE < 80" | bc -l) )); then
    print_status "CPU usage is normal ($CPU_USAGE%)"
    ((PASSED_CHECKS++))
else
    print_warning "CPU usage is high ($CPU_USAGE%)"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# 5. Network Check
echo -e "\n${BLUE}🌐 Network Checks${NC}"
echo "-------------------"

run_check "Port 80 is listening" "netstat -tuln | grep :80"
run_check "No port conflicts" "! (netstat -tuln | grep :80 | wc -l | grep -q '^[2-9]')"

# 6. Log Check
echo -e "\n${BLUE}📋 Log Checks${NC}"
echo "---------------"

# Check for errors in logs
ERROR_COUNT=$(docker logs $CONTAINER_NAME 2>&1 | grep -i error | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    print_status "No errors in recent logs"
    ((PASSED_CHECKS++))
else
    print_warning "Found $ERROR_COUNT errors in logs"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# Check for warnings in logs
WARNING_COUNT=$(docker logs $CONTAINER_NAME 2>&1 | grep -i warning | wc -l)
if [ "$WARNING_COUNT" -lt 5 ]; then
    print_status "Minimal warnings in logs ($WARNING_COUNT)"
    ((PASSED_CHECKS++))
else
    print_warning "Multiple warnings in logs ($WARNING_COUNT)"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# 7. Security Check
echo -e "\n${BLUE}🔒 Security Checks${NC}"
echo "-------------------"

run_check "HTTPS redirect works" "curl -I $APP_URL | grep -i 'location.*https'"
run_check "Security headers present" "curl -I $APP_URL | grep -i 'x-frame-options'"

# 8. Performance Check
echo -e "\n${BLUE}⚡ Performance Checks${NC}"
echo "------------------------"

# Check response time
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' $APP_URL)
if (( $(echo "$RESPONSE_TIME < 2" | bc -l) )); then
    print_status "Response time is good (${RESPONSE_TIME}s)"
    ((PASSED_CHECKS++))
else
    print_warning "Response time is slow (${RESPONSE_TIME}s)"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# Summary
echo -e "\n${BLUE}📊 Health Check Summary${NC}"
echo "=========================="
echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"

# Calculate health percentage
HEALTH_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo -e "Health Score: ${HEALTH_PERCENTAGE}%"

# Overall status
if [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All health checks passed! System is healthy.${NC}"
    exit 0
elif [ "$HEALTH_PERCENTAGE" -ge 80 ]; then
    echo -e "\n${YELLOW}⚠️  System is mostly healthy with some issues.${NC}"
    exit 1
else
    echo -e "\n${RED}🚨 System has critical issues that need attention!${NC}"
    exit 2
fi
