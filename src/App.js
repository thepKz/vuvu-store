import React, { useState, useEffect } from 'react';
import './styles/global.css';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetailEnhanced from './components/ProductDetailEnhanced';
import AboutPagePopMart from './components/AboutPagePopMart';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import CollectionsPage from './components/CollectionsPage';
import AdminDashboard from './components/AdminDashboard';
import AdminProductManagement from './components/AdminProductManagement';
import AdminMediaLibrary from './components/AdminMediaLibrary';
import AdminAnalytics from './components/AdminAnalytics';
import AdminOrderManagement from './components/AdminOrderManagement';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentPage, adminSection]);

  const handleNavigation = (page, params = {}) => {
    setCurrentPage(page);
    // Handle navigation parameters if needed
    if (params.collection) {
      // Handle collection filtering
      console.log('Navigate to collection:', params.collection);
    }
    if (params.search) {
      // Handle search parameters
      console.log('Search for:', params.search);
    }
    // Immediate scroll to top for faster navigation
    window.scrollTo(0, 0);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    // Scroll to top when selecting a product
    window.scrollTo(0, 0);
  };

  const handleAdminNavigation = (section) => {
    setAdminSection(section);
    // Scroll to top when navigating in admin
    window.scrollTo(0, 0);
  };

  const renderAdminPage = () => {
    switch (adminSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProductManagement />;
      case 'media':
        return <AdminMediaLibrary />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'orders':
        return <AdminOrderManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderPage = () => {
    if (isAdmin) {
      return renderAdminPage();
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'product-detail':
        return <ProductDetailEnhanced product={selectedProduct} onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'collections':
        return <CollectionsPage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'about':
        return <AboutPagePopMart onNavigate={handleNavigation} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigation} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigation} onAdminLogin={() => setIsAdmin(true)} />;
      case 'admin':
        setIsAdmin(true);
        return renderAdminPage();
      default:
        return <HomePage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
      
      {/* Admin Mode Toggle (for development) */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          style={{ 
            padding: '8px 12px', 
            background: isAdmin ? '#ef4444' : '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          {isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
        </button>
      </div>
    </div>
  );
}

export default App;