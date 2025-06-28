import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://wuntakkwdwblabwaalhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bnRha2t3ZHdibGFid2FhbGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzM0MTYsImV4cCI6MjA2NjcwOTQxNn0.r726cWWKX3dJGiWoTI7uZ7MoiivhvfJFep_5PTnt-FA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get all products from Supabase
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Products array
 */
export const getProducts = async (options = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    collection, 
    search, 
    sortBy, 
    sortOrder = 'desc' 
  } = options;

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      variants:product_variants(*)
    `);

  // Apply filters
  if (category) {
    query = query.eq('category_id', category);
  }

  if (collection) {
    query = query.in('id', 
      supabase
        .from('product_collection')
        .select('product_id')
        .eq('collection_id', collection)
    );
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply sorting
  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return { 
    products: data || [], 
    count 
  };
};

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product object
 */
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      variants:product_variants(*),
      collections:product_collection(collection:collections(*))
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  return data;
};

/**
 * Track product view
 * @param {string} productId - Product ID
 * @param {string|null} userId - User ID (if authenticated)
 * @returns {Promise<void>}
 */
export const trackProductView = async (productId, userId = null) => {
  try {
    // Insert view record
    const { error: viewError } = await supabase
      .from('product_views')
      .insert([
        { 
          product_id: productId, 
          user_id: userId,
          ip_address: 'client-side' // In a real app, you'd get this from the server
        }
      ]);

    if (viewError) throw viewError;

    // Increment view count on product
    const { error: updateError } = await supabase.rpc('increment_view_count', {
      product_id: productId
    });

    if (updateError) throw updateError;

  } catch (error) {
    console.error('Error tracking product view:', error);
    // Don't throw here to prevent breaking the user experience
  }
};

/**
 * Get categories
 * @returns {Promise<Array>} - Categories array
 */
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get collections
 * @returns {Promise<Array>} - Collections array
 */
export const getCollections = async () => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get products by collection
 * @param {string} collectionId - Collection ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Products array
 */
export const getProductsByCollection = async (collectionId, options = {}) => {
  const { page = 1, limit = 10 } = options;
  
  // First get product IDs in this collection
  const { data: productIds, error: collectionError } = await supabase
    .from('product_collection')
    .select('product_id')
    .eq('collection_id', collectionId);
    
  if (collectionError) {
    console.error('Error fetching collection products:', collectionError);
    throw collectionError;
  }
  
  if (!productIds || productIds.length === 0) {
    return { products: [], count: 0 };
  }
  
  // Then fetch the actual products
  const ids = productIds.map(item => item.product_id);
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      variants:product_variants(*)
    `, { count: 'exact' })
    .in('id', ids)
    .range(from, to);
    
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return { 
    products: data || [], 
    count 
  };
};

/**
 * Authentication functions
 */

/**
 * Sign up a new user
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} - User object
 */
export const signUp = async (credentials) => {
  const { email, password, ...userData } = credentials;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }
  
  return data;
};

/**
 * Sign in a user
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} - Session object
 */
export const signIn = async (credentials) => {
  const { email, password } = credentials;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
  
  return data;
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get the current user
 * @returns {Promise<Object>} - User object
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
  
  return data?.user || null;
};

/**
 * Get analytics data
 * @param {string} period - Time period (day, week, month, year)
 * @returns {Promise<Object>} - Analytics data
 */
export const getAnalytics = async (period = 'week') => {
  // Get product views
  const { data: viewsData, error: viewsError } = await supabase
    .from('product_views')
    .select(`
      product_id,
      created_at,
      products(name)
    `)
    .gte('created_at', getDateForPeriod(period));
    
  if (viewsError) {
    console.error('Error fetching view analytics:', viewsError);
    throw viewsError;
  }
  
  // Process the data
  const productViews = {};
  viewsData.forEach(view => {
    const productId = view.product_id;
    if (!productViews[productId]) {
      productViews[productId] = {
        id: productId,
        name: view.products?.name || 'Unknown Product',
        views: 0
      };
    }
    productViews[productId].views++;
  });
  
  return {
    productViews: Object.values(productViews).sort((a, b) => b.views - a.views),
    totalViews: viewsData.length,
    period
  };
};

/**
 * Helper function to get date for period
 * @param {string} period - Time period
 * @returns {string} - ISO date string
 */
function getDateForPeriod(period) {
  const date = new Date();
  
  switch (period) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setDate(date.getDate() - 7); // Default to week
  }
  
  return date.toISOString();
}