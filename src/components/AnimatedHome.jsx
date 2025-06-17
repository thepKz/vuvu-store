import React from 'react';
import { motion } from 'framer-motion';
import AnimatedHeader from './AnimatedHeader';
import HeroSection from './HeroSection';
import AnimatedCarousel from './AnimatedCarousel';
import ProductGrid from './ProductGrid';
import AnimatedFooter from './AnimatedFooter';
import FloatingElements from './FloatingElements';

const AnimatedHome = () => {
  return (
    <motion.div 
      className="animated-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FloatingElements />
      <AnimatedHeader />
      
      <main>
        <HeroSection />
        
        <div className="banner">
          <AnimatedCarousel />
        </div>
        
        <ProductGrid />
      </main>
      
      <AnimatedFooter />
    </motion.div>
  );
};

export default AnimatedHome;