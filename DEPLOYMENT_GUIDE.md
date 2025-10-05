# 🚀 Unitrux Admin - Hướng dẫn Deploy Production

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn deploy ứng dụng Unitrux Admin lên môi trường production một cách an toàn và hiệu quả.

## 🛠️ Yêu cầu hệ thống

### Phần mềm cần thiết
- **Node.js**: v18+ 
- **Docker**: v20+ với Docker Compose
- **Git**: Để clone repository
- **Nginx**: (tùy chọn, nếu không dùng Docker)

### Tài nguyên server
- **RAM**: Tối thiểu 2GB, khuyến nghị 4GB+
- **CPU**: 2 cores trở lên
- **Disk**: 10GB trống
- **OS**: Ubuntu 20.04+, CentOS 7+, hoặc Windows Server 2019+

## 🔧 Cấu hình Environment

### 1. Environment Variables

Tạo file `.env.production` với nội dung:

```bash
# Production Environment Configuration
VITE_APP_NAME=Unitrux Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# API Configuration
VITE_API_BASE_URL=https://unitrux-api.up.railway.app/api
VITE_API_TIMEOUT=30000

# Build Configuration
VITE_BUILD_SOURCEMAP=false
VITE_BUILD_MINIFY=true

# Security
VITE_APP_SECRET_KEY=your-production-secret-key-here
```

### 2. Cấu hình API

Đảm bảo API backend đã được deploy và hoạt động tại URL: `https://unitrux-api.up.railway.app/api`

## 🐳 Deploy với Docker (Khuyến nghị)

### Cách 1: Sử dụng Script tự động

#### Windows:
```bash
# Chạy script deployment
deploy.bat
```

#### Linux/macOS:
```bash
# Cấp quyền thực thi
chmod +x deploy.sh

# Chạy script deployment
./deploy.sh
```

### Cách 2: Deploy thủ công

#### 1. Build Docker image
```bash
docker build -t unitrux-admin:latest .
```

#### 2. Chạy container
```bash
docker run -d \
  --name unitrux-admin-prod \
  --restart unless-stopped \
  -p 80:80 \
  -e NODE_ENV=production \
  -e VITE_APP_ENV=production \
  -e VITE_API_BASE_URL=https://unitrux-api.up.railway.app/api \
  unitrux-admin:latest
```

#### 3. Kiểm tra trạng thái
```bash
# Xem container đang chạy
docker ps

# Xem logs
docker logs -f unitrux-admin-prod

# Health check
curl http://localhost/health
```

### Cách 3: Sử dụng Docker Compose

```bash
# Deploy với docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Dừng services
docker-compose -f docker-compose.prod.yml down
```

## 🌐 Deploy với Nginx (Không dùng Docker)

### 1. Build ứng dụng
```bash
# Cài đặt dependencies
npm install

# Build cho production
npm run build:prod
```

### 2. Cấu hình Nginx
```bash
# Copy file cấu hình
sudo cp nginx.conf /etc/nginx/sites-available/unitrux-admin

# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/unitrux-admin /etc/nginx/sites-enabled/

# Test cấu hình
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3. Copy files
```bash
# Copy build files
sudo cp -r dist/* /var/www/html/

# Cấp quyền
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

## 🔒 Cấu hình Security

### 1. SSL/TLS Certificate
```bash
# Sử dụng Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 2. Firewall
```bash
# Cấu hình UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Security Headers
File `nginx.conf` đã được cấu hình với các security headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy
- Referrer-Policy

## 📊 Monitoring & Logs

### 1. Xem logs ứng dụng
```bash
# Docker logs
docker logs -f unitrux-admin-prod

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Health Check
```bash
# Kiểm tra health endpoint
curl http://localhost/health

# Kiểm tra container health
docker inspect unitrux-admin-prod | grep Health
```

### 3. Performance Monitoring
```bash
# Xem tài nguyên sử dụng
docker stats unitrux-admin-prod

# Xem disk usage
docker system df
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Tùy chọn)
Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/unitrux-admin
          git pull origin main
          ./deploy.sh
```

## 🚨 Troubleshooting

### Lỗi thường gặp

#### 1. Container không start
```bash
# Xem logs chi tiết
docker logs unitrux-admin-prod

# Kiểm tra port đã được sử dụng
netstat -tulpn | grep :80
```

#### 2. API không kết nối được
- Kiểm tra URL API trong environment variables
- Kiểm tra network connectivity
- Kiểm tra CORS settings

#### 3. Build failed
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Docker cache
docker system prune -a
```

#### 4. Nginx 502 Bad Gateway
- Kiểm tra container có đang chạy không
- Kiểm tra port mapping
- Kiểm tra nginx configuration

### Performance Issues

#### 1. Slow loading
```bash
# Kiểm tra bundle size
npm run analyze

# Optimize images
# Sử dụng WebP format
# Enable gzip compression
```

#### 2. High memory usage
```bash
# Giới hạn memory cho container
docker run -m 1g unitrux-admin:latest

# Monitor memory usage
docker stats
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  unitrux-admin:
    # ... existing config
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### Load Balancer
Sử dụng Nginx hoặc HAProxy để load balance giữa các instances.

## 🔄 Backup & Recovery

### 1. Backup
```bash
# Backup container
docker save unitrux-admin:latest > unitrux-admin-backup.tar

# Backup data (nếu có)
docker cp unitrux-admin-prod:/usr/share/nginx/html ./backup/
```

### 2. Recovery
```bash
# Restore container
docker load < unitrux-admin-backup.tar

# Restore data
docker cp ./backup/. unitrux-admin-prod:/usr/share/nginx/html/
```

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy, vui lòng:

1. Kiểm tra logs chi tiết
2. Xem troubleshooting section
3. Tạo issue trên GitHub repository
4. Liên hệ team development

---

**Chúc bạn deploy thành công! 🎉**