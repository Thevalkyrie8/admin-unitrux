// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Package types
export interface Package {
  id: string;
  name: string;
  description: string;
  features: string[];
  badge: string;
  price: number;
  priceType: string;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageRequest {
  name: string;
  description: string;
  features: string[];
  badge?: string;
  price: number;
  priceType: string;
  isPopular?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  serviceId: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  priceType: string;
  features: string[];
  results: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  priceType: string;
  features: string[];
  results: string[];
  isActive?: boolean;
  sortOrder?: number;
}

// News types
export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  replyMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// Media types
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  type: 'image' | 'video' | 'document';
  cloudinaryId?: string;
  cloudinaryUrl?: string;
  category: string;
  isActive: boolean;
  productId?: string;
  newsId?: string;
  url: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFileRequest {
  file: File;
  category: string;
  productId?: string;
  newsId?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error types
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

