# 🎨 Frontend Integration Guide

## 🚀 **Quick Start**

### **1. Cài đặt dependencies**
```bash
npm install axios
# hoặc
yarn add axios
```

### **2. Tạo API service**
```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📁 **File Upload & Management**

### **1. Upload File Component (React)**
```jsx
import React, { useState } from 'react';
import api from '../services/api';

const FileUpload = ({ onUploadSuccess, category = 'general' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Upload successful:', response.data);
      onUploadSuccess?.(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={handleFileUpload}
        accept="image/*,video/*,.pdf,.doc,.docx"
        disabled={uploading}
      />
      {uploading && (
        <div className="progress">
          <div 
            className="progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          />
          <span>{uploadProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
```

### **2. File Gallery Component**
```jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FileGallery = ({ category = null }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [category]);

  const fetchFiles = async () => {
    try {
      const url = category ? `/media?category=${category}` : '/media';
      const response = await api.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await api.delete(`/media/${fileId}`);
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="file-gallery">
      {files.map((file) => (
        <div key={file.id} className="file-item">
          {file.type === 'image' && (
            <img 
              src={file.fileUrl} 
              alt={file.originalName}
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
          )}
          {file.type === 'video' && (
            <video 
              src={file.fileUrl} 
              controls
              style={{ width: '200px', height: '200px' }}
            />
          )}
          <div className="file-info">
            <p>{file.originalName}</p>
            <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {file.type}</p>
            <button onClick={() => deleteFile(file.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGallery;
```

---

## 🛍️ **Product Management**

### **1. Product List Component**
```jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await api.post('/products', productData);
      setProducts([...products, response.data]);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      setProducts(products.map(p => p.id === id ? response.data : p));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          )}
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price} {product.priceType}</p>
          <p>Category: {product.category}</p>
          {product.features && (
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          )}
          <div className="actions">
            <button onClick={() => updateProduct(product.id, { isActive: !product.isActive })}>
              {product.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => deleteProduct(product.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
```

---

## 📰 **News Management**

### **1. News List Component**
```jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    isPublished: null,
    isFeatured: null
  });

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.isPublished !== null) params.append('isPublished', filters.isPublished);
      if (filters.isFeatured !== null) params.append('isFeatured', filters.isFeatured);

      const response = await api.get(`/news?${params.toString()}`);
      setNews(response.data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData) => {
    try {
      const response = await api.post('/news', newsData);
      setNews([...news, response.data]);
    } catch (error) {
      console.error('Failed to create news:', error);
    }
  };

  const updateNews = async (id, newsData) => {
    try {
      const response = await api.patch(`/news/${id}`, newsData);
      setNews(news.map(n => n.id === id ? response.data : n));
    } catch (error) {
      console.error('Failed to update news:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="news-list">
      <div className="filters">
        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="news">News</option>
        </select>
        
        <select 
          value={filters.isPublished} 
          onChange={(e) => setFilters({...filters, isPublished: e.target.value === '' ? null : e.target.value === 'true'})}
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {news.map((article) => (
        <div key={article.id} className="news-card">
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          )}
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
          <p>Author: {article.author}</p>
          <p>Category: {article.category}</p>
          <p>Views: {article.viewCount}</p>
          <div className="status">
            <span className={article.isPublished ? 'published' : 'draft'}>
              {article.isPublished ? 'Published' : 'Draft'}
            </span>
            {article.isFeatured && <span className="featured">Featured</span>}
          </div>
          <div className="actions">
            <button onClick={() => updateNews(article.id, { isPublished: !article.isPublished })}>
              {article.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button onClick={() => updateNews(article.id, { isFeatured: !article.isFeatured })}>
              {article.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
```

---

## 🔐 **Authentication**

### **1. Auth Context (React)**
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user info
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/me'); // You might need to create this endpoint
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('authToken', access_token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await api.post('/auth/signup', { email, password, name });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **2. Login Component**
```jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
```

---

## 📞 **Contact Form**

### **1. Contact Form Component**
```jsx
import React, { useState } from 'react';
import api from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contacts', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="success-message">
        <h3>Thank you for your message!</h3>
        <p>We will get back to you soon.</p>
        <button onClick={() => setSuccess(false)}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Contact Us</h2>
      
      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
```

---

## 🎨 **CSS Examples**

### **1. File Gallery Styles**
```css
.file-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.file-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.file-item img,
.file-item video {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.file-info {
  padding: 15px;
}

.file-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.file-info button {
  background: #ff4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.file-info button:hover {
  background: #cc0000;
}
```

### **2. Upload Progress Styles**
```css
.file-upload {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
}

.file-upload:hover {
  border-color: #007bff;
}

.progress {
  margin-top: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 20px;
  background: #007bff;
  transition: width 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}
```

---

## 🔧 **Utility Functions**

### **1. File Type Detection**
```javascript
export const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (mimeType) => {
  return mimeType.startsWith('image/');
};

export const isVideoFile = (mimeType) => {
  return mimeType.startsWith('video/');
};
```

### **2. API Error Handling**
```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};
```

---

## 📱 **Mobile Responsive**

### **1. Responsive Grid**
```css
.file-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 15px;
}

@media (max-width: 768px) {
  .file-gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .file-gallery {
    grid-template-columns: 1fr;
  }
}
```

---

## 🚀 **Deployment Notes**

1. **CORS**: Backend đã được cấu hình CORS cho frontend
2. **File URLs**: Sử dụng `fileUrl` từ API response để hiển thị files
3. **Authentication**: Lưu JWT token trong localStorage
4. **Error Handling**: Luôn handle errors từ API calls
5. **Loading States**: Hiển thị loading states cho better UX

---

## 📞 **Support**

Nếu có vấn đề gì, hãy kiểm tra:
1. **Network tab** trong DevTools để xem API calls
2. **Console** để xem error messages
3. **Backend logs** để debug server-side issues
4. **Swagger UI** để test API endpoints
