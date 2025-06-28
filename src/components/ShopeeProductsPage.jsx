import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ShopeeProductCard from './ShopeeProductCard';
import '../styles/ShopeeProductsPage.css';

// Import sample images
import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';
import lubu5 from '../images/lubu5.jpg';
import lubu6 from '../images/lubu6.jpg';
import lubu7 from '../images/lubu7.jpg';
import lubu8 from '../images/lubu8.jpg';

const ShopeeProductsPage = ({ onNavigate, onProductSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Sample products data with Shopee links
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567890",
      images: [lubu1, lubu2, lubu3]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567891",
      images: [lubu2, lubu3, lubu4]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567892",
      images: [lubu3, lubu4, lubu5]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567893",
      images: [lubu4, lubu5, lubu6]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567894",
      images: [lubu5, lubu6, lubu7]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567895",
      images: [lubu6, lubu7, lubu8]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567896",
      images: [lubu7, lubu8, lubu1]
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
      shopeeUrl: "https://shopee.vn/product/123456789/1234567897",
      images: [lubu8, lubu1, lubu2]
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: products.length },
    { id: 'dimoo', name: 'DIMOO', count: products.filter(p => p.category === 'dimoo').length },
    { id: 'molly', name: 'MOLLY', count: products.filter(p => p.category === 'molly').length },
    { id: 'labubu', name: 'LABUBU', count: products.filter(p => p.category === 'labubu').length }
  ];

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="shopee-products-page"
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
              <h1 className="products-title">🛍️ Sản phẩm của chúng tôi</h1>
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
                  <h3>Tìm kiếm</h3>
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn">🔍</button>
                  </div>
                </div>

                <div className="shopee-promo">
                  <div className="promo-icon">🛒</div>
                  <h3>Mua sắm trên Shopee</h3>
                  <p>Tất cả sản phẩm của chúng tôi đều có bán trên Shopee với nhiều ưu đãi hấp dẫn!</p>
                  <a 
                    href="https://shopee.vn/shop/123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shopee-shop-link"
                  >
                    Ghé thăm cửa hàng Shopee
                  </a>
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
                    Hiển thị {filteredProducts.length} sản phẩm
                  </p>
                </div>

                <div className="shopee-products-grid">
                  {filteredProducts.map((product, index) => (
                    <ShopeeProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={() => {
                        onProductSelect(product);
                        onNavigate('product-detail');
                      }}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="no-products">
                    <div className="no-products-icon">🔍</div>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                  </div>
                )}
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

export default ShopeeProductsPage;