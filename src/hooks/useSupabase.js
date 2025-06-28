import { useState, useEffect, useCallback } from 'react';
import { supabase, getProducts, getProductById, trackProductView } from '../services/supabaseClient';

/**
 * Hook for fetching products from Supabase
 * @param {Object} initialOptions - Initial query options
 * @returns {Object} - Products data and functions
 */
export const useProducts = (initialOptions = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [options, setOptions] = useState(initialOptions);

  const fetchProducts = useCallback(async (queryOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedOptions = { ...options, ...queryOptions };
      const { products: data, count } = await getProducts(mergedOptions);
      
      setProducts(data);
      setTotalCount(count);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateOptions = useCallback((newOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    products,
    loading,
    error,
    totalCount,
    options,
    fetchProducts,
    updateOptions
  };
};

/**
 * Hook for fetching a single product from Supabase
 * @param {string} productId - Product ID
 * @returns {Object} - Product data and functions
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (id = productId) => {
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProductById(id);
      setProduct(data);
      
      // Track product view
      trackProductView(id);
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    fetchProduct
  };
};

/**
 * Hook for authentication with Supabase
 * @returns {Object} - Auth state and functions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (signUpError) throw signUpError;
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
};

/**
 * Hook for real-time subscriptions
 * @param {string} table - Table name
 * @param {Function} callback - Callback function
 * @param {Object} filters - Query filters
 * @returns {Object} - Subscription state
 */
export const useRealtime = (table, callback, filters = {}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      try {
        let query = supabase
          .channel('table-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table
          }, (payload) => {
            callback(payload);
          });

        subscription = query.subscribe();
        setIsSubscribed(true);
      } catch (err) {
        setError(err.message);
        setIsSubscribed(false);
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, callback, filters]);

  return { isSubscribed, error };
};

/**
 * Hook for analytics data
 * @param {string} period - Time period (day, week, month, year)
 * @returns {Object} - Analytics data and functions
 */
export const useAnalytics = (period = 'week') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (selectedPeriod = period) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get date range based on period
      const startDate = new Date();
      switch (selectedPeriod) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }
      
      // Get product views
      const { data: viewsData, error: viewsError } = await supabase
        .from('product_views')
        .select(`
          id,
          product_id,
          created_at,
          products(name, image)
        `)
        .gte('created_at', startDate.toISOString());
        
      if (viewsError) throw viewsError;
      
      // Process the data
      const productViews = {};
      const dailyViews = {};
      
      viewsData.forEach(view => {
        const productId = view.product_id;
        const date = new Date(view.created_at).toISOString().split('T')[0];
        
        // Count by product
        if (!productViews[productId]) {
          productViews[productId] = {
            id: productId,
            name: view.products?.name || 'Unknown Product',
            image: view.products?.image || null,
            views: 0
          };
        }
        productViews[productId].views++;
        
        // Count by day
        if (!dailyViews[date]) {
          dailyViews[date] = 0;
        }
        dailyViews[date]++;
      });
      
      const analyticsData = {
        productViews: Object.values(productViews).sort((a, b) => b.views - a.views),
        dailyViews: Object.entries(dailyViews).map(([date, count]) => ({ date, count })),
        totalViews: viewsData.length,
        period: selectedPeriod
      };
      
      setData(analyticsData);
      return analyticsData;
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      return null;
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    fetchAnalytics
  };
};