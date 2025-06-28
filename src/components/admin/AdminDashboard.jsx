import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import '../../styles/AdminDashboard.css';
import supabase, { getDashboardStats, getProductViewStats } from '../../services/supabaseClient';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [period, setPeriod] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);
  const [viewsData, setViewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats
        const stats = await getDashboardStats();
        
        // Fetch product view statistics
        const viewStats = await getProductViewStats(period);
        
        setDashboardData(stats);
        setViewsData({
          labels: viewStats.viewsByDate.map(item => item.date),
          viewCounts: viewStats.viewsByDate.map(item => item.view_count),
          totalViews: viewStats.totalViews,
          topViewedProducts: viewStats.topViewedProducts
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
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

  // Prepare chart data
  const viewsChartData = {
    labels: viewsData?.labels || [],
    datasets: [
      {
        label: 'Lượt xem',
        data: viewsData?.viewCounts || [],
        backgroundColor: '#a855f7',
        borderColor: '#a855f7',
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
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
                <h3>Lượt xem</h3>
                <p className="stat-value">{viewsData?.totalViews || 0}</p>
                <p className="stat-period">trong {getPeriodDisplay(period)}</p>
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
                <p className="stat-period">tổng người dùng</p>
              </div>
            </div>
          </div>
          
          <div className="charts-container">
            <div className="chart-card">
              <h3>Lượt xem theo thời gian</h3>
              <div className="chart-container">
                <Line data={viewsChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Thống kê sản phẩm</h3>
              <div className="chart-container">
                <Bar 
                  data={{
                    labels: ['Tổng sản phẩm', 'Còn hàng', 'Hết hàng'],
                    datasets: [
                      {
                        data: [
                          dashboardData?.products?.total_products || 0,
                          dashboardData?.products?.in_stock || 0,
                          dashboardData?.products?.out_of_stock || 0
                        ],
                        backgroundColor: [
                          '#a855f7',
                          '#10b981',
                          '#ef4444'
                        ]
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
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="top-products-table">
            <h3>Sản phẩm được xem nhiều nhất</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Lượt xem</th>
                    <th>Người xem</th>
                    <th>Lần xem gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {viewsData?.topViewedProducts?.map((product) => (
                    <tr key={product.product_id}>
                      <td className="product-cell">
                        {product.image && (
                          <div className="admin-product-image">
                            <img src={product.image} alt={product.product_name} />
                          </div>
                        )}
                        <span>{product.product_name}</span>
                      </td>
                      <td>{product.view_count}</td>
                      <td>{product.unique_viewers || 0}</td>
                      <td>{formatDate(product.last_viewed_at)}</td>
                    </tr>
                  ))}
                  {(!viewsData?.topViewedProducts || viewsData.topViewedProducts.length === 0) && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        Không có dữ liệu lượt xem
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="top-products-table">
            <h3>Đơn hàng gần đây</h3>
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
                      <td>{order.id.substring(0, 8)}</td>
                      <td className="product-cell">
                        <div>
                          <div>{order.users?.email}</div>
                          <div>{order.users?.first_name} {order.users?.last_name}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                  {(!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        Không có đơn hàng gần đây
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="top-products-table">
            <h3>Sản phẩm sắp hết hàng</h3>
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
                        <span className="stock-badge low-stock">
                          {product.stock}
                        </span>
                      </td>
                      <td>{formatCurrency(product.price)}</td>
                    </tr>
                  ))}
                  {(!dashboardData?.lowStock || dashboardData.lowStock.length === 0) && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        Không có sản phẩm sắp hết hàng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to get period display text
function getPeriodDisplay(period) {
  switch (period) {
    case 'day': return 'hôm nay';
    case 'week': return '7 ngày qua';
    case 'month': return '30 ngày qua';
    case 'year': return 'năm nay';
    default: return 'khoảng thời gian';
  }
}

// Helper function to get status label
function getStatusLabel(status) {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'processing': return 'Đang xử lý';
    case 'shipped': return 'Đã gửi hàng';
    case 'delivered': return 'Đã giao hàng';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
}

export default AdminDashboard;