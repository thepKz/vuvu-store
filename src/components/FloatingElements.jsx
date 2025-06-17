import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const bounceVariants = {
    animate: {
      y: [0, -30, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="floating-elements">
      {/* Squishy Blob 1 */}
      <motion.div
        className="floating-blob blob-1"
        variants={floatingVariants}
        animate="animate"
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, #ff6b9d, #ffa8cc)',
          borderRadius: '50% 40% 60% 30%',
          zIndex: 1,
          opacity: 0.7
        }}
      />

      {/* Squishy Blob 2 */}
      <motion.div
        className="floating-blob blob-2"
        variants={pulseVariants}
        animate="animate"
        style={{
          position: 'absolute',
          top: '20%',
          right: '8%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, #a8e6cf, #88d8a3)',
          borderRadius: '60% 40% 30% 70%',
          zIndex: 1,
          opacity: 0.6
        }}
      />

      {/* Bouncing Circle */}
      <motion.div
        className="floating-circle"
        variants={bounceVariants}
        animate="animate"
        style={{
          position: 'absolute',
          top: '60%',
          left: '10%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, #ffd93d, #ffb74d)',
          borderRadius: '50%',
          zIndex: 1,
          opacity: 0.8
        }}
      />

      {/* Floating Star */}
      <motion.div
        className="floating-star"
        animate={{
          rotate: 360,
          scale: [1, 1.3, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          width: '30px',
          height: '30px',
          background: '#ff9a9e',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          zIndex: 1,
          opacity: 0.7
        }}
      />

      {/* Large Background Blob */}
      <motion.div
        className="bg-blob"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(45deg, rgba(255, 107, 157, 0.1), rgba(255, 168, 204, 0.1))',
          borderRadius: '30% 70% 70% 30%',
          zIndex: 0,
          opacity: 0.3
        }}
      />

      {/* Small Floating Hearts */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`floating-heart heart-${i}`}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
          style={{
            position: 'absolute',
            top: `${40 + i * 15}%`,
            left: `${80 + i * 5}%`,
            width: '20px',
            height: '20px',
            background: '#ff6b9d',
            transform: 'rotate(-45deg)',
            zIndex: 1,
            opacity: 0.6
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            background: '#ff6b9d',
            borderRadius: '50%',
            position: 'absolute',
            left: '-10px',
            top: '0'
          }} />
          <div style={{
            width: '20px',
            height: '20px',
            background: '#ff6b9d',
            borderRadius: '50%',
            position: 'absolute',
            right: '0',
            top: '-10px'
          }} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;