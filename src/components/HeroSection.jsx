import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HeroSection.css';

const HeroSection = () => {
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

  return (
    <section className="hero" id="home">
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 className="hero-title">
              <span className="title-main">Dudu Taba</span>
              <span className="title-accent">Squishy</span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Khám phá thế giới squishy đầy màu sắc và vui nhộn! 
              Những món đồ chơi mềm mại, dễ thương sẽ mang lại niềm vui cho bạn.
            </motion.p>
            
            <motion.div className="hero-buttons" variants={itemVariants}>
              <motion.button
                className="btn btn-primary hero-cta"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
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
                  Khám phá ngay ✨
                </motion.span>
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem bộ sưu tập
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="hero-image-container"
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
                <div className="squishy-item squishy-1">🧸</div>
                <div className="squishy-item squishy-2">🐱</div>
                <div className="squishy-item squishy-3">🐰</div>
                <div className="squishy-item squishy-4">🐻</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;