import React, { useState, useEffect } from 'react';
import './styles/global.css';
import HomePage from './components/HomePage';
import ShopeeProductsPage from './components/ShopeeProductsPage';
import ShopeeProductDetail from './components/ShopeeProductDetail';
import AboutPagePopMart from './components/AboutPagePopMart';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import CollectionsPage from './components/CollectionsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'products':
        return <ShopeeProductsPage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'product-detail':
        return <ShopeeProductDetail product={selectedProduct} onNavigate={handleNavigation} />;
      case 'collections':
        return <CollectionsPage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'about':
        return <AboutPagePopMart onNavigate={handleNavigation} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigation} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigation} onAdminLogin={() => setIsAdmin(true)} />;
      default:
        return <HomePage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;