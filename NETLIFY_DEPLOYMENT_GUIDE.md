# 🌐 Hướng Dẫn Deploy Netlify - Unitrux Admin

## 🎯 **Tổng quan**

Netlify là platform hosting miễn phí tuyệt vời cho React/Vite apps với:
- ✅ 100GB bandwidth/tháng miễn phí
- ✅ Auto-deploy từ GitHub
- ✅ Custom domain miễn phí
- ✅ SSL certificate tự động
- ✅ Form handling
- ✅ Serverless functions

## 🚀 **3 Cách Deploy**

### **Cách 1: Script Tự Động (Khuyến nghị)**

#### Windows:
```bash
deploy-netlify.bat
```

#### Linux/macOS:
```bash
chmod +x deploy-netlify.sh
./deploy-netlify.sh
```

### **Cách 2: Deploy Thủ Công**

#### Bước 1: Cài Netlify CLI
```bash
npm install -g netlify-cli
```

#### Bước 2: Login
```bash
netlify login
```

#### Bước 3: Build & Deploy
```bash
# Build project
npm run build:prod

# Deploy preview
netlify deploy --dir=dist

# Deploy production
netlify deploy --prod --dir=dist
```

### **Cách 3: Deploy qua GitHub (Tốt nhất cho production)**

#### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

#### Bước 2: Tạo site trên Netlify
1. Vào [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Chọn **GitHub** → tìm repo `unitrux-admin`
4. Cấu hình:
   - **Build command**: `npm ci && npm run build:prod`
   - **Publish directory**: `dist`
   - **Node version**: `18`

#### Bước 3: Cấu hình Environment Variables
1. Vào **Site Settings** → **Environment Variables**
2. Thêm các biến:
   ```
   VITE_APP_ENV = production
   VITE_API_BASE_URL = https://unitrux-api.up.railway.app/api
   VITE_API_TIMEOUT = 30000
   VITE_BUILD_SOURCEMAP = false
   VITE_BUILD_MINIFY = true
   ```

#### Bước 4: Deploy
- Click **"Deploy site"**
- Netlify sẽ tự động build và deploy

## ⚙️ **Cấu hình Chi Tiết**

### **File `netlify.toml`**
```toml
[build]
  publish = "dist"
  command = "npm ci && npm run build:prod"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"
  VITE_APP_ENV = "production"
  VITE_API_BASE_URL = "https://unitrux-api.up.railway.app/api"
  VITE_API_TIMEOUT = "30000"
  VITE_BUILD_SOURCEMAP = "false"
  VITE_BUILD_MINIFY = "true"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🔧 **Tính Năng Nâng Cao**

### **1. Custom Domain**
1. Vào **Site Settings** → **Domain Management**
2. Click **"Add custom domain"**
3. Nhập domain của bạn
4. Cấu hình DNS theo hướng dẫn
5. Netlify tự động cấp SSL certificate

### **2. Form Handling**
```html
<!-- Thêm vào form -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Send</button>
</form>
```

### **3. Serverless Functions**
Tạo file `netlify/functions/hello.js`:
```javascript
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify!' })
  }
}
```

### **4. Branch Deploys**
- Mỗi branch sẽ có preview URL riêng
- Perfect cho testing trước khi merge

### **5. Split Testing**
1. Vào **Site Settings** → **Split Testing**
2. Tạo A/B test
3. Phân chia traffic giữa các version

## 📊 **Monitoring & Analytics**

### **1. Netlify Analytics**
- Vào **Site Settings** → **Analytics**
- Xem traffic, performance metrics
- Real-time visitor data

### **2. Build Logs**
- Vào **Deploys** tab
- Click vào build để xem logs
- Debug build issues

### **3. Function Logs**
- Vào **Functions** tab
- Xem logs của serverless functions

## 🚨 **Troubleshooting**

### **Lỗi thường gặp:**

#### 1. Build failed
```bash
# Kiểm tra Node version
node --version

# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Kiểm tra build locally
npm run build:prod
```

#### 2. 404 errors
- Đảm bảo có redirect rules trong `netlify.toml`
- Kiểm tra publish directory

#### 3. Environment variables không work
- Đảm bảo variables bắt đầu với `VITE_`
- Restart deployment sau khi thay đổi
- Kiểm tra trong Site Settings

#### 4. API không kết nối
- Kiểm tra CORS settings trên API server
- Kiểm tra environment variables
- Kiểm tra network tab trong DevTools

### **Debug Commands:**
```bash
# Xem site status
netlify status

# Xem site info
netlify sites:list

# Xem deploy logs
netlify logs

# Open site
netlify open
```

## 📈 **Performance Tips**

### **1. Optimize Images**
- Sử dụng WebP format
- Lazy loading
- Responsive images

### **2. Bundle Optimization**
```bash
# Analyze bundle size
npm run analyze

# Optimize imports
# Sử dụng dynamic imports cho code splitting
```

### **3. Caching Strategy**
- Static assets: 1 year
- HTML: no-cache
- API responses: appropriate headers

### **4. CDN**
- Netlify có Global CDN built-in
- Assets được cache tại edge locations
- Tốc độ load nhanh toàn cầu

## 🔄 **CI/CD Pipeline**

### **Auto-deploy từ GitHub:**
1. Push code lên GitHub
2. Netlify tự động detect changes
3. Build và deploy tự động
4. Preview URL cho mỗi commit

### **Deploy từ CLI:**
```bash
# Deploy preview
netlify deploy

# Deploy production
netlify deploy --prod

# Deploy specific branch
netlify deploy --branch=feature-branch
```

## 🎉 **Kết Luận**

Netlify là lựa chọn tuyệt vời cho:
- ✅ React/Vite applications
- ✅ Static sites
- ✅ JAMstack apps
- ✅ Serverless functions
- ✅ Form handling

**Ưu điểm:**
- Dễ dùng, setup nhanh
- Tích hợp tốt với GitHub
- Performance cao
- Tính năng phong phú

**Hạn chế:**
- Chỉ phù hợp với static sites
- Serverless functions có giới hạn
- Bandwidth có giới hạn (100GB/tháng)

---

**🚀 Chúc bạn deploy thành công với Netlify!**
