import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';
import '../styles/AdminAnalytics.css';
import supabase from '../services/supabaseClient';

// Register ChartJS components
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

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('month');
  const [category, setCategory] = useState('all');
  const [viewsData, setViewsData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch product views by date
        const { data: viewsByDate, error: viewsError } = await supabase
          .from('product_view_trends_by_date')
          .select('*')
          .order('date', { ascending: true });
        
        if (viewsError) throw viewsError;
        
        // Fetch top viewed products
        const { data: topViewedProducts, error: topProductsError } = await supabase
          .from('product_view_analytics')
          .select('*')
          .order('view_count', { ascending: false })
          .limit(10);
        
        if (topProductsError) throw topProductsError;
        
        // Fetch views by category
        const { data: viewsByCategory, error: categoryError } = await supabase
          .from('product_view_by_category')
          .select('*')
          .order('view_count', { ascending: false });
        
        if (categoryError) throw categoryError;
        
        // Fetch sales data (mock data for now)
        const mockSalesData = {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          values: [25000000, 28000000, 32000000, 35000000, 38000000, 42000000, 45000000, 48000000, 52000000, 55000000, 58000000, 62000000]
        };
        
        // Process views data
        const processedViewsData = processViewsData(viewsByDate, period);
        
        setViewsData(processedViewsData);
        setSalesData(mockSalesData);
        setTopProducts(topViewedProducts || []);
        setCategoryData(viewsByCategory || []);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [period]);

  // Process views data for chart based on period
  const processViewsData = (data, period) => {
    if (!data || data.length === 0) return null;
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let filteredData;
    const now = new Date();
    
    switch (period) {
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
        filteredData = sortedData.slice(-30); // Default to last 30 days
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
      uniqueProducts: filteredData.reduce((sum, item) => sum + item.unique_products, 0),
      uniqueUsers: filteredData.reduce((sum, item) => sum + item.unique_users, 0)
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Prepare chart data
  const viewsChartData = {
    labels: viewsData?.labels || [],
    datasets: [
      {
        label: 'Lượt xem',
        data: viewsData?.viewCounts || [],
        backgroundColor: '#ec4899',
        borderColor: '#ec4899',
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }
    ]
  };

  const salesChartData = {
    labels: salesData?.labels || [],
    datasets: [
      {
        label: 'Doanh thu',
        data: salesData?.values || [],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const categoryViewsData = {
    labels: categoryData.slice(0, 5).map(cat => cat.category_name),
    datasets: [
      {
        data: categoryData.slice(0, 5).map(cat => cat.view_count),
        backgroundColor: [
          '#a855f7',
          '#ec4899',
          '#3b82f6',
          '#10b981',
          '#f59e0b'
        ],
        borderWidth: 0
      }
    ]
  };

  // Chart options
  const lineChartOptions = {
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

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return formatCurrency(context.raw);
          }
        }
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
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <motion.div
      className="analytics-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Phân tích dữ liệu</h1>
        <p className="page-description">Thống kê và phân tích dữ liệu cửa hàng</p>
      </div>

      <div className="analytics-filters">
        <div className="filter-group">
          <div className="filter-label">Thời gian:</div>
          <select 
            className="filter-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
        <div className="filter-group">
          <div className="filter-label">Danh mục:</div>
          <select 
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categoryData.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu phân tích...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải dữ liệu: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : (
        <>
          <div className="analytics-summary">
            <div className="summary-card">
              <div className="summary-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>👁️</div>
              <div className="summary-content">
                <h3>Tổng lượt xem</h3>
                <p className="summary-value">{viewsData?.totalViews || 0}</p>
                <p className="summary-period">trong {getPeriodDisplay(period)}</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>🔍</div>
              <div className="summary-content">
                <h3>Sản phẩm được xem</h3>
                <p className="summary-value">{viewsData?.uniqueProducts || 0}</p>
                <p className="summary-period">sản phẩm khác nhau</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>👥</div>
              <div className="summary-content">
                <h3>Người xem duy nhất</h3>
                <p className="summary-value">{viewsData?.uniqueUsers || 0}</p>
                <p className="summary-period">người dùng đã đăng nhập</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Lượt xem theo thời gian</h3>
              <div className="chart-container">
                <Line data={viewsChartData} options={lineChartOptions} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Lượt xem theo danh mục</h3>
              <div className="chart-container">
                <Pie data={categoryViewsData} options={pieChartOptions} />
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Doanh thu theo thời gian</h3>
            <div className="chart-container">
              <Line data={salesChartData} options={salesChartOptions} />
            </div>
          </div>

          <div className="analytics-table">
            <h3>Sản phẩm được xem nhiều nhất</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Lượt xem</th>
                    <th>Người xem duy nhất</th>
                    <th>Lần xem gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.product_id}>
                      <td className="product-cell">
                        <div className="admin-product-image">
                          <img src={product.image || 'https://via.placeholder.com/40'} alt={product.product_name} />
                        </div>
                        <span>{product.product_name}</span>
                      </td>
                      <td>{product.view_count}</td>
                      <td>{product.unique_viewers || 0}</td>
                      <td>{formatDate(product.last_viewed_at)}</td>
                    </tr>
                  ))}
                  {topProducts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-row">
                        Không có dữ liệu lượt xem
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="export-section">
            <h3>Xuất báo cáo</h3>
            <div className="export-options">
              <div className="export-option">
                <label>Loại báo cáo:</label>
                <select className="export-select">
                  <option value="product_views">Lượt xem sản phẩm</option>
                  <option value="sales">Doanh thu</option>
                  <option value="user_activity">Hoạt động người dùng</option>
                </select>
              </div>
              
              <div className="export-option">
                <label>Định dạng:</label>
                <select className="export-select">
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              
              <div className="export-option">
                <label>Thời gian:</label>
                <select className="export-select">
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="90days">90 ngày qua</option>
                  <option value="year">Năm nay</option>
                </select>
              </div>
              
              <button className="export-btn">
                Xuất báo cáo
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Helper function to get period display text
function getPeriodDisplay(period) {
  switch (period) {
    case 'week': return '7 ngày qua';
    case 'month': return '30 ngày qua';
    case 'year': return 'năm nay';
    default: return 'khoảng thời gian';
  }
}

export default AdminAnalytics;