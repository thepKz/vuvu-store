import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = 'https://wuntakkwdwblabwaalhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bnRha2t3ZHdibGFid2FhbGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzM0MTYsImV4cCI6MjA2NjcwOTQxNn0.r726cWWKX3dJGiWoTI7uZ7MoiivhvfJFep_5PTnt-FA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lấy danh sách sản phẩm
export const getProducts = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      collection, 
      search, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      featured,
      isNew,
      isSale
    } = options;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*, category:categories(id, name)', { count: 'exact' });

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

    if (featured === true) {
      query = query.eq('is_featured', true);
    }

    if (isNew === true) {
      query = query.eq('is_new', true);
    }

    if (isSale === true) {
      query = query.eq('is_sale', true);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { products: data || [], count };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name),
        variants:product_variants(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Lấy các bộ sưu tập của sản phẩm
    const { data: collections, error: collectionsError } = await supabase
      .from('product_collection')
      .select(`
        collection:collections(*)
      `)
      .eq('product_id', id);

    if (collectionsError) throw collectionsError;

    // Lấy đánh giá của sản phẩm
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(first_name, last_name)
      `)
      .eq('product_id', id)
      .order('created_at', { ascending: false });

    if (reviewsError) throw reviewsError;

    // Ghi nhận lượt xem sản phẩm
    trackProductView(id);

    return {
      ...data,
      collections: collections?.map(item => item.collection) || [],
      reviews: reviews || []
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

// Ghi nhận lượt xem sản phẩm
export const trackProductView = async (productId, userId = null) => {
  try {
    // Ghi nhận lượt xem
    const { error } = await supabase
      .from('product_views')
      .insert([
        {
          product_id: productId,
          user_id: userId,
          ip_address: '127.0.0.1' // Trong thực tế, lấy IP thực của người dùng
        }
      ]);

    if (error) throw error;

    // Tăng số lượt xem trong bảng products
    const { error: updateError } = await supabase
      .rpc('increment_product_view_count', { product_id_param: productId });

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error tracking product view:', error);
    return false;
  }
};

// Lấy danh sách danh mục
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Lấy danh sách bộ sưu tập
export const getCollections = async () => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('name');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
    const { email, password, first_name, last_name, phone, address } = userData;

    // Đăng ký người dùng với Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
          address
        }
      }
    });

    if (authError) throw authError;

    return authData;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Đăng nhập
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Đăng xuất
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const { user_id, items, shipping_address, payment_method, total_amount } = orderData;

    // Bắt đầu transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id,
          shipping_address,
          payment_method,
          total_amount,
          status: 'pending',
          payment_status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Thêm các sản phẩm vào đơn hàng
    for (const item of items) {
      const { product_id, variant_id, quantity, price } = item;

      const { error: itemError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: order.id,
            product_id,
            variant_id,
            quantity,
            price
          }
        ]);

      if (itemError) throw itemError;

      // Cập nhật số lượng tồn kho
      if (variant_id) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .update({ stock: supabase.raw(`stock - ${quantity}`) })
          .eq('id', variant_id);

        if (variantError) throw variantError;
      } else {
        const { error: productError } = await supabase
          .from('products')
          .update({ stock: supabase.raw(`stock - ${quantity}`) })
          .eq('id', product_id);

        if (productError) throw productError;
      }
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng của người dùng
export const getUserOrders = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 10, status } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { orders: data || [], count };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (orderId, userId = null) => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(id, name, image),
          variant:product_variants(id, name, image)
        )
      `)
      .eq('id', orderId);

    // Nếu có userId, chỉ lấy đơn hàng của người dùng đó
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Thêm đánh giá sản phẩm
export const addProductReview = async (reviewData) => {
  try {
    const { product_id, user_id, rating, comment } = reviewData;

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          product_id,
          user_id,
          rating,
          comment,
          is_verified: true // Giả sử đã xác minh
        }
      ])
      .select();

    if (error) throw error;

    // Cập nhật rating trung bình của sản phẩm
    await updateProductRating(product_id);

    return data[0];
  } catch (error) {
    console.error('Error adding product review:', error);
    throw error;
  }
};

