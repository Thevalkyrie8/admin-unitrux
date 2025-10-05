# 🆓 Hướng Dẫn Deploy Miễn Phí - Unitrux Admin

## 🎯 **Khuyến nghị: Vercel (Tốt nhất)**

### Cách 1: Deploy tự động
```bash
# Cấp quyền và chạy
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

### Cách 2: Deploy thủ công
```bash
# 1. Cài Vercel CLI
npm install -g vercel

# 2. Build project
npm run build:prod

# 3. Deploy
vercel --prod
```

### Cách 3: Deploy qua GitHub (Khuyến nghị)
1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com)
3. Import project từ GitHub
4. Vercel tự động deploy mỗi khi push code

---

## 🌐 **Netlify (Lựa chọn #2)**

### Deploy tự động
```bash
chmod +x deploy-netlify.sh
./deploy-netlify.sh
```

### Deploy qua GitHub
1. Push code lên GitHub
2. Vào [netlify.com](https://netlify.com)
3. "New site from Git" → chọn GitHub repo
4. Build command: `npm run build:prod`
5. Publish directory: `dist`

---

## ⚡ **Surge.sh (Nhanh nhất)**

### Deploy siêu nhanh
```bash
chmod +x deploy-surge.sh
./deploy-surge.sh
```

### Deploy thủ công
```bash
# Cài Surge
npm install -g surge

# Build và deploy
npm run build:prod
cd dist
surge
```

---

## 📊 **So sánh các platform:**

| Platform | Tốc độ | Dễ dùng | Tính năng | Bandwidth | Custom Domain |
|----------|--------|---------|-----------|-----------|---------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 100GB | ✅ |
| **Netlify** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 100GB | ✅ |
| **Surge** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Unlimited | ✅ |
| **GitHub Pages** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | Unlimited | ✅ |
| **Firebase** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 10GB | ✅ |

---

## 🚀 **Hướng dẫn chi tiết từng bước:**

### **Vercel (Khuyến nghị)**

#### Bước 1: Chuẩn bị
```bash
# Đảm bảo code đã push lên GitHub
git add .
git commit -m "Ready for production"
git push origin main
```

#### Bước 2: Deploy
1. Vào [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click "New Project"
4. Import repository `unitrux-admin`
5. Vercel tự động detect Vite project
6. Click "Deploy"

#### Bước 3: Cấu hình
- **Build Command**: `npm run build:prod`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_APP_ENV` = `production`
  - `VITE_API_BASE_URL` = `https://unitrux-api.up.railway.app/api`

#### Bước 4: Custom Domain (Tùy chọn)
1. Vào Project Settings → Domains
2. Add custom domain
3. Cấu hình DNS theo hướng dẫn

---

### **Netlify**

#### Bước 1: Deploy
1. Vào [netlify.com](https://netlify.com)
2. "New site from Git"
3. Chọn GitHub → `unitrux-admin`
4. Cấu hình:
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist`
5. Click "Deploy site"

#### Bước 2: Environment Variables
1. Site Settings → Environment Variables
2. Add:
   - `VITE_APP_ENV` = `production`
   - `VITE_API_BASE_URL` = `https://unitrux-api.up.railway.app/api`

---

### **Surge.sh (Nhanh nhất)**

#### Bước 1: Cài đặt
```bash
npm install -g surge
```

#### Bước 2: Deploy
```bash
# Build project
npm run build:prod

# Deploy
cd dist
surge

# Nhập domain (hoặc để trống để random)
# Nhập email và password
```

---

## 🔧 **Troubleshooting**

### Lỗi thường gặp:

#### 1. Build failed
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. API không kết nối
- Kiểm tra CORS settings trên API server
- Kiểm tra environment variables
- Kiểm tra network connectivity

#### 3. 404 errors
- Đảm bảo có redirect rules cho SPA
- Kiểm tra build output directory

#### 4. Environment variables không work
- Đảm bảo variables bắt đầu với `VITE_`
- Restart deployment sau khi thay đổi

---

## 📈 **Performance Tips**

### 1. Optimize Bundle Size
```bash
# Analyze bundle
npm run analyze

# Optimize images
# Sử dụng WebP format
# Lazy loading cho images
```

### 2. Enable Caching
- Static assets: 1 year
- HTML files: no-cache
- API responses: appropriate cache headers

### 3. Use CDN
- Tất cả platform trên đều có CDN built-in
- Vercel có Edge Network (tốt nhất)
- Netlify có Global CDN

---

## 🎉 **Kết luận**

**Khuyến nghị của tôi:**
1. **Vercel** - Tốt nhất cho React apps, có Edge Network
2. **Netlify** - Nhiều tính năng, dễ dùng
3. **Surge** - Nhanh nhất, đơn giản nhất

**Chọn Vercel nếu:**
- Muốn performance tốt nhất
- Cần auto-deploy từ GitHub
- Muốn có custom domain miễn phí

**Chọn Netlify nếu:**
- Cần form handling
- Muốn serverless functions
- Cần split testing

**Chọn Surge nếu:**
- Muốn deploy nhanh nhất
- Không cần nhiều tính năng
- Chỉ cần static hosting

---

**🚀 Chúc bạn deploy thành công!**
