# 🚀 Unitrux Backend API Documentation

## 📋 **Tổng quan**
- **Base URL**: `http://localhost:3001/api`
- **Swagger UI**: `http://localhost:3001/api/docs`
- **Authentication**: JWT Bearer Token
- **File Upload**: Multipart/form-data

---

## 🔐 **Authentication APIs**

### **1. Đăng ký tài khoản**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "admin@unitrux.com",
  "password": "password123",
  "name": "Admin User"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "email": "admin@unitrux.com",
  "name": "Admin User",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-10-02T07:00:41.282Z"
}
```

### **2. Đăng nhập**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@unitrux.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "uuid-string",
    "email": "admin@unitrux.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## 📁 **Media APIs**

### **1. Upload File**
```http
POST /api/media/upload
Content-Type: multipart/form-data

Form Data:
- file: [file] (required)
- category: string (optional)
- productId: string (optional)
- newsId: string (optional)
```

**Supported File Types:**
- **Images**: jpg, jpeg, png, gif
- **Videos**: mp4, avi, mov
- **Documents**: pdf, doc, docx
- **Max Size**: 50MB

**Response:**
```json
{
  "id": "088b1641-dc8d-45c8-b345-2139c1e3e24b",
  "filename": "file-1759413637783-316950116.jpg",
  "originalName": "dqha-2.jpg",
  "mimeType": "image/jpeg",
  "size": 1189508,
  "path": "uploads\\file-1759413637783-316950116.jpg",
  "type": "image",
  "cloudinaryId": null,
  "cloudinaryUrl": null,
  "category": "test",
  "isActive": true,
  "productId": null,
  "newsId": null,
  "url": "http://localhost:3001/api/media/file/088b1641-dc8d-45c8-b345-2139c1e3e24b",
  "fileUrl": "http://localhost:3001/api/media/file/088b1641-dc8d-45c8-b345-2139c1e3e24b",
  "createdAt": "2025-10-02T07:00:41.282Z",
  "updatedAt": "2025-10-02T07:00:41.282Z"
}
```

### **2. Lấy tất cả files**
```http
GET /api/media
```

**Query Parameters:**
- `category` (optional): Lọc theo category

**Response:**
```json
[
  {
    "id": "uuid-string",
    "filename": "file-name.jpg",
    "originalName": "original-name.jpg",
    "mimeType": "image/jpeg",
    "size": 1189508,
    "path": "uploads/file-name.jpg",
    "type": "image",
    "cloudinaryId": null,
    "cloudinaryUrl": null,
    "category": "test",
    "isActive": true,
    "productId": null,
    "newsId": null,
    "url": "http://localhost:3001/api/media/file/uuid-string",
    "fileUrl": "http://localhost:3001/api/media/file/uuid-string",
    "createdAt": "2025-10-02T07:00:41.282Z",
    "updatedAt": "2025-10-02T07:00:41.282Z"
  }
]
```

### **3. Lấy files theo category**
```http
GET /api/media?category=product
```

### **4. Lấy files của product**
```http
GET /api/media/product/{productId}
```

### **5. Lấy files của news**
```http
GET /api/media/news/{newsId}
```

### **6. Lấy file cụ thể**
```http
GET /api/media/{id}
```

### **7. Serve file (hiển thị file)**
```http
GET /api/media/file/{id}
```
**Response:** File content (image, video, document)

### **8. Xóa file**
```http
DELETE /api/media/{id}
```

---

## 🛍️ **Product APIs**

### **1. Lấy tất cả products**
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Lọc theo category
- `isActive` (optional): Lọc theo trạng thái

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Product Name",
    "description": "Product description",
    "image": "image-url",
    "category": "category-name",
    "price": 100.00,
    "priceType": "USD",
    "features": ["feature1", "feature2"],
    "results": ["result1", "result2"],
    "isActive": true,
    "sortOrder": 0,
    "createdAt": "2025-10-02T07:00:41.282Z",
    "updatedAt": "2025-10-02T07:00:41.282Z"
  }
]
```

### **2. Tạo product mới**
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "New Product",
  "description": "Product description",
  "image": "image-url",
  "category": "category-name",
  "price": 100.00,
  "priceType": "USD",
  "features": ["feature1", "feature2"],
  "results": ["result1", "result2"]
}
```

### **3. Lấy product theo ID**
```http
GET /api/products/{id}
```

### **4. Cập nhật product**
```http
PATCH /api/products/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Updated Product Name",
  "price": 150.00
}
```

### **5. Xóa product**
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

---

## 📰 **News APIs**

### **1. Lấy tất cả news**
```http
GET /api/news
```

**Query Parameters:**
- `category` (optional): Lọc theo category
- `isPublished` (optional): Lọc theo trạng thái publish
- `isFeatured` (optional): Lọc theo featured

**Response:**
```json
[
  {
    "id": "uuid-string",
    "title": "News Title",
    "excerpt": "News excerpt",
    "content": "Full news content",
    "category": "news-category",
    "image": "image-url",
    "author": "Author Name",
    "isPublished": true,
    "isFeatured": false,
    "viewCount": 0,
    "sortOrder": 0,
    "createdAt": "2025-10-02T07:00:41.282Z",
    "updatedAt": "2025-10-02T07:00:41.282Z"
  }
]
```

### **2. Tạo news mới**
```http
POST /api/news
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "News Title",
  "excerpt": "News excerpt",
  "content": "Full news content",
  "category": "news-category",
  "image": "image-url",
  "author": "Author Name"
}
```

### **3. Lấy news theo ID**
```http
GET /api/news/{id}
```

### **4. Cập nhật news**
```http
PATCH /api/news/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Updated News Title",
  "isPublished": true
}
```

### **5. Xóa news**
```http
DELETE /api/news/{id}
Authorization: Bearer {token}
```

---

## 🛠️ **Service APIs**

### **1. Lấy tất cả services**
```http
GET /api/services
```

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Service Name",
    "description": "Service description",
    "icon": "icon-url",
    "features": ["feature1", "feature2"],
    "category": "service-category",
    "isActive": true,
    "sortOrder": 0,
    "createdAt": "2025-10-02T07:00:41.282Z",
    "updatedAt": "2025-10-02T07:00:41.282Z"
  }
]
```

