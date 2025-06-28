import React from 'react';
import { motion } from 'framer-motion';
import '../styles/FloatingShapes.css';

const FloatingShapes = () => {
  const shapes = [
    {
      id: 1,
      type: 'circle',
      size: 120,
      color: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(190, 24, 93, 0.05))',
      position: { top: '10%', left: '5%' },
      animation: {
        y: [0, -30, 0],
        scale: [1, 1.1, 1],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 2,
      type: 'circle',
      size: 80,
      color: 'linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 105, 180, 0.1))',
      position: { top: '20%', right: '8%' },
      animation: {
        y: [0, 25, 0],
        x: [0, 15, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }
      }
    },
    {
      id: 3,
      type: 'circle',
      size: 60,
      color: 'linear-gradient(135deg, rgba(252, 231, 243, 0.8), rgba(249, 168, 212, 0.4))',
      position: { top: '60%', left: '10%' },
      animation: {
        y: [0, -20, 0],
        scale: [1, 1.2, 1],
        transition: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }
      }
    },
    {
      id: 4,
      type: 'circle',
      size: 100,
      color: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(190, 24, 93, 0.04))',
      position: { top: '70%', right: '15%' },
      animation: {
        y: [0, -35, 0],
        x: [0, -10, 0],
        transition: {
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }
      }
    },
    {
      id: 5,
      type: 'circle',
      size: 40,
      color: 'linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(255, 105, 180, 0.15))',
      position: { top: '40%', right: '5%' },
      animation: {
        y: [0, 15, 0],
        scale: [1, 1.3, 1],
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }
      }
    },
    {
      id: 6,
      type: 'circle',
      size: 70,
      color: 'linear-gradient(135deg, rgba(252, 231, 243, 0.6), rgba(249, 168, 212, 0.3))',
      position: { top: '80%', left: '20%' },
      animation: {
        y: [0, -25, 0],
        x: [0, 20, 0],
        transition: {
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
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
      borderRadius: '50%',
      opacity: 0.7,
      zIndex: 1,
      filter: 'blur(0.5px)',
      ...shape.position
    };

    return (
      <motion.div
        key={shape.id}
        className="floating-shape"
        style={baseStyle}
        animate={shape.animation}
      />
    );
  };

  return (
    <div className="floating-shapes-container">
      {shapes.map(renderShape)}
      
      {/* Large background gradient elements */}
      <motion.div
        className="bg-gradient-element element-1"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(190, 24, 93, 0.02))',
          borderRadius: '50%',
          zIndex: 0,
          filter: 'blur(2px)'
        }}
      />
      
      <motion.div
        className="bg-gradient-element element-2"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.08), rgba(255, 105, 180, 0.04))',
          borderRadius: '50%',
          zIndex: 0,
          filter: 'blur(3px)'
        }}
      />
    </div>
  );
};

export default FloatingShapes;