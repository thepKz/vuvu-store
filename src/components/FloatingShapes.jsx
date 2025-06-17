import React from 'react';
import { motion } from 'framer-motion';
import '../styles/FloatingShapes.css';

const FloatingShapes = () => {
  const shapes = [
    {
      id: 1,
      type: 'blob',
      size: 80,
      color: 'linear-gradient(45deg, #ff6b9d, #ffa8cc)',
      position: { top: '10%', left: '5%' },
      animation: {
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 2,
      type: 'circle',
      size: 60,
      color: 'linear-gradient(45deg, #a8e6cf, #88d8a3)',
      position: { top: '20%', right: '8%' },
      animation: {
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.8, 0.6],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 3,
      type: 'square',
      size: 40,
      color: 'linear-gradient(45deg, #ffd93d, #ffb74d)',
      position: { top: '60%', left: '10%' },
      animation: {
        y: [0, -30, 0],
        rotate: [0, 180, 360],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 4,
      type: 'triangle',
      size: 50,
      color: '#ff9a9e',
      position: { top: '70%', right: '15%' },
      animation: {
        rotate: [0, 360],
        scale: [1, 1.3, 1],
        transition: {
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      }
    },
    {
      id: 5,
      type: 'heart',
      size: 35,
      color: '#ff6b9d',
      position: { top: '40%', right: '5%' },
      animation: {
        y: [0, -15, 0],
        x: [0, 5, 0],
        scale: [1, 1.2, 1],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 6,
      type: 'star',
      size: 45,
      color: '#ffa8cc',
      position: { top: '80%', left: '20%' },
      animation: {
        rotate: [0, 360],
        y: [0, -10, 0],
        transition: {
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      }
    }
  ];

  const renderShape = (shape) => {
    const baseStyle = {
      position: 'absolute',
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      background: shape.color,
      opacity: 0.7,
      zIndex: 1,
      ...shape.position
    };

    switch (shape.type) {
      case 'blob':
        return (
          <motion.div
            key={shape.id}
            className="floating-shape blob"
            style={{
              ...baseStyle,
              borderRadius: '50% 40% 60% 30%'
            }}
            animate={shape.animation}
          />
        );
      
      case 'circle':
        return (
          <motion.div
            key={shape.id}
            className="floating-shape circle"
            style={{
              ...baseStyle,
              borderRadius: '50%'
            }}
            animate={shape.animation}
          />
        );
      
      case 'square':
        return (
          <motion.div
            key={shape.id}
            className="floating-shape square"
            style={{
              ...baseStyle,
              borderRadius: '20%'
            }}
            animate={shape.animation}
          />
        );
      
      case 'triangle':
        return (
          <motion.div
            key={shape.id}
            className="floating-shape triangle"
            style={{
              ...baseStyle,
              background: shape.color,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
            animate={shape.animation}
          />
        );
      
      case 'heart':
        return (
          <motion.div
            key={shape.id}
            className="floating-shape heart"
            style={{
              ...baseStyle,
              transform: 'rotate(-45deg)'
            }}
            animate={shape.animation}
          >
            <div style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: shape.color,
              borderRadius: '50%',
              position: 'absolute',
              left: `-${shape.size/2}px`,
              top: '0'
            }} />
            <div style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: shape.color,
              borderRadius: '50%',
              position: 'absolute',
              right: '0',
              top: `-${shape.size/2}px`
            }} />
          </motion.div>
        );
      
      case 'star':
        return (
          <motion.div
            key={shape.id}
            className="floating-shape star"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
            animate={shape.animation}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="floating-shapes-container">
      {shapes.map(renderShape)}
      
      {/* Large background gradient blob */}
      <motion.div
        className="bg-gradient-blob"
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
          width: '300px',
          height: '300px',
          background: 'linear-gradient(45deg, rgba(255, 107, 157, 0.1), rgba(255, 168, 204, 0.1))',
          borderRadius: '30% 70% 70% 30%',
          zIndex: 0,
          opacity: 0.3
        }}
      />
    </div>
  );
};

export default FloatingShapes;