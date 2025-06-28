import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [period, setPeriod] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data (mock data for now)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        setTimeout(() => {
          // Mock data
          const mockData = {
            products: {
              total_products: 24,
              in_stock: 18,
              out_of_stock: 6
            },
            orders: {
              total_orders: 156,
              pending_orders: 12,
              processing_orders: 8,
              shipped_orders: 15,
              delivered_orders: 115,
              cancelled_orders: 6
            },
            users: {
              total_users: 350,
              new_users: 42
            },
            revenue: {
              total_revenue: 125000000,
              monthly_revenue: 28000000,
              weekly_revenue: 8500000
            },
            recentOrders: [
              {
                id: 'ORD-001',
                user_id: 'USR-001',
                status: 'pending',
                total_amount: 850000,
                created_at: '2025-06-28T10:30:00Z',
                email: 'customer1@example.com',
                first_name: 'Nguyễn',
                last_name: 'Văn A'
              },
              {
                id: 'ORD-002',
                user_id: 'USR-002',
                status: 'processing',
                total_amount: 1250000,
                created_at: '2025-06-28T09:15:00Z',
                email: 'customer2@example.com',
                first_name: 'Trần',
                last_name: 'Thị B'
              },
              {
                id: 'ORD-003',
                user_id: 'USR-003',
                status: 'shipped',
                total_amount: 750000,
                created_at: '2025-06-27T16:45:00Z',
                email: 'customer3@example.com',
                first_name: 'Lê',
                last_name: 'Văn C'
              }
            ],
            lowStock: [
              {
                id: 'PRD-001',
                name: 'DIMOO Limited Edition',
                stock: 2,
                price: 850000
              },
              {
                id: 'PRD-002',
                name: 'MOLLY Premium Silver',
                stock: 3,
                price: 750000
              },
              {
                id: 'PRD-003',
                name: 'LABUBU Special Edition',
                stock: 4,
                price: 650000
              }
            ],
            topViewed: [
              {
                id: 'PRD-004',
                name: 'DIMOO Premium Gold',
                image: '/images/lubu1.jpg',
                view_count: 245
              },
              {
                id: 'PRD-005',
                name: 'MOLLY Exclusive Series',
                image: '/images/lubu3.jpg',
                view_count: 198
              },
              {
                id: 'PRD-006',
                name: 'LABUBU Collector Series',
                image: '/images/lubu6.jpg',
                view_count: 176
              }
            ]
          };
          
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [period]);

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

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển</h1>
        <div className="period-selector">
          <button 
            className={period === 'day' ? 'active' : ''} 
            onClick={() => setPeriod('day')}
          >
            Hôm nay
          </button>
          <button 
            className={period === 'week' ? 'active' : ''} 
            onClick={() => setPeriod('week')}
          >
            Tuần này
          </button>
          <button 
            className={period === 'month' ? 'active' : ''} 
            onClick={() => setPeriod('month')}
          >
            Tháng này
          </button>
          <button 
            className={period === 'year' ? 'active' : ''} 
            onClick={() => setPeriod('year')}
          >
            Năm nay
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải dữ liệu: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>👁️</div>
              <div className="stat-content">
                <h3>Tổng sản phẩm</h3>
                <p className="stat-value">{dashboardData?.products?.total_products || 0}</p>
                <p className="stat-period">
                  <span className="in-stock">{dashboardData?.products?.in_stock || 0} còn hàng</span> | 
                  <span className="out-of-stock">{dashboardData?.products?.out_of_stock || 0} hết hàng</span>
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>💰</div>
              <div className="stat-content">
                <h3>Doanh thu</h3>
                <p className="stat-value">{formatCurrency(dashboardData?.revenue?.total_revenue)}</p>
                <p className="stat-period">tổng doanh thu</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>📦</div>
              <div className="stat-content">
                <h3>Đơn hàng</h3>
                <p className="stat-value">{dashboardData?.orders?.total_orders || 0}</p>
                <p className="stat-period">tổng đơn hàng</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>👥</div>
              <div className="stat-content">
                <h3>Người dùng</h3>
                <p className="stat-value">{dashboardData?.users?.total_users || 0}</p>
                <p className="stat-period">{dashboardData?.users?.new_users || 0} người dùng mới trong 30 ngày</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card orders-summary">
              <h3>Tổng quan đơn hàng</h3>
              <div className="order-status-summary">
                <div className="status-item">
                  <div className="status-label">Chờ xử lý</div>
                  <div className="status-value status-pending">{dashboardData?.orders?.pending_orders || 0}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Đang xử lý</div>
                  <div className="status-value status-processing">{dashboardData?.orders?.processing_orders || 0}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Đã gửi</div>
                  <div className="status-value status-shipped">{dashboardData?.orders?.shipped_orders || 0}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Đã giao</div>
                  <div className="status-value status-delivered">{dashboardData?.orders?.delivered_orders || 0}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Đã hủy</div>
                  <div className="status-value status-cancelled">{dashboardData?.orders?.cancelled_orders || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card revenue-summary">
              <h3>Doanh thu</h3>
              <div className="revenue-stats">
                <div className="revenue-item">
                  <div className="revenue-period">Tuần này</div>
                  <div className="revenue-amount">{formatCurrency(dashboardData?.revenue?.weekly_revenue)}</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-period">Tháng này</div>
                  <div className="revenue-amount">{formatCurrency(dashboardData?.revenue?.monthly_revenue)}</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-period">Tổng cộng</div>
                  <div className="revenue-amount total">{formatCurrency(dashboardData?.revenue?.total_revenue)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <div className="card-header">
                <h3>Đơn hàng gần đây</h3>
                <button className="view-all-btn">Xem tất cả</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Khách hàng</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentOrders?.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">{order.first_name} {order.last_name}</div>
                            <div className="customer-email">{order.email}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`order-status status-${order.status}`}>
                            {getOrderStatusText(order.status)}
                          </span>
                        </td>
                        <td>{formatCurrency(order.total_amount)}</td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="dashboard-card low-stock">
              <div className="card-header">
                <h3>Sản phẩm sắp hết hàng</h3>
                <button className="view-all-btn">Xem tất cả</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Tồn kho</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.lowStock?.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>
                          <span className="stock-badge low-stock">{product.stock}</span>
                        </td>
                        <td>{formatCurrency(product.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card top-viewed">
            <div className="card-header">
              <h3>Sản phẩm được xem nhiều nhất</h3>
              <button className="view-all-btn">Xem tất cả</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Lượt xem</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.topViewed?.map((product) => (
                    <tr key={product.id}>
                      <td className="product-cell">
                        <div className="admin-product-image">
                          <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} />
                        </div>
                        <span>{product.name}</span>
                      </td>
                      <td>{product.view_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to get order status text
function getOrderStatusText(status) {
  const statusMap = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  };
  
  return statusMap[status] || status;
}

export default AdminDashboard;