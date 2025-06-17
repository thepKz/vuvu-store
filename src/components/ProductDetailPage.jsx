import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = ({ product, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header currentPage="products" onNavigate={onNavigate} />
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h2>Không tìm thấy sản phẩm</h2>
          <button onClick={() => onNavigate('products')} className="btn btn-primary">
            Quay lại danh sách sản phẩm
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [product.image, product.image, product.image]; // Mock multiple images
  
  const relatedProducts = [
    { id: 1, name: "Sản phẩm tương tự 1", price: "200.000đ", image: product.image },
    { id: 2, name: "Sản phẩm tương tự 2", price: "250.000đ", image: product.image },
    { id: 3, name: "Sản phẩm tương tự 3", price: "300.000đ", image: product.image },
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="product-detail-page"
    >
      <Header currentPage="products" onNavigate={onNavigate} />
      
      <main className="product-detail-main">
        <div className="container">
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
            <motion.div 
              className="product-images"
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

            <motion.div 
              className="product-info"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < Math.floor(product.rating || 4.5) ? 'filled' : ''}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">({product.rating || 4.5}) • 127 đánh giá</span>
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
                <p>{product.description}</p>
                <ul>
                  <li>✨ Chất liệu cao cấp, an toàn cho trẻ em</li>
                  <li>🌟 Thiết kế dễ thương, màu sắc tươi sáng</li>
                  <li>💝 Kích thước hoàn hảo để ôm và chơi</li>
                  <li>🎁 Phù hợp làm quà tặng cho mọi lứa tuổi</li>
                </ul>
              </div>

              <div className="product-options">
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
              </div>

              <div className="product-actions">
                <motion.button 
                  className="btn btn-primary add-to-cart"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🛒 Thêm vào giỏ hàng
                </motion.button>
                <motion.button 
                  className="btn btn-secondary buy-now"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ⚡ Mua ngay
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
            </motion.div>
          </div>

          <motion.section 
            className="related-products"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Sản phẩm tương tự</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="related-product-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="related-product-image">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h4>{relatedProduct.name}</h4>
                    <p className="related-product-price">{relatedProduct.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default ProductDetailPage;