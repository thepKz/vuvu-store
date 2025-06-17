import React, { useState } from 'react';
import './styles/global.css';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    </div>
  );
}

export default App;