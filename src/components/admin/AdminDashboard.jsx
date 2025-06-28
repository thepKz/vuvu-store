import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../hooks/useSupabase';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import '../../styles/AdminDashboard.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [period, setPeriod] = useState('week');
  const { data: analyticsData, loading, error, fetchAnalytics } = useAnalytics(period);
  
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchAnalytics(newPeriod);
  };
  
  // Prepare chart data
  const viewsChartData = {
    labels: analyticsData?.dailyViews.map(item => item.date) || [],
    datasets: [
      {
        label: 'Product Views',
        data: analyticsData?.dailyViews.map(item => item.count) || [],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const topProductsChartData = {
    labels: analyticsData?.productViews.slice(0, 5).map(item => item.name) || [],
    datasets: [
      {
        label: 'Views',
        data: analyticsData?.productViews.slice(0, 5).map(item => item.views) || [],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Views Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Products by Views'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="period-selector">
          <button 
            className={period === 'day' ? 'active' : ''} 
            onClick={() => handlePeriodChange('day')}
          >
            Today
          </button>
          <button 
            className={period === 'week' ? 'active' : ''} 
            onClick={() => handlePeriodChange('week')}
          >
            This Week
          </button>
          <button 
            className={period === 'month' ? 'active' : ''} 
            onClick={() => handlePeriodChange('month')}
          >
            This Month
          </button>
          <button 
            className={period === 'year' ? 'active' : ''} 
            onClick={() => handlePeriodChange('year')}
          >
            This Year
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error loading analytics: {error}</p>
          <button onClick={() => fetchAnalytics(period)}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                <h3>Total Views</h3>
                <p className="stat-value">{analyticsData?.totalViews || 0}</p>
                <p className="stat-period">in the last {getPeriodDisplay(period)}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>Most Viewed Product</h3>
                <p className="stat-value">
                  {analyticsData?.productViews[0]?.name || 'No data'}
                </p>
                <p className="stat-period">
                  {analyticsData?.productViews[0]?.views || 0} views
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Products Viewed</h3>
                <p className="stat-value">{analyticsData?.productViews.length || 0}</p>
                <p className="stat-period">unique products</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Average Daily Views</h3>
                <p className="stat-value">
                  {analyticsData?.dailyViews.length 
                    ? Math.round(analyticsData.totalViews / analyticsData.dailyViews.length) 
                    : 0}
                </p>
                <p className="stat-period">views per day</p>
              </div>
            </div>
          </div>
          
          <div className="charts-container">
            <div className="chart-card">
              <h3>Views Over Time</h3>
              <div className="chart-container">
                <Line data={viewsChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Top Products</h3>
              <div className="chart-container">
                <Bar data={topProductsChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
          
          <div className="top-products-table">
            <h3>Top Viewed Products</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Views</th>
                    <th>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData?.productViews.slice(0, 10).map((product) => (
                    <tr key={product.id}>
                      <td className="product-cell">
                        {product.image && (
                          <div className="product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                        )}
                        <span>{product.name}</span>
                      </td>
                      <td>{product.views}</td>
                      <td>
                        {analyticsData.totalViews 
                          ? Math.round((product.views / analyticsData.totalViews) * 100) 
                          : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Helper function to get period display text
function getPeriodDisplay(period) {
  switch (period) {
    case 'day': return 'day';
    case 'week': return '7 days';
    case 'month': return '30 days';
    case 'year': return 'year';
    default: return 'period';
  }
}

export default AdminDashboard;