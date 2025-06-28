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

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('week');
  const [category, setCategory] = useState('all');
  const [viewsData, setViewsData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập dữ liệu phân tích
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setTimeout(() => {
      // Dữ liệu lượt xem theo thời gian
      const mockViewsData = {
        week: {
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          values: [120, 190, 150, 220, 180, 250, 300]
        },
        month: {
          labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
          values: [850, 950, 1100, 1250]
        },
        year: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          values: [2500, 2800, 3200, 3500, 3800, 4200, 4500, 4800, 5200, 5500, 5800, 6200]
        }
      };
      
      // Dữ liệu doanh thu theo thời gian
      const mockSalesData = {
        week: {
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          values: [1200000, 1900000, 1500000, 2200000, 1800000, 2500000, 3000000]
        },
        month: {
          labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
          values: [8500000, 9500000, 11000000, 12500000]
        },
        year: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          values: [25000000, 28000000, 32000000, 35000000, 38000000, 42000000, 45000000, 48000000, 52000000, 55000000, 58000000, 62000000]
        }
      };
      
      // Dữ liệu sản phẩm được xem nhiều nhất
      const mockTopProducts = [
        { id: 'PROD-001', name: 'DIMOO Premium Collection', category: 'DIMOO', views: 245, unique_viewers: 198, conversion_rate: 12.5 },
        { id: 'PROD-003', name: 'MOLLY Exclusive Series', category: 'MOLLY', views: 312, unique_viewers: 256, conversion_rate: 15.2 },
        { id: 'PROD-005', name: 'LABUBU Special Edition', category: 'LABUBU', views: 278, unique_viewers: 215, conversion_rate: 13.8 },
        { id: 'PROD-002', name: 'DIMOO Limited Edition', category: 'DIMOO', views: 189, unique_viewers: 154, conversion_rate: 10.5 },
        { id: 'PROD-004', name: 'MOLLY Deluxe Collection', category: 'MOLLY', views: 165, unique_viewers: 132, conversion_rate: 9.8 }
      ];
      
      setViewsData(mockViewsData);
      setSalesData(mockSalesData);
      setTopProducts(mockTopProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Dữ liệu biểu đồ lượt xem
  const viewsChartData = {
    labels: viewsData?.[period]?.labels || [],
    datasets: [
      {
        label: 'Lượt xem',
        data: viewsData?.[period]?.values || [],
        backgroundColor: '#ec4899',
        borderRadius: 6
      }
    ]
  };

  // Dữ liệu biểu đồ doanh thu
  const salesChartData = {
    labels: salesData?.[period]?.labels || [],
    datasets: [
      {
        label: 'Doanh thu',
        data: salesData?.[period]?.values || [],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Dữ liệu biểu đồ phân bố lượt xem theo danh mục
  const categoryViewsData = {
    labels: ['DIMOO', 'MOLLY', 'LABUBU'],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: [
          '#a855f7',
          '#ec4899',
          '#3b82f6'
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

  return (
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
            <option value="dimoo">DIMOO</option>
            <option value="molly">MOLLY</option>
            <option value="labubu">LABUBU</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="charts-row">
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Lượt xem sản phẩm theo thời gian</div>
                <div className="chart-actions">
                  <div 
                    className={`chart-period ${period === 'week' ? 'active' : ''}`}
                    onClick={() => setPeriod('week')}
                  >
                    Tuần
                  </div>
                  <div 
                    className={`chart-period ${period === 'month' ? 'active' : ''}`}
                    onClick={() => setPeriod('month')}
                  >
                    Tháng
                  </div>
                  <div 
                    className={`chart-period ${period === 'year' ? 'active' : ''}`}
                    onClick={() => setPeriod('year')}
                  >
                    Năm
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <Bar 
                  data={viewsChartData}
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
                <div className="chart-title">Phân bố lượt xem theo danh mục</div>
              </div>
              <div className="chart-container">
                <Pie 
                  data={categoryViewsData}
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
              <div className="chart-title">Doanh thu theo thời gian</div>
              <div className="chart-actions">
                <div 
                  className={`chart-period ${period === 'week' ? 'active' : ''}`}
                  onClick={() => setPeriod('week')}
                >
                  Tuần
                </div>
                <div 
                  className={`chart-period ${period === 'month' ? 'active' : ''}`}
                  onClick={() => setPeriod('month')}
                >
                  Tháng
                </div>
                <div 
                  className={`chart-period ${period === 'year' ? 'active' : ''}`}
                  onClick={() => setPeriod('year')}
                >
                  Năm
                </div>
              </div>
            </div>
            <div className="chart-container">
              <Line 
                data={salesChartData}
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
                {topProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.views}</td>
                    <td>{product.unique_viewers}</td>
                    <td>{product.conversion_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-card">
            <div className="form-section-title">Xuất báo cáo</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Loại báo cáo</label>
                <select className="form-select">
                  <option value="product_views">Lượt xem sản phẩm</option>
                  <option value="sales">Doanh thu</option>
                  <option value="user_activity">Hoạt động người dùng</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Định dạng</label>
                <select className="form-select">
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Thời gian</label>
                <select className="form-select">
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="90days">90 ngày qua</option>
                  <option value="year">Năm nay</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="admin-btn btn-primary">Xuất báo cáo</button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminAnalytics;