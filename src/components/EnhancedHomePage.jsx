import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import EnhancedHero from './EnhancedHero';
import FeaturedProducts from './FeaturedProducts';
import ProductCollections from './ProductCollections';
import CategoryNavigation from './CategoryNavigation';
import Footer from './Footer';

const EnhancedHomePage = ({ onNavigate, onProductSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="enhanced-homepage"
    >
      <Header currentPage="home" onNavigate={onNavigate} />
      
      {/* Enhanced Hero Section */}
      <EnhancedHero onNavigate={onNavigate} />
      
      {/* Category Navigation */}
      <CategoryNavigation 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onNavigate={onNavigate}
      />
      
      {/* Featured Products */}
      <FeaturedProducts 
        onNavigate={onNavigate} 
        onProductSelect={onProductSelect}
        category={selectedCategory}
      />
      
      {/* Product Collections */}
      <ProductCollections 
        onNavigate={onNavigate} 
        onProductSelect={onProductSelect}
      />
      
      <Footer />
    </motion.div>
  );
};

export default EnhancedHomePage;