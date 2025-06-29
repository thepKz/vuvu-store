import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactImageMagnify from 'react-image-magnify';
import Header from './Header';
import Footer from './Footer';
import ProductRecommendations from './ProductRecommendations';
import '../styles/ProductDetailEnhanced.css';

const ProductDetailEnhanced = ({ product, onNavigate, onProductSelect }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const [isVisible, setIsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const rotationRef = useRef(null);
  const imageRef = useRef(null);

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

  // Handle 360 rotation
  const handleRotationStart = (e) => {
    if (isFullscreen) {
      setIsDragging(true);
      setDragStart(e.clientX || (e.touches && e.touches[0].clientX) || 0);
    }
  };

  const handleRotationMove = (e) => {
    if (isDragging && isFullscreen) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const diff = clientX - dragStart;
      setRotation(prev => (prev + diff / 5) % 360);
      setDragStart(clientX);
    }
  };

  const handleRotationEnd = () => {
    setIsDragging(false);
  };

  // Auto-rotate effect
  useEffect(() => {
    let rotationInterval;
    
    if (isFullscreen && !isDragging) {
      rotationInterval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
    }
    
    return () => clearInterval(rotationInterval);
  }, [isFullscreen, isDragging]);

  // Handle image zoom
  const handleImageHover = (e) => {
    if (!isZoomed || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

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

  // Use product images if available, otherwise use a single image
  const images = product.images || [product.image, product.image, product.image, product.image];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxStock = 10;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    // Buy now logic
    alert('Chuyển đến trang thanh toán!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setRotation(0);
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
                  onClick={toggleFullscreen}
                  ref={imageRef}
                >
                  <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: product.name,
                        isFluidWidth: true,
                        src: images[selectedImage]
                      },
                      largeImage: {
                        src: images[selectedImage],
                        width: 1200,
                        height: 1200
                      },
                      enlargedImageContainerDimensions: {
                        width: '150%',
                        height: '150%'
                      },
                      isHintEnabled: true,
                      shouldHideHintAfterFirstActivation: false,
                      hintTextMouse: 'Di chuột để phóng to'
                    }}
                  />
                  {product.badge && (
                    <div className={`product-badge badge-${product.badge.toLowerCase()}`}>
                      {product.badge}
                    </div>
                  )}
                  <div className="zoom-hint">
                    🔍 Nhấp để xem toàn màn hình
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
                <motion.button
                  className="thumbnail view-360"
                  onClick={toggleFullscreen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>360°</span>
                </motion.button>
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
                <div className="product-code">
                  <span>Mã sản phẩm: </span>
                  <strong>SKU-{product.id || '12345'}</strong>
                </div>
              </div>

              <div className="product-price-section">
                <div className="price-info">
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="discount">-30%</span>
                  )}
                </div>
                <div className="stock-info">
                  <span className="stock-status in-stock">
                    ✅ Còn hàng
                  </span>
                  <span className="stock-count">(10 sản phẩm)</span>
                </div>
              </div>

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
                    disabled={quantity >= 10}
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
                >
                  🛒 Thêm vào giỏ hàng
                </motion.button>
                <motion.button 
                  className="btn btn-secondary buy-now"
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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

              {/* Share Buttons */}
              <div className="share-section">
                <h3>Chia sẻ sản phẩm:</h3>
                <div className="share-buttons">
                  <motion.button 
                    className="share-btn facebook"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span>Facebook</span>
                  </motion.button>
                  
                  <motion.button 
                    className="share-btn twitter"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span>Twitter</span>
                  </motion.button>
                  
                  <motion.button 
                    className="share-btn pinterest"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span>Pinterest</span>
                  </motion.button>
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

                    <div className="product-specs">
                      <h4>Thông số kỹ thuật</h4>
                      <div className="specs-table">
                        <div className="spec-row">
                          <div className="spec-label">Thương hiệu</div>
                          <div className="spec-value">Dudu Store</div>
                        </div>
                        <div className="spec-row">
                          <div className="spec-label">Xuất xứ</div>
                          <div className="spec-value">Việt Nam</div>
                        </div>
                        <div className="spec-row">
                          <div className="spec-label">Chất liệu</div>
                          <div className="spec-value">Silicone cao cấp</div>
                        </div>
                        <div className="spec-row">
                          <div className="spec-label">Kích thước</div>
                          <div className="spec-value">10cm x 8cm x 5cm</div>
                        </div>
                        <div className="spec-row">
                          <div className="spec-label">Trọng lượng</div>
                          <div className="spec-value">150g</div>
                        </div>
                        <div className="spec-row">
                          <div className="spec-label">Độ tuổi phù hợp</div>
                          <div className="spec-value">3 tuổi trở lên</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="shipping-content">
                    <h3>Thông tin vận chuyển</h3>
                    <div className="shipping-options">
                      <div className="shipping-option">
                        <strong>Giao hàng tiêu chuẩn</strong>
                        <p>2-3 ngày làm việc • Miễn phí cho đơn từ 500.000đ</p>
                      </div>
                      <div className="shipping-option">
                        <strong>Giao hàng nhanh</strong>
                        <p>1-2 ngày làm việc • Phí 30.000đ</p>
                      </div>
                      <div className="shipping-option">
                        <strong>Giao hàng trong ngày</strong>
                        <p>Trong ngày (khu vực nội thành) • Phí 50.000đ</p>
                      </div>
                    </div>

                    <div className="shipping-policy">
                      <h4>Chính sách vận chuyển</h4>
                      <ul>
                        <li>Đơn hàng được xử lý trong vòng 24 giờ sau khi đặt hàng</li>
                        <li>Thời gian giao hàng có thể thay đổi tùy thuộc vào khu vực và điều kiện thời tiết</li>
                        <li>Khách hàng sẽ nhận được thông báo khi đơn hàng được gửi đi</li>
                        <li>Theo dõi đơn hàng thông qua mã vận đơn được cung cấp qua email hoặc SMS</li>
                      </ul>
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

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="fullscreen-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFullscreen}
          >
            <div 
              className="fullscreen-content"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleRotationStart}
              onMouseMove={handleRotationMove}
              onMouseUp={handleRotationEnd}
              onMouseLeave={handleRotationEnd}
              onTouchStart={handleRotationStart}
              onTouchMove={handleRotationMove}
              onTouchEnd={handleRotationEnd}
              ref={rotationRef}
            >
              <div className="rotation-view">
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
                <div className="rotation-instructions">
                  <p>🖱️ Kéo để xoay 360°</p>
                </div>
              </div>
              <div className="fullscreen-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`fullscreen-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
              <button className="close-fullscreen" onClick={toggleFullscreen}>
                ✖️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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