import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Giả lập dữ liệu đơn hàng
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          user: {
            id: 'USR-001',
            email: 'user1@example.com',
            first_name: 'Nguyễn',
            last_name: 'Văn A'
          },
          status: 'pending',
          total_amount: 850000,
          shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
          payment_method: 'COD',
          payment_status: 'pending',
          created_at: '2025-06-25T10:30:00Z',
          updated_at: '2025-06-25T10:30:00Z',
          items: [
            {
              id: 'ITEM-001',
              product: {
                id: 'PROD-001',
                name: 'DIMOO Premium Collection',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 230000
            },
            {
              id: 'ITEM-002',
              product: {
                id: 'PROD-002',
                name: 'DIMOO Limited Edition',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: {
                id: 'VAR-001',
                name: 'Kích thước M'
              },
              quantity: 2,
              price: 300000
            }
          ]
        },
        {
          id: 'ORD-002',
          user: {
            id: 'USR-002',
            email: 'user2@example.com',
            first_name: 'Trần',
            last_name: 'Thị B'
          },
          status: 'processing',
          total_amount: 1250000,
          shipping_address: '456 Đường DEF, Quận 2, TP.HCM',
          payment_method: 'Bank Transfer',
          payment_status: 'paid',
          created_at: '2025-06-24T14:20:00Z',
          updated_at: '2025-06-24T15:30:00Z',
          items: [
            {
              id: 'ITEM-003',
              product: {
                id: 'PROD-003',
                name: 'MOLLY Exclusive Series',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 805000
            },
            {
              id: 'ITEM-004',
              product: {
                id: 'PROD-004',
                name: 'MOLLY Deluxe Collection',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 445000
            }
          ]
        },
        {
          id: 'ORD-003',
          user: {
            id: 'USR-003',
            email: 'user3@example.com',
            first_name: 'Lê',
            last_name: 'Văn C'
          },
          status: 'shipped',
          total_amount: 750000,
          shipping_address: '789 Đường GHI, Quận 3, TP.HCM',
          payment_method: 'Momo',
          payment_status: 'paid',
          created_at: '2025-06-23T09:15:00Z',
          updated_at: '2025-06-23T14:45:00Z',
          items: [
            {
              id: 'ITEM-005',
              product: {
                id: 'PROD-005',
                name: 'LABUBU Special Edition',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 750000
            }
          ]
        },
        {
          id: 'ORD-004',
          user: {
            id: 'USR-004',
            email: 'user4@example.com',
            first_name: 'Phạm',
            last_name: 'Thị D'
          },
          status: 'delivered',
          total_amount: 1450000,
          shipping_address: '101 Đường JKL, Quận 4, TP.HCM',
          payment_method: 'Credit Card',
          payment_status: 'paid',
          created_at: '2025-06-22T16:45:00Z',
          updated_at: '2025-06-24T10:30:00Z',
          items: [
            {
              id: 'ITEM-006',
              product: {
                id: 'PROD-001',
                name: 'DIMOO Premium Collection',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 2,
              price: 230000
            },
            {
              id: 'ITEM-007',
              product: {
                id: 'PROD-003',
                name: 'MOLLY Exclusive Series',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 805000
            },
            {
              id: 'ITEM-008',
              product: {
                id: 'PROD-002',
                name: 'DIMOO Limited Edition',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 253000
            }
          ]
        },
        {
          id: 'ORD-005',
          user: {
            id: 'USR-005',
            email: 'user5@example.com',
            first_name: 'Hoàng',
            last_name: 'Văn E'
          },
          status: 'cancelled',
          total_amount: 550000,
          shipping_address: '202 Đường MNO, Quận 5, TP.HCM',
          payment_method: 'COD',
          payment_status: 'cancelled',
          created_at: '2025-06-21T11:10:00Z',
          updated_at: '2025-06-21T15:20:00Z',
          items: [
            {
              id: 'ITEM-009',
              product: {
                id: 'PROD-004',
                name: 'MOLLY Deluxe Collection',
                image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              variant: null,
              quantity: 1,
              price: 550000
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setTotalPages(3); // Giả sử có 3 trang
      setIsLoading(false);
    }, 1000);
  }, []);

  // Định dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render trạng thái đơn hàng
  const renderOrderStatus = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Chờ xử lý' },
      'processing': { class: 'status-processing', text: 'Đang xử lý' },
      'shipped': { class: 'status-shipped', text: 'Đã gửi hàng' },
      'delivered': { class: 'status-delivered', text: 'Đã giao hàng' },
      'cancelled': { class: 'status-cancelled', text: 'Đã hủy' }
    };
    
    const statusInfo = statusMap[status] || { class: '', text: status };
    
    return (
      <span className={`order-status ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Render trạng thái thanh toán
  const renderPaymentStatus = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Chờ thanh toán' },
      'paid': { class: 'status-delivered', text: 'Đã thanh toán' },
      'failed': { class: 'status-cancelled', text: 'Thất bại' },
      'refunded': { class: 'status-processing', text: 'Đã hoàn tiền' },
      'cancelled': { class: 'status-cancelled', text: 'Đã hủy' }
    };
    
    const statusInfo = statusMap[status] || { class: '', text: status };
    
    return (
      <span className={`order-status ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý thay đổi bộ lọc trạng thái
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  // Xử lý xem chi tiết đơn hàng
  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setShowOrderModal(true);
  };

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    // Trong thực tế, đây sẽ là API call
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updated_at: new Date().toISOString() } 
        : order
    ));
    
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({ ...currentOrder, status: newStatus, updated_at: new Date().toISOString() });
    }
  };

  // Xử lý phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter(order => {
    // Lọc theo trạng thái
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.user.email.toLowerCase().includes(searchLower) ||
        `${order.user.first_name} ${order.user.last_name}`.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Sắp xếp đơn hàng
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'created_at') {
      return sortOrder === 'asc' 
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'total_amount') {
      return sortOrder === 'asc' 
        ? a.total_amount - b.total_amount
        : b.total_amount - a.total_amount;
    }
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Quản lý đơn hàng</h1>
        <p className="page-description">Quản lý và xử lý đơn hàng</p>
      </div>

      <div className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tìm kiếm</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tìm kiếm theo mã đơn hàng, email..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select 
              className="form-select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã gửi hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sắp xếp theo</label>
            <select 
              className="form-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="created_at-desc">Mới nhất</option>
              <option value="created_at-asc">Cũ nhất</option>
              <option value="total_amount-desc">Giá trị cao nhất</option>
              <option value="total_amount-asc">Giá trị thấp nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Danh sách đơn hàng</div>
        </div>
        
        {isLoading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : (
          <>
            <table className="admin-table">
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
                {sortedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <div>{order.user.email}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {order.user.first_name} {order.user.last_name}
                      </div>
                    </td>
                    <td>{renderOrderStatus(order.status)}</td>
                    <td>
                      <div>{order.payment_method}</div>
                      <div>{renderPaymentStatus(order.payment_status)}</div>
                    </td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <div className="product-actions">
                        <div 
                          className="action-btn action-edit"
                          onClick={() => handleViewOrder(order)}
                        >
                          🔍
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              <div className="pagination">
                <div 
                  className="page-button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  «
                </div>
                {[...Array(totalPages).keys()].map((page) => (
                  <div 
                    key={page + 1}
                    className={`page-button ${currentPage === page + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </div>
                ))}
                <div 
                  className="page-button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                >
                  »
                </div>
              </div>
              <div className="page-info">
                Hiển thị {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, filteredOrders.length)} của {filteredOrders.length} đơn hàng
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showOrderModal && currentOrder && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng #{currentOrder.id}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowOrderModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Thông tin đơn hàng</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Trạng thái:</strong> {renderOrderStatus(currentOrder.status)}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Ngày tạo:</strong> {formatDate(currentOrder.created_at)}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Cập nhật lần cuối:</strong> {formatDate(currentOrder.updated_at)}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Tổng tiền:</strong> {formatCurrency(currentOrder.total_amount)}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Thông tin khách hàng</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Tên:</strong> {currentOrder.user.first_name} {currentOrder.user.last_name}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Email:</strong> {currentOrder.user.email}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Địa chỉ giao hàng:</strong> {currentOrder.shipping_address}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Thông tin thanh toán</h3>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Phương thức thanh toán:</strong> {currentOrder.payment_method}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Trạng thái thanh toán:</strong> {renderPaymentStatus(currentOrder.payment_status)}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Sản phẩm</h3>
                <table className="admin-table">
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
                    {currentOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <div>{item.product.name}</div>
                        </td>
                        <td>{item.variant ? item.variant.name : 'N/A'}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'right', fontWeight: '600' }}>Tổng cộng:</td>
                      <td style={{ fontWeight: '600' }}>{formatCurrency(currentOrder.total_amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              {currentOrder.status === 'pending' && (
                <button 
                  className="admin-btn btn-primary"
                  onClick={() => handleUpdateOrderStatus(currentOrder.id, 'processing')}
                >
                  Xử lý đơn hàng
                </button>
              )}
              {currentOrder.status === 'processing' && (
                <button 
                  className="admin-btn btn-primary"
                  onClick={() => handleUpdateOrderStatus(currentOrder.id, 'shipped')}
                >
                  Đánh dấu đã gửi hàng
                </button>
              )}
              {currentOrder.status === 'shipped' && (
                <button 
                  className="admin-btn btn-primary"
                  onClick={() => handleUpdateOrderStatus(currentOrder.id, 'delivered')}
                >
                  Đánh dấu đã giao hàng
                </button>
              )}
              {(currentOrder.status === 'pending' || currentOrder.status === 'processing') && (
                <button 
                  className="admin-btn btn-danger"
                  onClick={() => handleUpdateOrderStatus(currentOrder.id, 'cancelled')}
                >
                  Hủy đơn hàng
                </button>
              )}
              <button 
                className="admin-btn btn-secondary"
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