# Unitrux Backend API Documentation for Frontend Admin

## 🌐 Base URL
```
https://web-production-194a.up.railway.app/api
```

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Services Management](#services-management)
3. [Packages Management](#packages-management)
4. [Products Management](#products-management)
5. [News Management](#news-management)
6. [Contact Management](#contact-management)
7. [Media Management](#media-management)
8. [Health Check](#health-check)
9. [Error Handling](#error-handling)
10. [CORS Configuration](#cors-configuration)

---

## 🔐 Authentication

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "unitrux@unitrux.com",
  "password": "unitrux@2025"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "unitrux@unitrux.com",
    "name": "Admin",
    "role": "admin",
    "isActive": true
  }
}
```

**Frontend Implementation:**
```javascript
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};
```

### Register (Admin only)
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "newadmin@unitrux.com",
  "password": "newpassword123",
  "name": "New Admin"
}
```

---

## 🛠️ Services Management

### Get All Services
**GET** `/services`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Digital Marketing",
    "description": "Comprehensive digital marketing solutions",
    "icon": "marketing-icon",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Service by ID
**GET** `/services/{id}`

### Create Service
**POST** `/services`

**Request Body:**
```json
{
  "title": "New Service",
  "description": "Service description",
  "icon": "service-icon",
  "isActive": true
}
```

### Update Service
**PATCH** `/services/{id}`

**Request Body:**
```json
{
  "title": "Updated Service",
  "description": "Updated description",
  "isActive": false
}
```

### Delete Service
**DELETE** `/services/{id}`

**Frontend Implementation:**
```javascript
// Get all services
const getServices = async () => {
  const response = await fetch(`${API_BASE_URL}/services`);
  return await response.json();
};

// Create service
const createService = async (serviceData) => {
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(serviceData)
  });
  return await response.json();
};
```

---

## 📦 Packages Management

### Get All Packages
**GET** `/packages`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Basic Package",
    "description": "Basic service package",
    "price": 1000,
    "duration": "1 month",
    "features": ["Feature 1", "Feature 2"],
    "serviceId": "service-uuid",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Package by ID
**GET** `/packages/{id}`

### Create Package
**POST** `/packages`

**Request Body:**
```json
{
  "name": "Premium Package",
  "description": "Premium service package",
  "price": 2000,
  "duration": "3 months",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "serviceId": "service-uuid",
  "isActive": true
}
```

### Update Package
**PATCH** `/packages/{id}`

### Delete Package
**DELETE** `/packages/{id}`

---

## 🛍️ Products Management

### Get All Products
**GET** `/products`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 500,
    "category": "Electronics",
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Product by ID
**GET** `/products/{id}`

### Create Product
**POST** `/products`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 750,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

### Update Product
**PATCH** `/products/{id}`

### Delete Product
**DELETE** `/products/{id}`

---

## 📰 News Management

### Get All News
**GET** `/news`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "News Title",
    "content": "News content...",
    "excerpt": "Short description",
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get News by ID
**GET** `/news/{id}`

### Create News
**POST** `/news`

**Request Body:**
```json
{
  "title": "Breaking News",
  "content": "Full news content...",
  "excerpt": "Short description",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

### Update News
**PATCH** `/news/{id}`

### Delete News
**DELETE** `/news/{id}`

---

## 📞 Contact Management

### Get All Contacts
**GET** `/contact`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "Contact message",
    "isRead": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Contact by ID
**GET** `/contact/{id}`

### Create Contact
**POST** `/contact`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+0987654321",
  "message": "Hello, I need help with..."
}
```

### Update Contact (Mark as Read)
**PATCH** `/contact/{id}`

**Request Body:**
```json
{
  "isRead": true
}
```

### Delete Contact
**DELETE** `/contact/{id}`

---

## 🖼️ Media Management

### Get All Media
**GET** `/media`

**Response:**
```json
[
  {
    "id": "uuid",
    "filename": "image.jpg",
    "originalName": "photo.jpg",
    "mimeType": "image/jpeg",
    "size": 1024000,
    "path": "uploads/image.jpg",
    "type": "image",
    "fileUrl": "https://web-production-194a.up.railway.app/uploads/image.jpg",
    "cloudinaryId": null,
    "cloudinaryUrl": null,
    "category": "product",
    "isActive": true,
    "productId": null,
    "newsId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Media by ID
**GET** `/media/{id}`

### Upload Media
**POST** `/media/upload`

**Request Body:** `multipart/form-data`
```
file: [File object]
category: "product" | "news" | "service" | "general"
```

**Response:**
```json
{
  "id": "uuid",
  "filename": "file-1234567890.jpg",
  "originalName": "photo.jpg",
  "mimeType": "image/jpeg",
  "size": 1024000,
  "path": "uploads/file-1234567890.jpg",
  "type": "image",
  "fileUrl": "https://web-production-194a.up.railway.app/uploads/file-1234567890.jpg",
  "category": "product",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Serve Media File
**GET** `/media/file/{id}`

### Update Media
**PATCH** `/media/{id}`

**Request Body:**
```json
{
  "category": "news",
  "isActive": false,
  "productId": "product-uuid",
  "newsId": "news-uuid"
}
```

### Delete Media
**DELETE** `/media/{id}`

**Frontend Implementation:**
```javascript
// Upload file
const uploadFile = async (file, category = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  
  const response = await fetch(`${API_BASE_URL}/media/upload`, {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};

// Get file URL
const getFileUrl = (mediaId) => {
  return `${API_BASE_URL}/media/file/${mediaId}`;
};
```

---

## ❤️ Health Check

### Check API Status
**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### Frontend Error Handling:
```javascript
const handleApiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

---

## 🌐 CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)
- `https://unitrux.com` (production domain)

---

## 🔧 Frontend Setup Example

### Environment Configuration
```javascript
// config/api.js
export const API_CONFIG = {
  BASE_URL: 'https://web-production-194a.up.railway.app/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register'
    },
    SERVICES: '/services',
    PACKAGES: '/packages',
    PRODUCTS: '/products',
    NEWS: '/news',
    CONTACT: '/contact',
    MEDIA: '/media',
    HEALTH: '/health'
  }
};
```

### API Service Class
```javascript
// services/apiService.js
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return await response.json();
  }
  
  // Auth methods
  async login(email, password) {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
  
  // CRUD methods
  async get(endpoint) {
    return this.request(endpoint);
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
  
  // File upload
  async uploadFile(file, category = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    return this.request(`${API_CONFIG.ENDPOINTS.MEDIA}/upload`, {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: formData
    });
  }
}

export default new ApiService();
```

---

## 📚 Additional Resources

- **Swagger Documentation**: `https://web-production-194a.up.railway.app/api/docs`
- **Health Check**: `https://web-production-194a.up.railway.app/api/health`

---

## 🚀 Quick Start for Frontend

1. **Set up environment variables**:
   ```javascript
   const API_BASE_URL = 'https://web-production-194a.up.railway.app/api';
   ```

2. **Implement authentication**:
   ```javascript
   const token = localStorage.getItem('token');
   const headers = {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   };
   ```

3. **Handle file uploads**:
   ```javascript
   const formData = new FormData();
   formData.append('file', file);
   // Don't set Content-Type header for FormData
   ```

4. **Test API connection**:
   ```javascript
   fetch(`${API_BASE_URL}/health`)
     .then(response => response.json())
     .then(data => console.log('API Status:', data));
   ```

---

**Note**: All timestamps are in ISO 8601 format. All IDs are UUIDs. Make sure to handle authentication tokens properly and implement proper error handling in your frontend application.

