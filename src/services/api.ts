import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from '../config/env';
import { 
  LoginRequest, 
  LoginResponse, 
  Service, 
  CreateServiceRequest,
  Package,
  CreatePackageRequest,
  Product,
  CreateProductRequest,
  News,
  CreateNewsRequest,
  Contact,
  CreateContactRequest,
  Media,
  UploadFileRequest,
  ApiError
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: { email: string; password: string; name: string }): Promise<any> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    const response: AxiosResponse<Service[]> = await this.api.get('/services');
    return response.data;
  }

  async getService(id: string): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.get(`/services/${id}`);
    return response.data;
  }

  async createService(serviceData: CreateServiceRequest): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.post('/services', serviceData);
    return response.data;
  }

  async updateService(id: string, serviceData: Partial<CreateServiceRequest>): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.patch(`/services/${id}`, serviceData);
    return response.data;
  }

  async deleteService(id: string): Promise<void> {
    await this.api.delete(`/services/${id}`);
  }

  // Package methods
  async getPackages(serviceId?: string): Promise<Package[]> {
    const url = serviceId ? `/packages?serviceId=${serviceId}` : '/packages';
    const response: AxiosResponse<Package[]> = await this.api.get(url);
    return response.data;
  }

  async getPackage(id: string): Promise<Package> {
    const response: AxiosResponse<Package> = await this.api.get(`/packages/${id}`);
    return response.data;
  }

  async createPackage(packageData: CreatePackageRequest): Promise<Package> {
    const response: AxiosResponse<Package> = await this.api.post('/packages', packageData);
    return response.data;
  }

  async updatePackage(id: string, packageData: Partial<CreatePackageRequest>): Promise<Package> {
    const response: AxiosResponse<Package> = await this.api.patch(`/packages/${id}`, packageData);
    return response.data;
  }

  async deletePackage(id: string): Promise<void> {
    await this.api.delete(`/packages/${id}`);
  }

  // Product methods
  async getProducts(category?: string, isActive?: boolean): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    
    const url = params.toString() ? `/products?${params.toString()}` : '/products';
    const response: AxiosResponse<Product[]> = await this.api.get(url);
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.patch(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // News methods
  async getNews(category?: string, isPublished?: boolean, isFeatured?: boolean): Promise<News[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (isPublished !== undefined) params.append('isPublished', isPublished.toString());
    if (isFeatured !== undefined) params.append('isFeatured', isFeatured.toString());
    
    const url = params.toString() ? `/news?${params.toString()}` : '/news';
    const response: AxiosResponse<News[]> = await this.api.get(url);
    return response.data;
  }

  async getNewsItem(id: string): Promise<News> {
    const response: AxiosResponse<News> = await this.api.get(`/news/${id}`);
    return response.data;
  }

  async createNews(newsData: CreateNewsRequest): Promise<News> {
    const response: AxiosResponse<News> = await this.api.post('/news', newsData);
    return response.data;
  }

  async updateNews(id: string, newsData: Partial<CreateNewsRequest>): Promise<News> {
    const response: AxiosResponse<News> = await this.api.patch(`/news/${id}`, newsData);
    return response.data;
  }

  async deleteNews(id: string): Promise<void> {
    await this.api.delete(`/news/${id}`);
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    const response: AxiosResponse<Contact[]> = await this.api.get('/contact');
    return response.data;
  }

  async getContact(id: string): Promise<Contact> {
    const response: AxiosResponse<Contact> = await this.api.get(`/contact/${id}`);
    return response.data;
  }

  async createContact(contactData: CreateContactRequest): Promise<Contact> {
    const response: AxiosResponse<Contact> = await this.api.post('/contact', contactData);
    return response.data;
  }

  async updateContact(id: string, contactData: Partial<Contact>): Promise<Contact> {
    const response: AxiosResponse<Contact> = await this.api.patch(`/contact/${id}`, contactData);
    return response.data;
  }

  async deleteContact(id: string): Promise<void> {
    await this.api.delete(`/contact/${id}`);
  }

  async markContactAsRead(id: string): Promise<Contact> {
    const response: AxiosResponse<Contact> = await this.api.patch(`/contact/${id}`, { isRead: true });
    return response.data;
  }

  async markContactAsReplied(id: string, replyMessage: string): Promise<Contact> {
    const response: AxiosResponse<Contact> = await this.api.patch(`/contact/${id}`, { 
      isReplied: true, 
      replyMessage 
    });
    return response.data;
  }

  // Media methods
  async getMedia(category?: string): Promise<Media[]> {
    const url = category ? `/media?category=${category}` : '/media';
    const response: AxiosResponse<Media[]> = await this.api.get(url);
    return response.data;
  }

  async getMediaItem(id: string): Promise<Media> {
    const response: AxiosResponse<Media> = await this.api.get(`/media/${id}`);
    return response.data;
  }

  async uploadFile(file: File, category: string, productId?: string, newsId?: string): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (productId) formData.append('productId', productId);
    if (newsId) formData.append('newsId', newsId);

    const response: AxiosResponse<Media> = await this.api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateMedia(id: string, mediaData: Partial<Media>): Promise<Media> {
    const response: AxiosResponse<Media> = await this.api.patch(`/media/${id}`, mediaData);
    return response.data;
  }

  async deleteMedia(id: string): Promise<void> {
    await this.api.delete(`/media/${id}`);
  }

  getFileUrl(mediaId: string): string {
    return `${this.api.defaults.baseURL}/media/file/${mediaId}`;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export default new ApiService();
