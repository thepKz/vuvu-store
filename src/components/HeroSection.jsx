import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HeroSection.css';

const HeroSection = ({ onNavigate, onProductSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const handleExploreClick = () => {
    onNavigate('products');
  };

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-mesh"></div>
      </div>
      
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.div className="hero-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">Chào mừng đến với thế giới squishy</span>
            </motion.div>
            
            <motion.h1 className="hero-title">
              <span className="title-line-1">Dudu Taba</span>
              <span className="title-line-2">Squishy Collection</span>
              <div className="title-decoration"></div>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Khám phá bộ sưu tập squishy cao cấp được thiết kế đặc biệt cho những cô gái yêu thích 
              sự dễ thương và chất lượng. Mỗi sản phẩm đều mang đến cảm giác thư giãn tuyệt vời 
              và vẻ đẹp tinh tế.
            </motion.p>
            
            <motion.div className="hero-features" variants={itemVariants}>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Chất lượng cao cấp</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Thiết kế đáng yêu</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </div>
                <span>An toàn tuyệt đối</span>
              </div>
            </motion.div>
            
            <motion.div className="hero-buttons" variants={itemVariants}>
              <motion.button
                className="btn btn-primary"
                onClick={handleExploreClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-text">Khám phá bộ sưu tập</span>
                <div className="btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                onClick={() => onNavigate('about')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-text">Tìm hiểu thêm</span>
              </motion.button>
            </motion.div>

            <motion.div className="hero-social-proof" variants={itemVariants}>
              <div className="proof-item">
                <div className="proof-avatars">
                  <div className="avatar avatar-1"></div>
                  <div className="avatar avatar-2"></div>
                  <div className="avatar avatar-3"></div>
                  <div className="avatar-more">+</div>
                </div>
                <div className="proof-text">
                  <span className="proof-number">2,000+</span>
                  <span className="proof-label">khách hàng hài lòng</span>
                </div>
              </div>
              <div className="proof-rating">
                <div className="rating-stars">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <span className="rating-text">4.9/5 đánh giá</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="hero-visual-container">
              <div className="visual-card main-card">
                <div className="card-header">
                  <div className="card-badge">Premium</div>
                  <div className="card-menu">
                    <div className="menu-dot"></div>
                    <div className="menu-dot"></div>
                    <div className="menu-dot"></div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="product-preview">
                    <div className="preview-image"></div>
                    <div className="preview-info">
                      <h4>Limited Collection</h4>
                      <p>Bộ sưu tập giới hạn</p>
                      <div className="preview-price">
                        <span className="price-current">850.000đ</span>
                        <span className="price-original">1.200.000đ</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="action-btn primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <button className="action-btn secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="visual-card accent-card">
                <div className="quality-indicator">
                  <div className="indicator-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="indicator-text">
                    <span className="indicator-title">Chất lượng</span>
                    <span className="indicator-subtitle">Đảm bảo</span>
                  </div>
                </div>
              </div>
              
              <div className="floating-elements">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;