import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/ProductsPage.css';

import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';
import lubu5 from '../images/lubu5.jpg';
import lubu6 from '../images/lubu6.jpg';
import lubu7 from '../images/lubu7.jpg';
import lubu8 from '../images/lubu8.jpg';

const ProductsPage = ({ onNavigate, onProductSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const products = [
    {
      id: 1,
      image: lubu1,
      name: "DIMOO Squishy Vương Quốc",
      description: "Squishy Vương Quốc Động Vật siêu dễ thương",
      price: "230.000đ",
      originalPrice: null,
      badge: "Mới",
      category: "dimoo",
      rating: 4.8
    },
    {
      id: 2,
      image: lubu2,
      name: "DIMOO Squishy Thỏ",
      description: "Squishy Thỏ Nghỉ Lễ cực kỳ mềm mại",
      price: "253.000đ",
      originalPrice: null,
      badge: "Hot",
      category: "dimoo",
      rating: 4.9
    },
    {
      id: 3,
      image: lubu3,
      name: "MOLLY Squishy Khổng Lồ",
      description: "MOLLY SQUISHY KHỔNG LỒ 100% Loạt 2-B",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "molly",
      rating: 4.7
    },
    {
      id: 4,
      image: lubu4,
      name: "MOLLY Squishy Premium",
      description: "MOLLY SQUISHY KHỔNG LỒ 100% Loạt 2-C",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "molly",
      rating: 4.6
    },
    {
      id: 5,
      image: lubu5,
      name: "LABUBU Squishy Đặc Biệt",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-C",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "labubu",
      rating: 4.8
    },
    {
      id: 6,
      image: lubu6,
      name: "LABUBU Squishy Limited",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-D",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "labubu",
      rating: 4.9
    },
    {
      id: 7,
      image: lubu7,
      name: "LABUBU Squishy Collector",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-E",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "labubu",
      rating: 4.7
    },
    {
      id: 8,
      image: lubu8,
      name: "LABUBU Squishy Exclusive",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-F",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "labubu",
      rating: 4.8
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: products.length },
    { id: 'dimoo', name: 'DIMOO', count: products.filter(p => p.category === 'dimoo').length },
    { id: 'molly', name: 'MOLLY', count: products.filter(p => p.category === 'molly').length },
    { id: 'labubu', name: 'LABUBU', count: products.filter(p => p.category === 'labubu').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case 'price-high':
        return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleProductClick = (product) => {
    onProductSelect(product);
    onNavigate('product-detail');
    // Scroll to top when navigating to product detail
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="products-page"
    >
      <Header currentPage="products" onNavigate={onNavigate} />
      
      <main className="products-main">
        <section className="products-hero">
          <div className="container">
            <motion.div
              className="products-hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="products-title">🛍️ Tất cả sản phẩm</h1>
              <p className="products-subtitle">
                Khám phá bộ sưu tập squishy đa dạng và chất lượng cao của chúng tôi
              </p>
            </motion.div>
          </div>
        </section>

        <section className="products-content">
          <div className="container">
            <div className="products-layout">
              <motion.aside 
                className="products-sidebar"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="filter-section">
                  <h3>Danh mục</h3>
                  <div className="category-filters">
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{category.name}</span>
                        <span className="category-count">({category.count})</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Sắp xếp theo</h3>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="name">Tên A-Z</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </motion.aside>

              <motion.div 
                className="products-grid-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="products-header">
                  <p className="products-count">
                    Hiển thị {sortedProducts.length} sản phẩm
                  </p>
                </div>

                <div className="products-grid">
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="product-card"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      onClick={() => handleProductClick(product)}
                    >
                      {product.badge && (
                        <div className={`product-badge badge-${product.badge.toLowerCase()}`}>
                          {product.badge}
                        </div>
                      )}
                      
                      <div className="product-image-container">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-overlay">
                          <button className="quick-view-btn">
                            <span>👁️</span>
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                      
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        
                        <div className="product-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="rating-text">({product.rating})</span>
                        </div>
                        
                        <div className="product-price">
                          {product.originalPrice && (
                            <span className="original-price">{product.originalPrice}</span>
                          )}
                          <span className="current-price">{product.price}</span>
                        </div>
                        
                        <button className="product-detail-btn">
                          <span>🔍</span>
                          Chi tiết sản phẩm
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll to top button */}
      {isVisible && (
        <motion.button
          className="scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⬆️
        </motion.button>
      )}

      <Footer />
    </motion.div>
  );
};

export default ProductsPage;