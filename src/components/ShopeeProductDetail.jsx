import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/ShopeeProductDetail.css';

const ShopeeProductDetail = ({ product, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(0);
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

  if (!product) {
    return (
      <div className="shopee-product-detail">
        <Header currentPage="products" onNavigate={onNavigate} />
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="not-found-content"
          >
            <h2>Không tìm thấy sản phẩm</h2>
            <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <motion.button 
              onClick={() => onNavigate('products')} 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Quay lại danh sách sản phẩm
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock multiple images
  const images = [product.image, product.image, product.image]; 

  // Handle Shopee redirect
  const handleShopeeRedirect = () => {
    if (product.shopeeUrl) {
      window.open(product.shopeeUrl, '_blank');
    } else {
      alert('Liên kết Shopee không có sẵn cho sản phẩm này');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="shopee-product-detail"
    >
      <Header currentPage="products" onNavigate={onNavigate} />
      
      <main className="product-detail-main">
        <div className="container">
          {/* Breadcrumb */}
          <motion.nav 
            className="breadcrumb"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button onClick={() => onNavigate('home')}>Trang chủ</button>
            <span>/</span>
            <button onClick={() => onNavigate('products')}>Sản phẩm</button>
            <span>/</span>
            <span>{product.name}</span>
          </motion.nav>

          <div className="product-detail-content">
            {/* Product Gallery */}
            <motion.div 
              className="product-gallery"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="main-image">
                <motion.img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {product.badge && (
                  <div className={`product-badge badge-${product.badge.toLowerCase()}`}>
                    {product.badge}
                  </div>
                )}
              </div>
              
              <div className="thumbnail-images">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              className="product-info"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <div className="shopee-tag">
                  <img 
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png" 
                    alt="Shopee" 
                    className="shopee-logo"
                  />
                  <span>Sản phẩm chính hãng</span>
                </div>
              </div>

              <div className="product-price-section">
                <div className="price-info">
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="discount">
                      -30%
                    </span>
                  )}
                </div>
              </div>

              <div className="product-description">
                <h3>Mô tả sản phẩm</h3>
                <p>{product.description || "Sản phẩm squishy cao cấp với thiết kế độc đáo, chất liệu mềm mại và an toàn. Phù hợp làm quà tặng hoặc sưu tập."}</p>
                <ul>
                  <li>✨ Chất liệu cao cấp, an toàn cho trẻ em</li>
                  <li>🌟 Thiết kế dễ thương, màu sắc tươi sáng</li>
                  <li>💝 Kích thước hoàn hảo để ôm và chơi</li>
                  <li>🎁 Phù hợp làm quà tặng cho mọi lứa tuổi</li>
                  <li>🧼 Dễ dàng vệ sinh và bảo quản</li>
                </ul>
              </div>

              <div className="product-actions">
                <motion.button 
                  className="shopee-buy-btn"
                  onClick={handleShopeeRedirect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png" 
                    alt="Shopee" 
                    className="btn-shopee-logo"
                  />
                  Mua ngay trên Shopee
                </motion.button>
                
                <motion.button 
                  className="back-to-products-btn"
                  onClick={() => onNavigate('products')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Quay lại danh sách sản phẩm
                </motion.button>
              </div>

              <div className="product-features">
                <div className="feature-item">
                  <span className="feature-icon">🚚</span>
                  <div>
                    <strong>Miễn phí vận chuyển</strong>
                    <p>Đơn hàng từ 500.000đ</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <div>
                    <strong>Đổi trả dễ dàng</strong>
                    <p>Trong vòng 7 ngày</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <div>
                    <strong>Bảo hành chính hãng</strong>
                    <p>12 tháng</p>
                  </div>
                </div>
              </div>
              
              <div className="shopee-benefits">
                <h3>Ưu đãi khi mua trên Shopee</h3>
                <ul>
                  <li>🎁 Freeship Xtra cho đơn từ 50K</li>
                  <li>🔥 Giảm 10% cho đơn hàng đầu tiên</li>
                  <li>💰 Hoàn xu 5% khi thanh toán qua ShopeePay</li>
                  <li>🎯 Tích điểm thành viên để đổi quà</li>
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="shopee-banner">
            <div className="banner-content">
              <div className="banner-text">
                <h3>Ghé thăm cửa hàng Shopee của chúng tôi</h3>
                <p>Khám phá thêm nhiều sản phẩm hấp dẫn và ưu đãi độc quyền</p>
              </div>
              <motion.a 
                href="https://shopee.vn/shop/123456789" 
                target="_blank" 
                rel="noopener noreferrer"
                className="banner-btn"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png" 
                  alt="Shopee" 
                  className="btn-shopee-logo"
                />
                Đến cửa hàng Shopee
              </motion.a>
            </div>
          </div>
        </div>
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

export default ShopeeProductDetail;