### **2. Tạo service mới**
```http
POST /api/services
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "New Service",
  "description": "Service description",
  "icon": "icon-url",
  "features": ["feature1", "feature2"],
  "category": "service-category"
}
```

---

## 📦 **Package APIs**

### **1. Lấy tất cả packages**
```http
GET /api/packages
```

### **2. Lấy packages theo service**
```http
GET /api/packages?serviceId={serviceId}
```

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Package Name",
    "description": "Package description",
    "features": ["feature1", "feature2"],
    "badge": "Popular",
    "price": 99.00,
    "priceType": "USD",
    "isPopular": true,
    "isActive": true,
    "sortOrder": 0,
    "serviceId": "service-uuid",
    "createdAt": "2025-10-02T07:00:41.282Z",
    "updatedAt": "2025-10-02T07:00:41.282Z"
  }
]
```

---

## 📞 **Contact APIs**

### **1. Lấy tất cả contacts**
```http
GET /api/contacts
Authorization: Bearer {token}
```

### **2. Tạo contact mới**
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Hello, I'm interested in your services",
  "subject": "Inquiry"
}
```

### **3. Đánh dấu đã đọc**
```http
PATCH /api/contacts/{id}/read
Authorization: Bearer {token}
```

### **4. Đánh dấu đã trả lời**
```http
PATCH /api/contacts/{id}/replied
Content-Type: application/json
Authorization: Bearer {token}

{
  "replyMessage": "Thank you for your inquiry. We will contact you soon."
}
```

---

## 🔧 **Cấu hình cho Frontend**

### **1. Base Configuration**
```javascript
const API_BASE_URL = 'http://localhost:3001/api';

// Headers cho authenticated requests
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});
```

### **2. File Upload Example**
```javascript
const uploadFile = async (file, category, productId = null, newsId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  if (productId) formData.append('productId', productId);
  if (newsId) formData.append('newsId', newsId);

  const response = await fetch(`${API_BASE_URL}/media/upload`, {
    method: 'POST',
    body: formData
  });

  return await response.json();
};
```

### **3. Get Files Example**
```javascript
const getFiles = async (category = null) => {
  const url = category 
    ? `${API_BASE_URL}/media?category=${category}`
    : `${API_BASE_URL}/media`;
    
  const response = await fetch(url);
  return await response.json();
};
```

### **4. Display File Example**
```javascript
// Sử dụng URL từ API response
const fileUrl = media.fileUrl; // hoặc media.url

// Hiển thị ảnh
<img src={fileUrl} alt={media.originalName} />

// Hiển thị video
<video src={fileUrl} controls>
  Your browser does not support the video tag.
</video>
```

---

## 📊 **Database Schema**

### **Media Table**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| filename | VARCHAR(255) | Tên file trên server |
| originalName | VARCHAR(500) | Tên file gốc |
| mimeType | VARCHAR(100) | MIME type của file |
| size | BIGINT | Kích thước file (bytes) |
| path | VARCHAR(500) | Đường dẫn file |
| type | VARCHAR(100) | Loại file (image/video/document) |
| cloudinaryId | VARCHAR(255) | ID trên Cloudinary (nullable) |
| cloudinaryUrl | VARCHAR(500) | URL trên Cloudinary (nullable) |
| category | VARCHAR(100) | Danh mục file (nullable) |
| isActive | BOOLEAN | Trạng thái hoạt động |
| productId | UUID | ID của product (nullable) |
| newsId | UUID | ID của news (nullable) |
| createdAt | TIMESTAMP | Thời gian tạo |
| updatedAt | TIMESTAMP | Thời gian cập nhật |

### **Product Table**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Tên sản phẩm |
| description | TEXT | Mô tả sản phẩm |
| image | VARCHAR(500) | URL ảnh sản phẩm |
| category | VARCHAR(100) | Danh mục sản phẩm |
| price | DECIMAL(10,2) | Giá sản phẩm |
| priceType | VARCHAR(50) | Loại tiền tệ |
| features | JSON | Danh sách tính năng |
| results | JSON | Danh sách kết quả |
| isActive | BOOLEAN | Trạng thái hoạt động |
| sortOrder | INTEGER | Thứ tự sắp xếp |
| createdAt | TIMESTAMP | Thời gian tạo |
| updatedAt | TIMESTAMP | Thời gian cập nhật |

---

## 🚀 **Deployment**

### **Development**
```bash
npm run start:dev
```

### **Production**
```bash
npm run build
npm run start:prod
```

### **Environment Variables**
```bash
NODE_ENV=production
DB_TYPE=postgres
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
DB_SSL=true
PORT=3001
JWT_SECRET=your-jwt-secret

# Cloudinary (for production)
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📝 **Notes**

1. **File Upload**: Files được lưu trong `./uploads/` (development) hoặc Cloudinary (production)
2. **Authentication**: Sử dụng JWT Bearer token cho các API cần xác thực
3. **File Serving**: Files được serve qua `/api/media/file/{id}` endpoint
4. **CORS**: Đã được cấu hình để cho phép requests từ frontend
5. **Swagger**: Documentation tự động tại `/api/docs`

---

## 🔗 **Useful Links**

- **Swagger UI**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api
- **File Upload Test**: Sử dụng Swagger UI hoặc Postman
