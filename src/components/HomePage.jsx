import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import NewHeroSection from './NewHeroSection';
import PopMartProducts from './PopMartProducts';
import Footer from './Footer';

const HomePage = ({ onNavigate, onProductSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="homepage"
      style={{ width: '100%', minHeight: '100vh' }}
    >
      <Header currentPage="home" onNavigate={onNavigate} />
      <NewHeroSection onNavigate={onNavigate} />
      <PopMartProducts onNavigate={onNavigate} onProductSelect={onProductSelect} />
      <Footer />
    </motion.div>
  );
};

export default HomePage;