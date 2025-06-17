import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const textVariants = {
    hidden: { 
      opacity: 0, 
      x: -100 
    },
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
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      x: -50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.h1
          className="hero-title"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Dudu Taba Squishy
        </motion.h1>
        
        <motion.p
          className="hero-subtitle"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Khám phá thế giới squishy đầy màu sắc và vui nhộn! 
          Những món đồ chơi mềm mại, dễ thương sẽ mang lại niềm vui cho bạn.
        </motion.p>
        
        <motion.button
          className="hero-cta"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
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
            Khám phá ngay! ✨
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;