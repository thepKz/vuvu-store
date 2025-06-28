import axios from 'axios';

// Collections API Configuration
const COLLECTIONS_API_BASE = process.env.REACT_APP_COLLECTIONS_API || 'https://api.dudustore.com/collections';

// Create Axios instance for collections
const collectionsAPI = axios.create({
  baseURL: COLLECTIONS_API_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
collectionsAPI.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
collectionsAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle collection errors
    if (error.response?.status === 404) {
      console.warn('Collection not found');
    }
    return Promise.reject(error);
  }
);

// Collections Services
export const collectionsServices = {
  // Get all collections
  getAllCollections: async () => {
    try {
      const response = await collectionsAPI.get('/');
      return response.data;
    } catch (error) {
      return mockCollections();
    }
  },

  // Get collection by ID
  getCollectionById: async (id) => {
    try {
      const response = await collectionsAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      return mockCollectionById(id);
    }
  },

  // Get products in collection
  getCollectionProducts: async (collectionId, filters = {}) => {
    try {
      const response = await collectionsAPI.get(`/${collectionId}/products`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      return mockCollectionProducts(collectionId, filters);
    }
  },

  // Add product to collection
  addProductToCollection: async (collectionId, productId) => {
    try {
      const response = await collectionsAPI.post(`/${collectionId}/products`, {
        productId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add product to collection:', error);
      throw error;
    }
  },

  // Remove product from collection
  removeProductFromCollection: async (collectionId, productId) => {
    try {
      const response = await collectionsAPI.delete(`/${collectionId}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove product from collection:', error);
      throw error;
    }
  },

  // Create new collection
  createCollection: async (collectionData) => {
    try {
      const response = await collectionsAPI.post('/', collectionData);
      return response.data;
    } catch (error) {
      console.error('Failed to create collection:', error);
      throw error;
    }
  },

  // Update collection
  updateCollection: async (collectionId, collectionData) => {
    try {
      const response = await collectionsAPI.put(`/${collectionId}`, collectionData);
      return response.data;
    } catch (error) {
      console.error('Failed to update collection:', error);
      throw error;
    }
  },

  // Delete collection
  deleteCollection: async (collectionId) => {
    try {
      // Check if collection has products
      const products = await collectionsServices.getCollectionProducts(collectionId);
      
      if (products.length > 0) {
        const confirmDelete = window.confirm(
          `Bộ sưu tập này có ${products.length} sản phẩm. Bạn có chắc chắn muốn xóa không? Các sản phẩm sẽ được chuyển về danh mục chung.`
        );
        
        if (!confirmDelete) {
          return { cancelled: true };
        }
      }

      const response = await collectionsAPI.delete(`/${collectionId}`);
      
      // Show success notification
      window.dispatchEvent(new CustomEvent('collection-deleted', {
        detail: { 
          message: `Đã xóa bộ sưu tập thành công. ${products.length} sản phẩm đã được chuyển về danh mục chung.`,
          collectionId 
        }
      }));
      
      return response.data;
    } catch (error) {
      console.error('Failed to delete collection:', error);
      throw error;
    }
  },

  // Validate collection before product deletion
  validateProductDeletion: async (productId) => {
    try {
      const response = await collectionsAPI.get(`/validate-product-deletion/${productId}`);
      return response.data;
    } catch (error) {
      return mockValidateProductDeletion(productId);
    }
  }
};

// Mock data for development
const mockCollections = () => {
  return [
    {
      id: 'premium',
      name: 'Premium Collection',
      description: 'Bộ sưu tập cao cấp với chất liệu và thiết kế đặc biệt',
      image: '/images/lubu1.jpg',
      productCount: 8,
      priceRange: '500.000đ - 2.000.000đ',
      color: '#ec4899',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'limited',
      name: 'Limited Edition',
      description: 'Phiên bản giới hạn chỉ có tại Dudu Store',
      image: '/images/lubu2.jpg',
      productCount: 6,
      priceRange: '300.000đ - 1.500.000đ',
      color: '#f59e0b',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Collection',
      description: 'Bộ sưu tập theo mùa với thiết kế thời thượng',
      image: '/images/lubu3.jpg',
      productCount: 12,
      priceRange: '200.000đ - 800.000đ',
      color: '#10b981',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-22'
    }
  ];
};

const mockCollectionById = (id) => {
  const collections = mockCollections();
  return collections.find(collection => collection.id === id) || null;
};

const mockCollectionProducts = (collectionId, filters) => {
  const allProducts = [
    { id: 1, name: 'DIMOO Premium Gold', price: '850.000đ', image: '/images/lubu1.jpg', collectionId: 'premium' },
    { id: 2, name: 'MOLLY Premium Silver', price: '750.000đ', image: '/images/lubu2.jpg', collectionId: 'premium' },
    { id: 3, name: 'LABUBU Limited 2024', price: '650.000đ', image: '/images/lubu3.jpg', collectionId: 'limited' },
    { id: 4, name: 'DIMOO Limited Spring', price: '550.000đ', image: '/images/lubu4.jpg', collectionId: 'limited' },
    { id: 5, name: 'Summer Vibes MOLLY', price: '450.000đ', image: '/images/lubu1.jpg', collectionId: 'seasonal' },
    { id: 6, name: 'Spring Bloom DIMOO', price: '380.000đ', image: '/images/lubu2.jpg', collectionId: 'seasonal' }
  ];

  return allProducts.filter(product => product.collectionId === collectionId);
};

const mockValidateProductDeletion = (productId) => {
  // Mock validation - check which collections contain this product
  const affectedCollections = [
    { id: 'premium', name: 'Premium Collection', productCount: 8 },
    { id: 'limited', name: 'Limited Edition', productCount: 6 }
  ];

  return {
    canDelete: true,
    affectedCollections,
    warnings: [
      'Sản phẩm này thuộc 2 bộ sưu tập',
      'Xóa sản phẩm sẽ cập nhật số lượng trong các bộ sưu tập'
    ]
  };
};

export default collectionsAPI;