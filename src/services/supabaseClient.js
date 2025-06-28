import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = 'https://wuntakkwdwblabwaalhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bnRha2t3ZHdibGFid2FhbGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzM0MTYsImV4cCI6MjA2NjcwOTQxNn0.r726cWWKX3dJGiWoTI7uZ7MoiivhvfJFep_5PTnt-FA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hàm truy vấn sản phẩm
export const getProducts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    category = null,
    collection = null,
    search = null,
    sortBy = 'created_at',
    sortOrder = 'desc',
    featured = null,
    isNew = null,
    isSale = null
  } = options;

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name)
    `);

  // Áp dụng các bộ lọc
  if (category) {
    query = query.eq('category_id', category);
  }

  if (collection) {
    query = query.in('id', supabase
      .from('product_collection')
      .select('product_id')
      .eq('collection_id', collection)
    );
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (featured !== null) {
    query = query.eq('is_featured', featured);
  }

  if (isNew !== null) {
    query = query.eq('is_new', isNew);
  }

  if (isSale !== null) {
    query = query.eq('is_sale', isSale);
  }

  // Áp dụng sắp xếp
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Áp dụng phân trang
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  // Thực hiện truy vấn
  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return { data, count };
};

// Hàm lấy chi tiết sản phẩm
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

  // Theo dõi lượt xem sản phẩm
  await trackProductView(id);

  return data;
};

// Hàm theo dõi lượt xem sản phẩm
export const trackProductView = async (productId, userId = null) => {
  try {
    const { error } = await supabase
      .from('product_views')
      .insert([
        {
          product_id: productId,
          user_id: userId,
          ip_address: '127.0.0.1' // Trong thực tế, lấy IP thật của người dùng
        }
      ]);

    if (error) {
      console.error('Error tracking product view:', error);
    }
  } catch (error) {
    console.error('Error tracking product view:', error);
  }
};

// Hàm lấy thống kê lượt xem sản phẩm
export const getProductViewStats = async (options = {}) => {
  const {
    period = 'week',
    productId = null
  } = options;

  let timeFilter;
  switch (period) {
    case 'day':
      timeFilter = 'created_at > now() - interval \'1 day\'';
      break;
    case 'month':
      timeFilter = 'created_at > now() - interval \'30 days\'';
      break;
    case 'year':
      timeFilter = 'created_at > now() - interval \'365 days\'';
      break;
    default: // week
      timeFilter = 'created_at > now() - interval \'7 days\'';
  }

  let query;
  
  if (productId) {
    // Lấy thông kê cho sản phẩm cụ thể
    query = supabase
      .from('product_views')
      .select('created_at')
      .eq('product_id', productId)
      .filter('created_at', 'gte', new Date(Date.now() - getPeriodInMs(period)).toISOString());
  } else {
    // Lấy thống kê tổng quan
    query = supabase
      .from('product_view_analytics')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(10);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching product view stats:', error);
    throw error;
  }

  return data;
};

// Hàm lấy thống kê doanh thu
export const getSalesStats = async (options = {}) => {
  const {
    period = 'week'
  } = options;

  // Trong thực tế, đây sẽ là truy vấn SQL phức tạp hơn
  const { data, error } = await supabase
    .rpc('get_sales_stats', { period_param: period });

  if (error) {
    console.error('Error fetching sales stats:', error);
    throw error;
  }

  return data;
};

// Hàm lấy thông tin dashboard
export const getDashboardStats = async () => {
  // Trong thực tế, đây sẽ là truy vấn SQL phức tạp hơn
  const { data, error } = await supabase
    .rpc('get_dashboard_stats');

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }

  return data;
};

// Hàm hỗ trợ chuyển đổi khoảng thời gian thành milliseconds
function getPeriodInMs(period) {
  switch (period) {
    case 'day':
      return 24 * 60 * 60 * 1000;
    case 'month':
      return 30 * 24 * 60 * 60 * 1000;
    case 'year':
      return 365 * 24 * 60 * 60 * 1000;
    default: // week
      return 7 * 24 * 60 * 60 * 1000;
  }
}

export default supabase;