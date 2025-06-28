import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';
import supabase from '../services/supabaseClient';

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
        
        // Fetch product view statistics
        const { data: viewsData, error: viewsError } = await supabase
          .from('product_view_trends_by_date')
          .select('*')
          .order('date', { ascending: true })
          .limit(30);
        
        if (viewsError) throw viewsError;
        
        // Fetch top viewed products
        const { data: topProducts, error: topProductsError } = await supabase
          .from('product_view_analytics')
          .select('*')
          .order('view_count', { ascending: false })
          .limit(10);
        
        if (topProductsError) throw topProductsError;
        
        // Fetch product counts
        const { data: productCounts, error: productCountsError } = await supabase
          .rpc('get_product_counts');
        
        if (productCountsError) throw productCountsError;
        
        // Fetch order counts
        const { data: orderCounts, error: orderCountsError } = await supabase
          .rpc('get_order_counts');
        
        if (orderCountsError) throw orderCountsError;
        
        // Fetch user counts
        const { data: userCounts, error: userCountsError } = await supabase
          .rpc('get_user_counts');
        
        if (userCountsError) throw userCountsError;
        
        // Fetch revenue data
        const { data: revenueData, error: revenueError } = await supabase
          .rpc('get_revenue_data');
        
        if (revenueError) throw revenueError;
        
        // Fetch recent orders
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
        
        // Fetch low stock products
        const { data: lowStock, error: lowStockError } = await supabase
          .from('products')
          .select('id, name, stock, price')
          .gt('stock', 0)
          .lte('stock', 5)
          .order('stock', { ascending: true })
          .limit(5);
        
        if (lowStockError) throw lowStockError;
        
        // Process views data for chart
        const processedViewsData = processViewsData(viewsData, period);
        
        setViewsData(processedViewsData);
        setDashboardData({
          topProducts,
          productCounts: productCounts || {
            total_products: 0,
            in_stock: 0,
            out_of_stock: 0
          },
          orderCounts: orderCounts || {
            total_orders: 0,
            pending_orders: 0,
            processing_orders: 0,
            shipped_orders: 0,
            delivered_orders: 0,
            cancelled_orders: 0
          },
          userCounts: userCounts || {
            total_users: 0,
            new_users: 0
          },
          revenueData: revenueData || {
            total_revenue: 0,
            monthly_revenue: 0,
            weekly_revenue: 0
          },
          recentOrders: recentOrders || [],
          lowStock: lowStock || []
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

  // Process views data for chart based on period
  const processViewsData = (data, period) => {
    if (!data || data.length === 0) return null;
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let filteredData;
    const now = new Date();
    
    switch (period) {
      case 'day':
        // Last 24 hours - would need hourly data which we don't have
        filteredData = sortedData.slice(-1);
        break;
      case 'week':
        // Last 7 days
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredData = sortedData.filter(item => new Date(item.date) >= weekAgo);
        break;
      case 'month':
        // Last 30 days
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        filteredData = sortedData.filter(item => new Date(item.date) >= monthAgo);
        break;
      case 'year':
        // Last 365 days
        const yearAgo = new Date(now);
        yearAgo.setDate(yearAgo.getDate() - 365);
        filteredData = sortedData.filter(item => new Date(item.date) >= yearAgo);
        break;
      default:
        filteredData = sortedData.slice(-7); // Default to last 7 days
    }
    
    // Format dates for display
    const labels = filteredData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });
    
    const viewCounts = filteredData.map(item => item.view_count);
    
    return {
      labels,
      viewCounts,
      totalViews: viewCounts.reduce((sum, count) => sum + count, 0),
      uniqueProducts: Math.max(...filteredData.map(item => item.unique_products), 0),
      uniqueUsers: Math.max(...filteredData.map(item => item.unique_users), 0)
    };
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
                <p className="stat-value">{formatCurrency(dashboardData?.revenueData?.total_revenue)}</p>
                <p className="stat-period">tổng doanh thu</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>📦</div>
              <div className="stat-content">
                <h3>Đơn hàng</h3>
                <p className="stat-value">{dashboardData?.orderCounts?.total_orders || 0}</p>
                <p className="stat-period">tổng đơn hàng</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>👥</div>
              <div className="stat-content">
                <h3>Người dùng</h3>
                <p className="stat-value">{dashboardData?.userCounts?.total_users || 0}</p>
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
              <h3>Thống kê đơn hàng</h3>
              <div className="chart-container">
                <Bar 
                  data={{
                    labels: ['Chờ xử lý', 'Đang xử lý', 'Đã gửi', 'Đã giao', 'Đã hủy'],
                    datasets: [
                      {
                        data: [
                          dashboardData?.orderCounts?.pending_orders || 0,
                          dashboardData?.orderCounts?.processing_orders || 0,
                          dashboardData?.orderCounts?.shipped_orders || 0,
                          dashboardData?.orderCounts?.delivered_orders || 0,
                          dashboardData?.orderCounts?.cancelled_orders || 0
                        ],
                        backgroundColor: [
                          '#f59e0b',
                          '#3b82f6',
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
                  {dashboardData?.topProducts?.map((product) => (
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
                  {(!dashboardData?.topProducts || dashboardData.topProducts.length === 0) && (
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

export default AdminDashboard;