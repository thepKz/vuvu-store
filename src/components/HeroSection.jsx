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
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
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
              <span>✨ Chào mừng đến với</span>
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
                Squishy Store
              </motion.span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Khám phá thế giới squishy đầy màu sắc và vui nhộn! 
              Những món đồ chơi mềm mại, dễ thương sẽ mang lại niềm vui và thư giãn cho bạn.
            </motion.p>
            
            <motion.div className="hero-stats" variants={itemVariants}>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Sản phẩm</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Khách hàng</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99%</span>
                <span className="stat-label">Hài lòng</span>
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
                <motion.span
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🛍️ Mua sắm ngay
                </motion.span>
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('about')}
              >
                📖 Tìm hiểu thêm
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="hero-visual-container"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="squishy-showcase">
                <motion.div 
                  className="squishy-item squishy-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🧸
                </motion.div>
                <motion.div 
                  className="squishy-item squishy-2"
                  animate={{
                    scale: [1, 1.1, 1],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  🐱
                </motion.div>
                <motion.div 
                  className="squishy-item squishy-3"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, -15, 15, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  🐰
                </motion.div>
                <motion.div 
                  className="squishy-item squishy-4"
                  animate={{
                    scale: [1, 1.3, 1],
                    y: [0, -15, 0]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                >
                  🐻
                </motion.div>
              </div>
              
              <div className="hero-visual-bg">
                <motion.div 
                  className="bg-circle bg-circle-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="bg-circle bg-circle-2"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;