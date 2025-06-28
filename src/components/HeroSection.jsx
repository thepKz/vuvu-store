import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HeroSection.css';

const HeroSection = ({ onNavigate, onProductSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const handleExploreClick = () => {
    onNavigate('products');
  };

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
        <div className="floating-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
        </div>
      </div>
      
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.div className="hero-badge" variants={itemVariants}>
              <span className="badge-text">Chào mừng đến với thế giới squishy</span>
            </motion.div>
            
            <motion.h1 className="hero-title">
              <motion.span 
                className="title-main"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Dudu Taba
              </motion.span>
              <motion.span 
                className="title-accent"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Squishy Collection
              </motion.span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Khám phá bộ sưu tập squishy cao cấp được thiết kế đặc biệt cho những cô gái yêu thích 
              sự dễ thương và chất lượng. Mỗi sản phẩm đều mang đến cảm giác thư giãn tuyệt vời 
              và vẻ đẹp tinh tế.
            </motion.p>
            
            <motion.div className="hero-features" variants={itemVariants}>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Chất lượng cao cấp</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Thiết kế đáng yêu</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>An toàn tuyệt đối</span>
              </div>
            </motion.div>
            
            <motion.div className="hero-stats" variants={itemVariants}>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Sản phẩm độc quyền</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Khách hàng tin tưởng</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99%</span>
                <span className="stat-label">Đánh giá tích cực</span>
              </div>
            </motion.div>
            
            <motion.div className="hero-buttons" variants={itemVariants}>
              <motion.button
                className="btn btn-primary hero-cta"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleExploreClick}
              >
                <span className="btn-text">Khám phá bộ sưu tập</span>
                <div className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('about')}
              >
                <span className="btn-text">Tìm hiểu thêm</span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="hero-visual-container">
              <div className="visual-card main-card">
                <div className="card-content">
                  <div className="product-showcase">
                    <div className="showcase-item item-1">
                      <div className="item-image"></div>
                      <div className="item-info">
                        <h4>Premium Collection</h4>
                        <p>Bộ sưu tập cao cấp</p>
                      </div>
                    </div>
                    <div className="showcase-item item-2">
                      <div className="item-image"></div>
                      <div className="item-info">
                        <h4>Limited Edition</h4>
                        <p>Phiên bản giới hạn</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="visual-card accent-card">
                <div className="card-content">
                  <div className="quality-badge">
                    <div className="badge-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Chất lượng đảm bảo</span>
                  </div>
                </div>
              </div>
              
              <div className="visual-decorations">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;