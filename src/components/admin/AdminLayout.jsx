import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/AdminLayout.css';
import AdminDashboard from './AdminDashboard';
import ProductManager from './ProductManager';
import CollectionManager from './CollectionManager';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManager />;
      case 'collections':
        return <CollectionManager />;
      case 'categories':
        return <div>Categories Manager</div>;
      case 'orders':
        return <div>Orders Manager</div>;
      case 'users':
        return <div>Users Manager</div>;
      case 'settings':
        return <div>Settings</div>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Dudu Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button 
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'products' ? 'active' : ''}
                onClick={() => setActiveTab('products')}
              >
                <span className="nav-icon">📦</span>
                Sản phẩm
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'collections' ? 'active' : ''}
                onClick={() => setActiveTab('collections')}
              >
                <span className="nav-icon">🎨</span>
                Bộ sưu tập
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'categories' ? 'active' : ''}
                onClick={() => setActiveTab('categories')}
              >
                <span className="nav-icon">🗂️</span>
                Danh mục
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                <span className="nav-icon">🛒</span>
                Đơn hàng
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => setActiveTab('users')}
              >
                <span className="nav-icon">👥</span>
                Người dùng
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'settings' ? 'active' : ''}
                onClick={() => setActiveTab('settings')}
              >
                <span className="nav-icon">⚙️</span>
                Cài đặt
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn">
            <span className="nav-icon">🚪</span>
            Đăng xuất
          </button>
        </div>
      </aside>
      
      <main className="admin-content">
        <header className="admin-header">
          <div className="header-search">
            <input type="text" placeholder="Tìm kiếm..." />
            <button className="search-btn">🔍</button>
          </div>
          
          <div className="header-actions">
            <button className="notifications-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            <div className="user-profile">
              <div className="avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;