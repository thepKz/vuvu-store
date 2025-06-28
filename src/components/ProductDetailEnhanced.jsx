import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ProductRecommendations from './ProductRecommendations';
import '../styles/ProductDetailEnhanced.css';

const ProductDetailEnhanced = ({ product, onNavigate, onProductSelect }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
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

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="product-detail-enhanced">
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

  // Mock data for enhanced features
  const images = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const variants = product.variants || [
    { id: 1, name: 'Kích thước S', price: product.price, stock: 10 },
    { id: 2, name: 'Kích thước M', price: '350.000đ', stock: 5 },
    { id: 3, name: 'Kích thước L', price: '450.000đ', stock: 3 }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxStock = selectedVariant?.stock || 10;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageHover = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    // Add to cart logic
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    // Buy now logic
    alert('Chuyển đến trang thanh toán!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="product-detail-enhanced"
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

          {/* Product Content */}
          <div className="product-content">
            {/* Product Gallery */}
            <motion.div 
              className="product-gallery"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="main-image-container">
                <motion.div 
                  className={`main-image ${isZoomed ? 'zoomed' : ''}`}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleImageHover}
                >
                  <img 
                    src={images[selectedImage]} 
                    alt={product.name}
                    style={isZoomed ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transform: 'scale(2)'
                    } : {}}
                  />
                  {product.badge && (
                    <div className={`product-badge badge-${product.badge.toLowerCase()}`}>
                      {product.badge}
                    </div>
                  )}
                  <div className="zoom-hint">
                    🔍 Di chuột để phóng to
                  </div>
                </motion.div>
              </div>
              
              <div className="thumbnail-gallery">
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
              </div>

              <div className="product-price-section">
                <div className="price-info">
                  {selectedVariant?.originalPrice && (
                    <span className="original-price">{selectedVariant.originalPrice}</span>
                  )}
                  <span className="current-price">{selectedVariant?.price || product.price}</span>
                  {selectedVariant?.originalPrice && (
                    <span className="discount">-30%</span>
                  )}
                </div>
                <div className="stock-info">
                  <span className={`stock-status ${(selectedVariant?.stock || 10) > 0 ? 'in-stock' : 'out-stock'}`}>
                    {(selectedVariant?.stock || 10) > 0 ? '✅ Còn hàng' : '❌ Hết hàng'}
                  </span>
                  <span className="stock-count">({selectedVariant?.stock || 10} sản phẩm)</span>
                </div>
              </div>

              {/* Product Variants */}
              {variants.length > 0 && (
                <div className="product-variants">
                  <h3>Chọn phiên bản:</h3>
                  <div className="variants-grid">
                    {variants.map((variant) => (
                      <motion.button
                        key={variant.id}
                        className={`variant-option ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={variant.stock === 0}
                      >
                        <span className="variant-name">{variant.name}</span>
                        <span className="variant-price">{variant.price}</span>
                        {variant.stock === 0 && <span className="out-of-stock">Hết hàng</span>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="quantity-section">
                <label>Số lượng:</label>
                <div className="quantity-controls">
                  <motion.button 
                    onClick={() => handleQuantityChange(-1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={quantity <= 1}
                  >
                    -
                  </motion.button>
                  <span className="quantity-display">{quantity}</span>
                  <motion.button 
                    onClick={() => handleQuantityChange(1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={quantity >= (selectedVariant?.stock || 10)}
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <motion.button 
                  className="btn btn-primary add-to-cart"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={(selectedVariant?.stock || 10) === 0}
                >
                  🛒 Thêm vào giỏ hàng
                </motion.button>
                <motion.button 
                  className="btn btn-secondary buy-now"
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={(selectedVariant?.stock || 10) === 0}
                >
                  ⚡ Mua ngay
                </motion.button>
              </div>

              {/* Product Features */}
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
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.section 
            className="product-details-tabs"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="tabs-header">
              {['description', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'description' && 'Mô tả sản phẩm'}
                  {tab === 'shipping' && 'Vận chuyển'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' && (
                  <div className="description-content">
                    <h3>Mô tả chi tiết</h3>
                    <p>{product.description || "Sản phẩm squishy cao cấp với thiết kế độc đáo, chất liệu mềm mại và an toàn. Phù hợp làm quà tặng hoặc sưu tập."}</p>
                    <ul>
                      <li>✨ Chất liệu cao cấp, an toàn cho trẻ em</li>
                      <li>🌟 Thiết kế dễ thương, màu sắc tươi sáng</li>
                      <li>💝 Kích thước hoàn hảo để ôm và chơi</li>
                      <li>🎁 Phù hợp làm quà tặng cho mọi lứa tuổi</li>
                      <li>🧼 Dễ dàng vệ sinh và bảo quản</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="shipping-content">
                    <h3>Thông tin vận chuyển</h3>
                    <div className="shipping-options">
                      <div className="shipping-option">
                        <strong>🚚 Giao hàng tiêu chuẩn</strong>
                        <p>2-3 ngày làm việc • Miễn phí cho đơn từ 500.000đ</p>
                      </div>
                      <div className="shipping-option">
                        <strong>⚡ Giao hàng nhanh</strong>
                        <p>1-2 ngày làm việc • Phí 30.000đ</p>
                      </div>
                      <div className="shipping-option">
                        <strong>🏃 Giao hàng trong ngày</strong>
                        <p>Trong ngày (khu vực nội thành) • Phí 50.000đ</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.section>

          {/* Product Recommendations */}
          <ProductRecommendations 
            onNavigate={onNavigate} 
            onProductSelect={onProductSelect}
            currentProduct={product}
          />
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

export default ProductDetailEnhanced;