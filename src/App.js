import React, { useState, useEffect } from 'react';
import './styles/global.css';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ScrollToTop from './components/ScrollToTop';

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} onProductSelect={setSelectedProduct} />;
      case 'products':
        return <ProductsPage onNavigate={setCurrentPage} onProductSelect={setSelectedProduct} />;
      case 'product-detail':
        return <ProductDetailPage product={selectedProduct} onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} onProductSelect={setSelectedProduct} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
      <ScrollToTop />
    </div>
  );
}

export default App;