import axios from 'axios';

// API Base Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add loading state
    if (config.showLoading !== false) {
      // Dispatch loading start action
      window.dispatchEvent(new CustomEvent('api-loading-start'));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Remove loading state
    window.dispatchEvent(new CustomEvent('api-loading-end'));
    return response;
  },
  (error) => {
    // Remove loading state
    window.dispatchEvent(new CustomEvent('api-loading-end'));
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 500) {
      // Server error - show notification
      window.dispatchEvent(new CustomEvent('api-error', {
        detail: 'Có lỗi xảy ra từ server. Vui lòng thử lại sau.'
      }));
    }
    
    return Promise.reject(error);
  }
);

// API Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
};

export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query, filters = {}) => api.post('/products/search', { query, filters }),
  getCategories: () => api.get('/products/categories'),
  getFeatured: () => api.get('/products/featured'),
  getRelated: (id) => api.get(`/products/${id}/related`),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getFavorites: () => api.get('/user/favorites'),
  addFavorite: (productId) => api.post(`/user/favorites/${productId}`),
  removeFavorite: (productId) => api.delete(`/user/favorites/${productId}`),
  getRecentlyViewed: () => api.get('/user/recently-viewed'),
  addRecentlyViewed: (productId) => api.post(`/user/recently-viewed/${productId}`),
};

export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const contactAPI = {
  sendMessage: (data) => api.post('/contact/message', data),
  subscribe: (email) => api.post('/contact/subscribe', { email }),
};

export default api;