import React, { useState, useEffect } from 'react';
import './styles/global.css';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
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
        return <ProductsPage onNavigate={handleNavigation} onProductSelect={handleProductSelect} />;
      case 'product-detail':
        return <ProductDetailPage product={selectedProduct} onNavigate={handleNavigation} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigation} />;
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