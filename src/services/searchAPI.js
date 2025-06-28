import axios from 'axios';

// Search API Configuration
const SEARCH_API_BASE = process.env.REACT_APP_SEARCH_API || 'https://api.dudustore.com/search';

// Create Axios instance for search
const searchAPI = axios.create({
  baseURL: SEARCH_API_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
searchAPI.interceptors.request.use(
  (config) => {
    // Add search tracking
    config.headers['X-Search-Session'] = Date.now();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
searchAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle search errors gracefully
    if (error.response?.status === 429) {
      // Rate limiting
      console.warn('Search rate limit exceeded');
    }
    return Promise.reject(error);
  }
);

// Search Services
export const searchServices = {
  // Real-time product search
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await searchAPI.post('/products', {
        query: query.trim(),
        filters,
        limit: filters.limit || 10,
        offset: filters.offset || 0
      });
      return response.data;
    } catch (error) {
      // Fallback to mock data for development
      return mockSearchResults(query, filters);
    }
  },

  // Auto-complete suggestions
  getSuggestions: async (query) => {
    try {
      const response = await searchAPI.get('/suggestions', {
        params: { q: query.trim(), limit: 5 }
      });
      return response.data;
    } catch (error) {
      return mockSuggestions(query);
    }
  },

  // Popular searches
  getPopularSearches: async () => {
    try {
      const response = await searchAPI.get('/popular');
      return response.data;
    } catch (error) {
      return mockPopularSearches();
    }
  },

  // Search filters
  getFilters: async () => {
    try {
      const response = await searchAPI.get('/filters');
      return response.data;
    } catch (error) {
      return mockFilters();
    }
  },

  // Track search
  trackSearch: async (query, results) => {
    try {
      await searchAPI.post('/track', {
        query,
        resultsCount: results.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent fail for tracking
      console.log('Search tracking failed:', error.message);
    }
  }
};

// Mock data for development
const mockSearchResults = (query, filters) => {
  const allProducts = [
    {
      id: 1,
      name: "DIMOO Premium Collection",
      description: "Bộ sưu tập cao cấp với thiết kế độc đáo",
      price: "230.000đ",
      image: "/images/lubu1.jpg",
      category: "dimoo",
      rating: 4.9,
      inStock: true
    },
    {
      id: 2,
      name: "MOLLY Limited Edition",
      description: "Phiên bản giới hạn chỉ có tại Dudu Store",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      image: "/images/lubu3.jpg",
      category: "molly",
      rating: 4.7,
      inStock: true
    },
    {
      id: 3,
      name: "LABUBU Special Series",
      description: "Series đặc biệt với màu sắc độc đáo",
      price: "805.000đ",
      image: "/images/lubu5.jpg",
      category: "labubu",
      rating: 4.8,
      inStock: false
    }
  ];

  // Filter by query
  let results = allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    results = results.filter(product => product.category === filters.category);
  }

  if (filters.inStock) {
    results = results.filter(product => product.inStock);
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    results = results.filter(product => {
      const price = parseInt(product.price.replace(/\D/g, ''));
      return price >= min && price <= max;
    });
  }

  return {
    products: results.slice(0, filters.limit || 10),
    total: results.length,
    query,
    filters
  };
};

const mockSuggestions = (query) => {
  const suggestions = [
    "DIMOO Premium",
    "MOLLY Limited",
    "LABUBU Special",
    "Squishy Collection",
    "Premium Squishy"
  ];

  return suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);
};

const mockPopularSearches = () => {
  return [
    "DIMOO",
    "MOLLY",
    "LABUBU",
    "Premium Collection",
    "Limited Edition",
    "Squishy mới",
    "Sale squishy",
    "Quà tặng"
  ];
};

const mockFilters = () => {
  return {
    categories: [
      { id: 'all', name: 'Tất cả', count: 24 },
      { id: 'dimoo', name: 'DIMOO', count: 8 },
      { id: 'molly', name: 'MOLLY', count: 6 },
      { id: 'labubu', name: 'LABUBU', count: 10 }
    ],
    priceRanges: [
      { id: 'under-300k', name: 'Dưới 300.000đ', min: 0, max: 300000 },
      { id: '300k-500k', name: '300.000đ - 500.000đ', min: 300000, max: 500000 },
      { id: '500k-1m', name: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
      { id: 'over-1m', name: 'Trên 1.000.000đ', min: 1000000, max: 999999999 }
    ],
    sortOptions: [
      { id: 'relevance', name: 'Liên quan nhất' },
      { id: 'price-asc', name: 'Giá thấp đến cao' },
      { id: 'price-desc', name: 'Giá cao đến thấp' },
      { id: 'rating', name: 'Đánh giá cao nhất' },
      { id: 'newest', name: 'Mới nhất' }
    ]
  };
};

export default searchAPI;