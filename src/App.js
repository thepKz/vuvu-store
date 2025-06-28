import React, { useState, useEffect } from 'react';
import './styles/global.css';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetailEnhanced from './components/ProductDetailEnhanced';
import AboutPagePopMart from './components/AboutPagePopMart';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import CollectionsPage from './components/CollectionsPage';
import AdminApp from './components/AdminApp';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if URL has admin path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('admin')) {
      setIsAdmin(true);
    }
  }, []);

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

  // If admin mode is active, render the admin app
  if (isAdmin) {
    return <AdminApp />;
  }

  const renderPage = () => {
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
        return <LoginPage onNavigate={handleNavigation} />;
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