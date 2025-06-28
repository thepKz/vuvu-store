import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';
import '../styles/OrderManagement.css';
import supabase from '../services/supabaseClient';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('orders')
          .select(`
            *,
            user:users(id, email, first_name, last_name)
          `, { count: 'exact' });
        
        // Apply status filter
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        
        // Apply search filter
        if (filters.search) {
          query = query.or(`id.ilike.%${filters.search}%,user.email.ilike.%${filters.search}%`);
        }
        
        // Apply date filters
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
        
        // Apply pagination
        query = query
          .range(
            (pagination.page - 1) * pagination.limit, 
            pagination.page * pagination.limit - 1
          )
          .order('created_at', { ascending: false });
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setOrders(data || []);
        setPagination(prev => ({
          ...prev,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / prev.limit)
        }));
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [filters, pagination.page, pagination.limit]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          user:users(id, email, first_name, last_name, phone, address)
        `)
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;
      
      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(id, name, image),
          variant:product_variants(id, name, image)
        `)
        .eq('order_id', orderId);
      
      if (itemsError) throw itemsError;
      
      // Combine data
      const orderWithItems = {
        ...orderData,
        items: itemsData || []
      };
      
      setSelectedOrder(orderWithItems);
      setShowOrderModal(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message);
      alert('Lỗi khi tải chi tiết đơn hàng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      // Update order status
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date()
        })
        .eq('id', orderId)
        .select();
      
      if (error) throw error;
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updated_at: new Date() } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, updated_at: new Date() });
      }
      
      alert('Cập nhật trạng thái đơn hàng thành công');
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
      alert('Lỗi khi cập nhật trạng thái đơn hàng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get order status display
  const getOrderStatusDisplay = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Chờ xử lý' },
      'processing': { class: 'status-processing', text: 'Đang xử lý' },
      'shipped': { class: 'status-shipped', text: 'Đã gửi hàng' },
      'delivered': { class: 'status-delivered', text: 'Đã giao hàng' },
      'cancelled': { class: 'status-cancelled', text: 'Đã hủy' }
    };
    
    return statusMap[status] || { class: '', text: status };
  };

  // Get payment status display
  const getPaymentStatusDisplay = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Chờ thanh toán' },
      'paid': { class: 'status-delivered', text: 'Đã thanh toán' },
      'failed': { class: 'status-cancelled', text: 'Thất bại' },
      'refunded': { class: 'status-processing', text: 'Đã hoàn tiền' },
      'cancelled': { class: 'status-cancelled', text: 'Đã hủy' }
    };
    
    return statusMap[status] || { class: '', text: status };
  };

  return (
    <motion.div
      className="order-management"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Quản lý đơn hàng</h1>
        <p className="page-description">Quản lý và xử lý đơn hàng</p>
      </div>
      
      <div className="order-filters">
        <div className="filter-group">
          <div className="filter">
            <label>Trạng thái</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã gửi hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          
          <div className="filter">
            <label>Tìm kiếm</label>
            <input 
              type="text" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange}
              placeholder="Tìm theo mã đơn hàng, email..."
            />
          </div>
          
          <div className="filter">
            <label>Từ ngày</label>
            <input 
              type="date" 
              name="startDate" 
              value={filters.startDate} 
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter">
            <label>Đến ngày</label>
            <input 
              type="date" 
              name="endDate" 
              value={filters.endDate} 
              onChange={handleFilterChange}
            />
          </div>
        </div>
        
        <button 
          className="clear-filters-btn"
          onClick={clearFilters}
          disabled={!Object.values(filters).some(Boolean)}
        >
          Xóa bộ lọc
        </button>
      </div>
      
      {loading && orders.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải đơn hàng: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Không tìm thấy đơn hàng</h3>
          <p>Hãy điều chỉnh bộ lọc hoặc thử lại sau</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-email">{order.user?.email}</div>
                      <div className="customer-name">
                        {order.user?.first_name} {order.user?.last_name}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`order-status ${getOrderStatusDisplay(order.status).class}`}>
                      {getOrderStatusDisplay(order.status).text}
                    </span>
                  </td>
                  <td>
                    <div className="payment-info">
                      <div className="payment-method">{order.payment_method}</div>
                      <span className={`payment-status ${getPaymentStatusDisplay(order.payment_status).class}`}>
                        {getPaymentStatusDisplay(order.payment_status).text}
                      </span>
                    </div>
                  </td>
                  <td>{formatCurrency(order.total_amount)}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <div className="order-actions">
                      <button 
                        className="view-btn"
                        onClick={() => viewOrderDetails(order.id)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination-container">
            <div className="pagination">
              <button 
                className="page-btn"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                &laquo;
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, and pages around current page
                  return page === 1 || 
                         page === pagination.totalPages || 
                         (page >= pagination.page - 1 && page <= pagination.page + 1);
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="page-ellipsis">...</span>
                        <button 
                          className={`page-btn ${pagination.page === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button 
                      key={page}
                      className={`page-btn ${pagination.page === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              
              <button 
                className="page-btn"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                &raquo;
              </button>
            </div>
            
            <div className="pagination-info">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, pagination.totalCount)} của {pagination.totalCount} đơn hàng
            </div>
          </div>
        </div>
      )}
      
      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowOrderModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-detail-grid">
                <div className="order-info-section">
                  <h3>Thông tin đơn hàng</h3>
                  <div className="info-group">
                    <label>Trạng thái:</label>
                    <span className={`order-status ${getOrderStatusDisplay(selectedOrder.status).class}`}>
                      {getOrderStatusDisplay(selectedOrder.status).text}
                    </span>
                  </div>
                  <div className="info-group">
                    <label>Ngày tạo:</label>
                    <span>{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="info-group">
                    <label>Cập nhật lần cuối:</label>
                    <span>{formatDate(selectedOrder.updated_at)}</span>
                  </div>
                  <div className="info-group">
                    <label>Tổng tiền:</label>
                    <span className="order-total">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
                
                <div className="customer-info-section">
                  <h3>Thông tin khách hàng</h3>
                  <div className="info-group">
                    <label>Tên:</label>
                    <span>{selectedOrder.user?.first_name} {selectedOrder.user?.last_name}</span>
                  </div>
                  <div className="info-group">
                    <label>Email:</label>
                    <span>{selectedOrder.user?.email}</span>
                  </div>
                  <div className="info-group">
                    <label>Điện thoại:</label>
                    <span>{selectedOrder.user?.phone || 'Không có'}</span>
                  </div>
                  <div className="info-group">
                    <label>Địa chỉ giao hàng:</label>
                    <span>{selectedOrder.shipping_address}</span>
                  </div>
                </div>
              </div>
              
              <div className="payment-info-section">
                <h3>Thông tin thanh toán</h3>
                <div className="info-group">
                  <label>Phương thức thanh toán:</label>
                  <span>{selectedOrder.payment_method}</span>
                </div>
                <div className="info-group">
                  <label>Trạng thái thanh toán:</label>
                  <span className={`payment-status ${getPaymentStatusDisplay(selectedOrder.payment_status).class}`}>
                    {getPaymentStatusDisplay(selectedOrder.payment_status).text}
                  </span>
                </div>
              </div>
              
              <div className="order-items-section">
                <h3>Sản phẩm</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Biến thể</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="product-cell">
                          {item.product?.image && (
                            <div className="product-image">
                              <img src={item.product.image} alt={item.product.name} />
                            </div>
                          )}
                          <span>{item.product?.name}</span>
                        </td>
                        <td>{item.variant?.name || 'N/A'}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="total-label">Tổng cộng:</td>
                      <td className="total-value">{formatCurrency(selectedOrder.total_amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="modal-footer">
              {selectedOrder.status === 'pending' && (
                <button 
                  className="status-btn processing-btn"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                >
                  Xử lý đơn hàng
                </button>
              )}
              {selectedOrder.status === 'processing' && (
                <button 
                  className="status-btn shipped-btn"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                >
                  Đánh dấu đã gửi hàng
                </button>
              )}
              {selectedOrder.status === 'shipped' && (
                <button 
                  className="status-btn delivered-btn"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                >
                  Đánh dấu đã giao hàng
                </button>
              )}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <button 
                  className="status-btn cancel-btn"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                >
                  Hủy đơn hàng
                </button>
              )}
              <button 
                className="close-btn"
                onClick={() => setShowOrderModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrderManagement;