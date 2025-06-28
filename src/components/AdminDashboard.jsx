import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [salesPeriod, setSalesPeriod] = useState('week');
  const [viewsPeriod, setViewsPeriod] = useState('week');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập dữ liệu thống kê
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setTimeout(() => {
      setDashboardStats({
        products: {
          total_products: 41,
          in_stock: 35,
          out_of_stock: 6,
          low_stock: 8
        },
        orders: {
          total_orders: 128,
          pending_orders: 12,
          processing_orders: 24,
          shipped_orders: 36,
          delivered_orders: 52,
          cancelled_orders: 4
        },
        users: {
          total_users: 256,
          new_users: 24
        },
        revenue: {
          total_revenue: 45600000,
          monthly_revenue: 12500000,
          weekly_revenue: 3200000
        },
        recentOrders: [
          { id: 'ORD-001', user_email: 'user1@example.com', status: 'pending', total_amount: 850000, created_at: '2025-06-25T10:30:00Z' },
          { id: 'ORD-002', user_email: 'user2@example.com', status: 'processing', total_amount: 1250000, created_at: '2025-06-24T14:20:00Z' },
          { id: 'ORD-003', user_email: 'user3@example.com', status: 'shipped', total_amount: 750000, created_at: '2025-06-23T09:15:00Z' },
          { id: 'ORD-004', user_email: 'user4@example.com', status: 'delivered', total_amount: 1450000, created_at: '2025-06-22T16:45:00Z' },
          { id: 'ORD-005', user_email: 'user5@example.com', status: 'cancelled', total_amount: 550000, created_at: '2025-06-21T11:10:00Z' }
        ],
        lowStock: [
          { id: 'PROD-001', name: 'DIMOO Limited Edition', stock: 2, price: 253000 },
          { id: 'PROD-002', name: 'MOLLY Exclusive Series', stock: 3, price: 805000 },
          { id: 'PROD-003', name: 'LABUBU Collector Series', stock: 4, price: 805000 },
          { id: 'PROD-004', name: 'DIMOO Premium Collection', stock: 5, price: 230000 }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Dữ liệu biểu đồ doanh thu
  const revenueData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [1200000, 1900000, 1500000, 2200000, 1800000, 2500000, 3000000],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Dữ liệu biểu đồ lượt xem sản phẩm
  const viewsData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Lượt xem',
        data: [120, 190, 150, 220, 180, 250, 300],
        backgroundColor: '#ec4899',
        borderRadius: 6
      }
    ]
  };

  // Dữ liệu biểu đồ trạng thái đơn hàng
  const orderStatusData = {
    labels: ['Chờ xử lý', 'Đang xử lý', 'Đã gửi hàng', 'Đã giao hàng', 'Đã hủy'],
    datasets: [
      {
        data: [12, 24, 36, 52, 4],
        backgroundColor: [
          '#f59e0b',
          '#3b82f6',
          '#a855f7',
          '#10b981',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  };

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

  // Render trạng thái tồn kho
  const renderStockStatus = (stock) => {
    if (stock === 0) {
      return <span className="product-status status-out-of-stock">Hết hàng</span>;
    } else if (stock <= 5) {
      return <span className="product-status status-low-stock">Sắp hết ({stock})</span>;
    } else {
      return <span className="product-status status-in-stock">Còn hàng ({stock})</span>;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          <h1>Dudu <span>Admin</span></h1>
        </div>
        <div className="admin-actions">
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-section-title">Tổng quan</div>
              <div 
                className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveSection('dashboard')}
              >
                <div className="nav-icon">📊</div>
                <span>Bảng điều khiển</span>
              </div>
              <div 
                className={`nav-link ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveSection('analytics')}
              >
                <div className="nav-icon">📈</div>
                <span>Phân tích</span>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-section-title">Quản lý</div>
              <div 
                className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}
                onClick={() => setActiveSection('products')}
              >
                <div className="nav-icon">🛍️</div>
                <span>Sản phẩm</span>
              </div>
              <div 
                className={`nav-link ${activeSection === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveSection('categories')}
              >
                <div className="nav-icon">🗂️</div>
                <span>Danh mục</span>
              </div>
              <div 
                className={`nav-link ${activeSection === 'collections' ? 'active' : ''}`}
                onClick={() => setActiveSection('collections')}
              >
                <div className="nav-icon">🎨</div>
                <span>Bộ sưu tập</span>
              </div>
              <div 
                className={`nav-link ${activeSection === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveSection('orders')}
              >
                <div className="nav-icon">📦</div>
                <span>Đơn hàng</span>
              </div>
              <div 
                className={`nav-link ${activeSection === 'users' ? 'active' : ''}`}
                onClick={() => setActiveSection('users')}
              >
                <div className="nav-icon">👥</div>
                <span>Người dùng</span>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-section-title">Nội dung</div>
              <div 
                className={`nav-link ${activeSection === 'media' ? 'active' : ''}`}
                onClick={() => setActiveSection('media')}
              >
                <div className="nav-icon">🖼️</div>
                <span>Thư viện media</span>
              </div>
              <div 
                className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveSection('settings')}
              >
                <div className="nav-icon">⚙️</div>
                <span>Cài đặt</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="page-header">
                <h1 className="page-title">Bảng điều khiển</h1>
                <p className="page-description">Tổng quan về hoạt động của cửa hàng</p>
              </div>

              {isLoading ? (
                <div className="loading-state">Đang tải dữ liệu...</div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="stat-title">Tổng doanh thu</div>
                        <div className="stat-icon icon-purple">💰</div>
                      </div>
                      <div className="stat-value">{formatCurrency(dashboardStats.revenue.total_revenue)}</div>
                      <div className="stat-comparison comparison-positive">
                        <span>↑ 12.5%</span>
                        <span>so với tháng trước</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="stat-title">Tổng đơn hàng</div>
                        <div className="stat-icon icon-pink">📦</div>
                      </div>
                      <div className="stat-value">{dashboardStats.orders.total_orders}</div>
                      <div className="stat-comparison comparison-positive">
                        <span>↑ 8.2%</span>
                        <span>so với tháng trước</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="stat-title">Tổng sản phẩm</div>
                        <div className="stat-icon icon-blue">🛍️</div>
                      </div>
                      <div className="stat-value">{dashboardStats.products.total_products}</div>
                      <div className="stat-comparison comparison-positive">
                        <span>↑ 5.3%</span>
                        <span>so với tháng trước</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="stat-title">Tổng người dùng</div>
                        <div className="stat-icon icon-green">👥</div>
                      </div>
                      <div className="stat-value">{dashboardStats.users.total_users}</div>
                      <div className="stat-comparison comparison-positive">
                        <span>↑ 15.8%</span>
                        <span>so với tháng trước</span>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="charts-row">
                    <div className="chart-card">
                      <div className="chart-header">
                        <div className="chart-title">Doanh thu</div>
                        <div className="chart-actions">
                          <div 
                            className={`chart-period ${salesPeriod === 'week' ? 'active' : ''}`}
                            onClick={() => setSalesPeriod('week')}
                          >
                            Tuần
                          </div>
                          <div 
                            className={`chart-period ${salesPeriod === 'month' ? 'active' : ''}`}
                            onClick={() => setSalesPeriod('month')}
                          >
                            Tháng
                          </div>
                          <div 
                            className={`chart-period ${salesPeriod === 'year' ? 'active' : ''}`}
                            onClick={() => setSalesPeriod('year')}
                          >
                            Năm
                          </div>
                        </div>
                      </div>
                      <div className="chart-container">
                        <Line 
                          data={revenueData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function(value) {
                                    return formatCurrency(value).replace('₫', '') + 'đ';
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <div className="chart-title">Trạng thái đơn hàng</div>
                      </div>
                      <div className="chart-container">
                        <Pie 
                          data={orderStatusData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Lượt xem sản phẩm</div>
                      <div className="chart-actions">
                        <div 
                          className={`chart-period ${viewsPeriod === 'week' ? 'active' : ''}`}
                          onClick={() => setViewsPeriod('week')}
                        >
                          Tuần
                        </div>
                        <div 
                          className={`chart-period ${viewsPeriod === 'month' ? 'active' : ''}`}
                          onClick={() => setViewsPeriod('month')}
                        >
                          Tháng
                        </div>
                        <div 
                          className={`chart-period ${viewsPeriod === 'year' ? 'active' : ''}`}
                          onClick={() => setViewsPeriod('year')}
                        >
                          Năm
                        </div>
                      </div>
                    </div>
                    <div className="chart-container">
                      <Bar 
                        data={viewsData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">Đơn hàng gần đây</div>
                      <div className="view-all">Xem tất cả</div>
                    </div>
                    <table className="admin-table">
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
                        {dashboardStats.recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_email}</td>
                            <td>{renderOrderStatus(order.status)}</td>
                            <td>{formatCurrency(order.total_amount)}</td>
                            <td>{formatDate(order.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Low Stock Products */}
                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">Sản phẩm sắp hết hàng</div>
                      <div className="view-all">Xem tất cả</div>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mã sản phẩm</th>
                          <th>Tên sản phẩm</th>
                          <th>Tồn kho</th>
                          <th>Giá</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardStats.lowStock.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{renderStockStatus(product.stock)}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>
                              <div className="product-actions">
                                <div className="action-btn action-edit">✏️</div>
                                <div className="action-btn">🔍</div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeSection === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="page-header">
                <h1 className="page-title">Quản lý sản phẩm</h1>
                <p className="page-description">Quản lý tất cả sản phẩm trong cửa hàng</p>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <div className="table-title">Danh sách sản phẩm</div>
                  <div className="table-actions">
                    <button className="admin-btn btn-primary btn-icon">
                      <span>+</span>
                      <span>Thêm sản phẩm</span>
                    </button>
                  </div>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Giá</th>
                      <th>Tồn kho</th>
                      <th>Lượt xem</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img 
                          src="https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100" 
                          alt="DIMOO Premium Collection" 
                          className="admin-product-image"
                        />
                      </td>
                      <td>DIMOO Premium Collection</td>
                      <td>DIMOO</td>
                      <td>{formatCurrency(230000)}</td>
                      <td>{renderStockStatus(10)}</td>
                      <td>245</td>
                      <td>
                        <div className="product-actions">
                          <div className="action-btn action-edit">✏️</div>
                          <div className="action-btn action-delete">🗑️</div>
                          <div className="action-btn">🔍</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img 
                          src="https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100" 
                          alt="DIMOO Limited Edition" 
                          className="admin-product-image"
                        />
                      </td>
                      <td>DIMOO Limited Edition</td>
                      <td>DIMOO</td>
                      <td>{formatCurrency(253000)}</td>
                      <td>{renderStockStatus(2)}</td>
                      <td>189</td>
                      <td>
                        <div className="product-actions">
                          <div className="action-btn action-edit">✏️</div>
                          <div className="action-btn action-delete">🗑️</div>
                          <div className="action-btn">🔍</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img 
                          src="https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100" 
                          alt="MOLLY Exclusive Series" 
                          className="admin-product-image"
                        />
                      </td>
                      <td>MOLLY Exclusive Series</td>
                      <td>MOLLY</td>
                      <td>{formatCurrency(805000)}</td>
                      <td>{renderStockStatus(8)}</td>
                      <td>312</td>
                      <td>
                        <div className="product-actions">
                          <div className="action-btn action-edit">✏️</div>
                          <div className="action-btn action-delete">🗑️</div>
                          <div className="action-btn">🔍</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img 
                          src="https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100" 
                          alt="LABUBU Special Edition" 
                          className="admin-product-image"
                        />
                      </td>
                      <td>LABUBU Special Edition</td>
                      <td>LABUBU</td>
                      <td>{formatCurrency(805000)}</td>
                      <td>{renderStockStatus(0)}</td>
                      <td>278</td>
                      <td>
                        <div className="product-actions">
                          <div className="action-btn action-edit">✏️</div>
                          <div className="action-btn action-delete">🗑️</div>
                          <div className="action-btn">🔍</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="table-footer">
                  <div className="pagination">
                    <div className="page-button">«</div>
                    <div className="page-button active">1</div>
                    <div className="page-button">2</div>
                    <div className="page-button">3</div>
                    <div className="page-button">»</div>
                  </div>
                  <div className="page-info">Hiển thị 1-10 của 41 sản phẩm</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="page-header">
                <h1 className="page-title">Phân tích dữ liệu</h1>
                <p className="page-description">Thống kê và phân tích dữ liệu cửa hàng</p>
              </div>

              <div className="analytics-filters">
                <div className="filter-group">
                  <div className="filter-label">Thời gian:</div>
                  <select className="filter-select">
                    <option value="7days">7 ngày qua</option>
                    <option value="30days">30 ngày qua</option>
                    <option value="90days">90 ngày qua</option>
                    <option value="year">Năm nay</option>
                  </select>
                </div>
                <div className="filter-group">
                  <div className="filter-label">Danh mục:</div>
                  <select className="filter-select">
                    <option value="all">Tất cả danh mục</option>
                    <option value="dimoo">DIMOO</option>
                    <option value="molly">MOLLY</option>
                    <option value="labubu">LABUBU</option>
                  </select>
                </div>
              </div>

              <div className="charts-row">
                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">Lượt xem sản phẩm theo thời gian</div>
                  </div>
                  <div className="chart-container">
                    <Line 
                      data={{
                        labels: ['01/06', '08/06', '15/06', '22/06', '29/06'],
                        datasets: [
                          {
                            label: 'Lượt xem',
                            data: [450, 520, 480, 580, 620],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">Sản phẩm được xem nhiều nhất</div>
                  </div>
                  <div className="chart-container">
                    <Pie 
                      data={{
                        labels: ['DIMOO Premium', 'MOLLY Exclusive', 'LABUBU Special', 'DIMOO Limited', 'Khác'],
                        datasets: [
                          {
                            data: [30, 25, 20, 15, 10],
                            backgroundColor: [
                              '#a855f7',
                              '#ec4899',
                              '#3b82f6',
                              '#f59e0b',
                              '#9ca3af'
                            ],
                            borderWidth: 0
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <div className="table-title">Sản phẩm được xem nhiều nhất</div>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Lượt xem</th>
                      <th>Người xem duy nhất</th>
                      <th>Tỷ lệ chuyển đổi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DIMOO Premium Collection</td>
                      <td>DIMOO</td>
                      <td>245</td>
                      <td>198</td>
                      <td>12.5%</td>
                    </tr>
                    <tr>
                      <td>MOLLY Exclusive Series</td>
                      <td>MOLLY</td>
                      <td>312</td>
                      <td>256</td>
                      <td>15.2%</td>
                    </tr>
                    <tr>
                      <td>LABUBU Special Edition</td>
                      <td>LABUBU</td>
                      <td>278</td>
                      <td>215</td>
                      <td>13.8%</td>
                    </tr>
                    <tr>
                      <td>DIMOO Limited Edition</td>
                      <td>DIMOO</td>
                      <td>189</td>
                      <td>154</td>
                      <td>10.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeSection === 'media' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="page-header">
                <h1 className="page-title">Thư viện media</h1>
                <p className="page-description">Quản lý hình ảnh và tệp đa phương tiện</p>
              </div>

              <div className="form-card">
                <div className="media-upload">
                  <div className="upload-icon">📤</div>
                  <div className="upload-text">Kéo thả file vào đây hoặc click để chọn file</div>
                </div>
              </div>

              <div className="form-card">
                <div className="form-section-title">Thư viện hình ảnh</div>
                <div className="media-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="media-item">
                      <img 
                        src={`https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1`} 
                        alt={`Media item ${item}`}
                      />
                      <div className="media-overlay">
                        <div className="media-action">🔍</div>
                        <div className="media-action">📋</div>
                        <div className="media-action">🗑️</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="page-header">
                <h1 className="page-title">Cài đặt hệ thống</h1>
                <p className="page-description">Quản lý cài đặt cửa hàng</p>
              </div>

              <div className="form-card">
                <div className="form-section">
                  <div className="form-section-title">Thông tin cửa hàng</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tên cửa hàng</label>
                      <input type="text" className="form-input" defaultValue="Dudu Store" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mô tả</label>
                      <input type="text" className="form-input" defaultValue="Premium Squishy Collection" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Địa chỉ</label>
                    <input type="text" className="form-input" defaultValue="123 Đường ABC, Quận XYZ, TP.HCM" />
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-title">Cài đặt thanh toán</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Đơn vị tiền tệ</label>
                      <select className="form-select">
                        <option value="VND">VND - Việt Nam Đồng</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Thuế (%)</label>
                      <input type="number" className="form-input" defaultValue="10" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phí vận chuyển</label>
                      <input type="number" className="form-input" defaultValue="30000" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ngưỡng miễn phí vận chuyển</label>
                      <input type="number" className="form-input" defaultValue="500000" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-title">Thông tin liên hệ</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email liên hệ</label>
                      <input type="email" className="form-input" defaultValue="contact@dudustore.com" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input type="tel" className="form-input" defaultValue="0123456789" />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="admin-btn btn-secondary">Hủy</button>
                  <button className="admin-btn btn-primary">Lưu thay đổi</button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;