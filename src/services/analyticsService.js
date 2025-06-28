import supabase from './supabaseClient';

/**
 * Theo dõi lượt xem sản phẩm
 * @param {string} productId - ID sản phẩm
 * @param {string|null} userId - ID người dùng (nếu đã đăng nhập)
 * @param {string} ipAddress - Địa chỉ IP của người xem
 * @returns {Promise<boolean>} - Kết quả theo dõi
 */
export const trackProductView = async (productId, userId = null, ipAddress = '127.0.0.1') => {
  try {
    const { error } = await supabase
      .from('product_views')
      .insert([
        {
          product_id: productId,
          user_id: userId,
          ip_address: ipAddress
        }
      ]);
    
    if (error) {
      console.error('Error tracking product view:', error);
      return false;
    }
    
    // Cập nhật số lượt xem trong bảng products
    const { error: updateError } = await supabase
      .rpc('increment_product_view_count', { product_id_param: productId });
    
    if (updateError) {
      console.error('Error updating product view count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking product view:', error);
    return false;
  }
};

/**
 * Theo dõi hoạt động người dùng
 * @param {string} userId - ID người dùng
 * @param {string} activityType - Loại hoạt động
 * @param {Object} metadata - Dữ liệu bổ sung
 * @returns {Promise<boolean>} - Kết quả theo dõi
 */
export const trackUserActivity = async (userId, activityType, metadata = {}) => {
  try {
    const { error } = await supabase
      .from('user_activity')
      .insert([
        {
          user_id: userId,
          activity_type: activityType,
          metadata
        }
      ]);
    
    if (error) {
      console.error('Error tracking user activity:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return false;
  }
};

/**
 * Theo dõi truy vấn tìm kiếm
 * @param {string} query - Truy vấn tìm kiếm
 * @param {number} resultCount - Số lượng kết quả
 * @param {string|null} userId - ID người dùng (nếu đã đăng nhập)
 * @returns {Promise<boolean>} - Kết quả theo dõi
 */
export const trackSearchQuery = async (query, resultCount, userId = null) => {
  try {
    const { error } = await supabase
      .from('search_queries')
      .insert([
        {
          query,
          result_count: resultCount,
          user_id: userId
        }
      ]);
    
    if (error) {
      console.error('Error tracking search query:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking search query:', error);
    return false;
  }
};

/**
 * Lấy truy vấn tìm kiếm phổ biến
 * @param {number} limit - Số lượng truy vấn trả về
 * @returns {Promise<Array>} - Danh sách truy vấn phổ biến
 */
export const getPopularSearches = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('search_queries')
      .select('query, count(*) as count')
      .filter('created_at', 'gte', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .group('query')
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return [];
  }
};

/**
 * Lấy lịch sử xem sản phẩm của người dùng
 * @param {string} userId - ID người dùng
 * @param {number} limit - Số lượng sản phẩm trả về
 * @returns {Promise<Array>} - Lịch sử xem sản phẩm
 */
export const getUserViewHistory = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('product_views')
      .select(`
        created_at,
        products (
          id,
          name,
          image,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error getting user view history:', error);
      return [];
    }
    
    // Loại bỏ các sản phẩm trùng lặp, chỉ giữ lại lần xem gần nhất
    const uniqueProducts = [];
    const productIds = new Set();
    
    for (const view of data) {
      if (!productIds.has(view.products.id)) {
        productIds.add(view.products.id);
        uniqueProducts.push({
          ...view.products,
          last_viewed_at: view.created_at
        });
      }
    }
    
    return uniqueProducts;
  } catch (error) {
    console.error('Error getting user view history:', error);
    return [];
  }
};

/**
 * Lấy sản phẩm được xem nhiều nhất
 * @param {string} period - Khoảng thời gian ('day', 'week', 'month', 'year')
 * @param {number} limit - Số lượng sản phẩm trả về
 * @returns {Promise<Array>} - Danh sách sản phẩm được xem nhiều nhất
 */
export const getMostViewedProducts = async (period = 'week', limit = 10) => {
  try {
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
    
    const { data, error } = await supabase
      .from('product_view_analytics')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error getting most viewed products:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error getting most viewed products:', error);
    return [];
  }
};

/**
 * Lấy thống kê dashboard
 * @returns {Promise<Object>} - Thống kê dashboard
 */
export const getDashboardStats = async () => {
  try {
    // Trong thực tế, đây sẽ là một stored procedure hoặc function trong database
    // Ở đây chúng ta sẽ thực hiện nhiều truy vấn riêng lẻ
    
    // Lấy thông tin sản phẩm
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('count(*)', { count: 'exact' })
      .select('count(*) filter (where stock > 0)', { count: 'exact', alias: 'in_stock' })
      .select('count(*) filter (where stock = 0)', { count: 'exact', alias: 'out_of_stock' });
    
    if (productsError) {
      console.error('Error getting product stats:', productsError);
      throw productsError;
    }
    
    // Lấy thông tin đơn hàng
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('count(*)', { count: 'exact' })
      .select('count(*) filter (where status = \'pending\')', { count: 'exact', alias: 'pending_orders' })
      .select('count(*) filter (where status = \'processing\')', { count: 'exact', alias: 'processing_orders' })
      .select('count(*) filter (where status = \'shipped\')', { count: 'exact', alias: 'shipped_orders' })
      .select('count(*) filter (where status = \'delivered\')', { count: 'exact', alias: 'delivered_orders' })
      .select('count(*) filter (where status = \'cancelled\')', { count: 'exact', alias: 'cancelled_orders' });
    
    if (ordersError) {
      console.error('Error getting order stats:', ordersError);
      throw ordersError;
    }
    
    // Lấy thông tin người dùng
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' })
      .select('count(*) filter (where created_at > now() - interval \'30 days\')', { count: 'exact', alias: 'new_users' });
    
    if (usersError) {
      console.error('Error getting user stats:', usersError);
      throw usersError;
    }
    
    // Lấy thông tin doanh thu
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('sum(total_amount) as total_revenue')
      .select('sum(total_amount) filter (where created_at > now() - interval \'30 days\') as monthly_revenue')
      .select('sum(total_amount) filter (where created_at > now() - interval \'7 days\') as weekly_revenue')
      .neq('status', 'cancelled');
    
    if (revenueError) {
      console.error('Error getting revenue stats:', revenueError);
      throw revenueError;
    }
    
    // Lấy đơn hàng gần đây
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select(`
        id, 
        user_id, 
        status, 
        total_amount, 
        created_at,
        users (email, first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentOrdersError) {
      console.error('Error getting recent orders:', recentOrdersError);
      throw recentOrdersError;
    }
    
    // Lấy sản phẩm sắp hết hàng
    const { data: lowStock, error: lowStockError } = await supabase
      .from('products')
      .select('id, name, stock, price')
      .gt('stock', 0)
      .lte('stock', 5)
      .order('stock', { ascending: true })
      .limit(5);
    
    if (lowStockError) {
      console.error('Error getting low stock products:', lowStockError);
      throw lowStockError;
    }
    
    return {
      products: productsData[0],
      orders: ordersData[0],
      users: usersData[0],
      revenue: revenueData[0],
      recentOrders,
      lowStock
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

export default {
  trackProductView,
  trackUserActivity,
  trackSearchQuery,
  getPopularSearches,
  getUserViewHistory,
  getMostViewedProducts,
  getDashboardStats
};