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

  const slideFromLeft = {
    hidden: { opacity: 0, x: -100, skewX: -10 },
    visible: {
      opacity: 1,
      x: 0,
      skewX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 100, skewX: 10 },
    visible: {
      opacity: 1,
      x: 0,
      skewX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const bounceIn = {
    hidden: { opacity: 0, scale: 0.3, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut"
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
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text" variants={slideFromLeft}>
            <motion.div 
              className="hero-badge"
              variants={bounceIn}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <span>✨ Chào mừng đến với thế giới squishy ✨</span>
            </motion.div>
            
            <motion.h1 className="hero-title">
              <motion.span 
                className="title-main"
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Dudu Taba
              </motion.span>
              <motion.span 
                className="title-accent"
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Squishy Store
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              variants={slideFromLeft}
              whileHover={{ scale: 1.02 }}
            >
              🌈 Khám phá thế giới squishy đầy màu sắc và vui nhộn! 
              Những món đồ chơi mềm mại, dễ thương sẽ mang lại niềm vui và thư giãn cho bạn. 
              Hãy cùng chúng tôi tạo ra những khoảnh khắc tuyệt vời! 🎉
            </motion.p>
            
            <motion.div className="hero-stats" variants={slideFromLeft}>
              {[
                { number: "500+", label: "Sản phẩm", icon: "🛍️" },
                { number: "10K+", label: "Khách hàng", icon: "👥" },
                { number: "99%", label: "Hài lòng", icon: "⭐" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <span className="stat-number">{stat.icon} {stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div className="hero-buttons" variants={slideFromLeft}>
              <motion.button
                className="btn btn-primary hero-cta"
                onClick={handleExploreClick}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 25px 50px rgba(255, 107, 157, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <motion.span
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🚀 Mua sắm ngay
                </motion.span>
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                onClick={() => onNavigate('about')}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  rotate: [0, -2, 2, 0]
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                📖 Tìm hiểu thêm
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            variants={slideFromRight}
          >
            <motion.div
              className="hero-visual-container"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <motion.div
                className="squishy-showcase"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {[
                  { emoji: "🧸", class: "squishy-1" },
                  { emoji: "🐱", class: "squishy-2" },
                  { emoji: "🐰", class: "squishy-3" },
                  { emoji: "🐻", class: "squishy-4" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className={`squishy-item ${item.class}`}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 1 + index * 0.2, 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{
                      scale: 1.4,
                      rotate: [0, -15, 15, 0],
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.emoji}
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="hero-visual-bg">
                <motion.div 
                  className="bg-circle bg-circle-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="bg-circle bg-circle-2"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 10,
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