// Cập nhật rating trung bình của sản phẩm
const updateProductRating = async (productId) => {
  try {
    // Lấy rating trung bình từ tất cả đánh giá
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) throw error;

    if (data && data.length > 0) {
      const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;

      // Cập nhật rating của sản phẩm
      const { error: updateError } = await supabase
        .from('products')
        .update({ rating: avgRating })
        .eq('id', productId);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Error updating product rating:', error);
    return false;
  }
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Lấy sản phẩm mới
export const getNewProducts = async (limit = 8) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw error;
  }
};

// Lấy sản phẩm đang giảm giá
export const getSaleProducts = async (limit = 8) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .eq('is_sale', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching sale products:', error);
    throw error;
  }
};

// Lấy sản phẩm liên quan
export const getRelatedProducts = async (productId, limit = 4) => {
  try {
    // Lấy thông tin danh mục của sản phẩm
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('category_id')
      .eq('id', productId)
      .single();

    if (productError) throw productError;

    // Lấy các sản phẩm cùng danh mục
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .eq('category_id', product.category_id)
      .neq('id', productId)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }
};

// Tìm kiếm sản phẩm
export const searchProducts = async (query, options = {}) => {
  try {
    const { limit = 10, offset = 0 } = options;

    const { data, error, count } = await supabase
      .from('products')
      .select('*, category:categories(id, name)', { count: 'exact' })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { products: data || [], count };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavorites = async (userId, productId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        { user_id: userId, product_id: productId }
      ]);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFromFavorites = async (userId, productId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Lấy danh sách yêu thích của người dùng
export const getUserFavorites = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        product:products(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data?.map(item => item.product) || [];
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
};

// Lấy lịch sử xem sản phẩm của người dùng
export const getUserViewHistory = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('product_views')
      .select(`
        created_at,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Loại bỏ các sản phẩm trùng lặp, chỉ giữ lại lần xem gần nhất
    const uniqueProducts = [];
    const productIds = new Set();
    
    for (const view of data || []) {
      if (!productIds.has(view.product.id)) {
        productIds.add(view.product.id);
        uniqueProducts.push({
          ...view.product,
          last_viewed_at: view.created_at
        });
      }
    }
    
    return uniqueProducts;
  } catch (error) {
    console.error('Error fetching user view history:', error);
    throw error;
  }
};

// Lấy thống kê dashboard
export const getDashboardStats = async () => {
  try {
    // Lấy thông tin sản phẩm
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('count(*)', { count: 'exact', head: true });
    
    if (productsError) throw productsError;
    
    // Lấy số lượng sản phẩm có trong kho
    const { data: inStockData, error: inStockError } = await supabase
      .from('products')
      .select('count(*)', { count: 'exact', head: true })
      .gt('stock', 0);
    
    if (inStockError) throw inStockError;
    
    // Lấy thông tin đơn hàng
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('count(*)', { count: 'exact', head: true });
    
    if (ordersError) throw ordersError;
    
    // Lấy thông tin người dùng
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    // Lấy thông tin doanh thu
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('sum(total_amount)')
      .neq('status', 'cancelled');
    
    if (revenueError) throw revenueError;
    
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
    
    if (recentOrdersError) throw recentOrdersError;
    
    // Lấy sản phẩm sắp hết hàng
    const { data: lowStock, error: lowStockError } = await supabase
      .from('products')
      .select('id, name, stock, price')
      .gt('stock', 0)
      .lte('stock', 5)
      .order('stock', { ascending: true })
      .limit(5);
    
    if (lowStockError) throw lowStockError;
    
    return {
      products: {
        total_products: productsData.count,
        in_stock: inStockData.count,
        out_of_stock: productsData.count - inStockData.count
      },
      orders: {
        total_orders: ordersData.count
      },
      users: {
        total_users: usersData.count
      },
      revenue: {
        total_revenue: revenueData[0]?.sum || 0
      },
      recentOrders,
      lowStock
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

// Lấy thống kê lượt xem sản phẩm
export const getProductViewStats = async (period = 'week') => {
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
    
    // Lấy lượt xem theo ngày
    const { data: viewsByDate, error: viewsError } = await supabase
      .from('product_view_trends_by_date')
      .select('*')
      .order('date', { ascending: true });
    
    if (viewsError) throw viewsError;
    
    // Lấy sản phẩm được xem nhiều nhất
    const { data: topViewedProducts, error: topProductsError } = await supabase
      .from('product_view_analytics')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(10);
    
    if (topProductsError) throw topProductsError;
    
    return {
      period,
      viewsByDate: viewsByDate || [],
      topViewedProducts: topViewedProducts || [],
      totalViews: viewsByDate?.reduce((sum, item) => sum + item.view_count, 0) || 0
    };
  } catch (error) {
    console.error('Error getting product view stats:', error);
    throw error;
  }
};

// CRUD cho sản phẩm (Admin)
export const adminCreateProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const adminUpdateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const adminDeleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// CRUD cho danh mục (Admin)
export const adminCreateCategory = async (categoryData) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const adminUpdateCategory = async (id, categoryData) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const adminDeleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// CRUD cho bộ sưu tập (Admin)
export const adminCreateCollection = async (collectionData) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .insert([collectionData])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

export const adminUpdateCollection = async (id, collectionData) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .update(collectionData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

export const adminDeleteCollection = async (id) => {
  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};

// Quản lý đơn hàng (Admin)
export const adminGetAllOrders = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search, 
      startDate, 
      endDate 
    } = options;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:users(id, email, first_name, last_name),
        item_count:order_items(count)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`id.ilike.%${search}%,user.email.ilike.%${search}%`);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    query = query.order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { orders: data || [], count };
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const adminUpdateOrderStatus = async (id, status, notes = null) => {
  try {
    // Cập nhật trạng thái đơn hàng
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Thêm lịch sử đơn hàng
    const { error: historyError } = await supabase
      .from('order_history')
      .insert([
        {
          order_id: id,
          status,
          notes: notes || `Trạng thái đơn hàng đã được cập nhật thành ${status}`
        }
      ]);

    if (historyError) throw historyError;

    return data[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Quản lý người dùng (Admin)
export const adminGetAllUsers = async (options = {}) => {
  try {
    const { page = 1, limit = 20, search, role } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, created_at', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    // Apply pagination
    query = query.order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { users: data || [], count };
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const adminCreateUser = async (userData) => {
  try {
    const { email, password, first_name, last_name, phone, address, role } = userData;

    // Đăng ký người dùng với Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        phone,
        address,
        role
      }
    });

    if (authError) throw authError;

    return authData.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const adminUpdateUser = async (id, userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const adminDeleteUser = async (id) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Lấy thống kê phân tích (Admin)
export const adminGetAnalytics = async (period = 'month') => {
  try {
    // Lấy thống kê lượt xem sản phẩm
    const viewStats = await getProductViewStats(period);
    
    // Lấy thống kê doanh thu
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
    
    const { data: salesData, error: salesError } = await supabase
      .from('orders')
      .select(`
        created_at,
        total_amount,
        status
      `)
      .filter(timeFilter)
      .order('created_at', { ascending: true });
    
    if (salesError) throw salesError;
    
    // Xử lý dữ liệu doanh thu theo ngày
    const salesByDate = {};
    salesData?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = {
          date,
          revenue: 0,
          orders: 0
        };
      }
      
      if (order.status !== 'cancelled') {
        salesByDate[date].revenue += order.total_amount;
      }
      
      salesByDate[date].orders += 1;
    });
    
    return {
      period,
      viewStats,
      salesData: Object.values(salesByDate),
      totalRevenue: Object.values(salesByDate).reduce((sum, day) => sum + day.revenue, 0),
      totalOrders: Object.values(salesByDate).reduce((sum, day) => sum + day.orders, 0)
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

export default supabase;