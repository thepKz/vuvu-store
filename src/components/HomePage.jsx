import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import HeroSection from './HeroSection';
import ProductCarousel from './ProductCarousel';
import ProductGrid from './ProductGrid';
import Footer from './Footer';
import FloatingShapes from './FloatingShapes';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="homepage"
    >
      <FloatingShapes />
      <Header />
      <HeroSection />
      <ProductCarousel />
      <ProductGrid />
      <Footer />
    </motion.div>
  );
};

export default HomePage;