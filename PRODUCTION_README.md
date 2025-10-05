# 🚀 Unitrux Admin - Production Setup

## 📋 Quick Start

### 1. Deploy với Docker (Khuyến nghị)

```bash
# Clone repository
git clone <repository-url>
cd unitrux-admin

# Chạy script deployment tự động
# Windows:
deploy.bat

# Linux/macOS:
chmod +x deploy.sh
./deploy.sh
```

### 2. Deploy với Docker Compose

```bash
# Deploy production stack
docker-compose -f docker-compose.prod.yml up -d

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Kiểm tra sức khỏe hệ thống

```bash
# Chạy health check
chmod +x health-check.sh
./health-check.sh
```

## 🛠️ Cấu hình Environment

Tạo file `.env.production`:

```bash
VITE_APP_NAME=Unitrux Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_API_BASE_URL=https://unitrux-api.up.railway.app/api
VITE_API_TIMEOUT=30000
VITE_BUILD_SOURCEMAP=false
VITE_BUILD_MINIFY=true
VITE_APP_SECRET_KEY=your-production-secret-key
```

## 📊 Monitoring

### 1. Health Check
- **URL**: `http://localhost/health`
- **Status**: Returns 200 OK if healthy

### 2. Monitoring Stack (Tùy chọn)
```bash
# Start monitoring services
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Access monitoring tools
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin123)
# cAdvisor: http://localhost:8080
```

## 🔧 Maintenance

### 1. Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. View Logs
```bash
# Application logs
docker logs -f unitrux-admin-prod

# All services logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Backup
```bash
# Backup container
docker save unitrux-admin:latest > unitrux-admin-backup.tar

# Backup data
docker cp unitrux-admin-prod:/usr/share/nginx/html ./backup/
```

## 🚨 Troubleshooting

### Container không start
```bash
# Xem logs chi tiết
docker logs unitrux-admin-prod

# Kiểm tra port conflicts
netstat -tulpn | grep :80
```

### API không kết nối
- Kiểm tra `VITE_API_BASE_URL` trong environment
- Kiểm tra network connectivity
- Kiểm tra CORS settings

### Performance issues
```bash
# Xem resource usage
docker stats unitrux-admin-prod

# Analyze bundle size
npm run analyze
```

## 📞 Support

- **Documentation**: Xem `DEPLOYMENT_GUIDE.md`
- **Health Check**: Chạy `./health-check.sh`
- **Logs**: `docker logs -f unitrux-admin-prod`

---

**🎉 Chúc bạn deploy thành công!**
