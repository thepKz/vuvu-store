import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import NewHeroSection from './NewHeroSection';
import CategoryNavigation from './CategoryNavigation';
import FeaturedProducts from './FeaturedProducts';
import ProductCollections from './ProductCollections';
import SearchComponent from './SearchComponent';
import Footer from './Footer';
import '../styles/EnhancedHomePage.css';

const EnhancedHomePage = ({ onNavigate, onProductSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="enhanced-homepage"
    >
      <Header currentPage="home" onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <NewHeroSection onNavigate={onNavigate} />
      
      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <motion.div
            className="search-container-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Tìm kiếm squishy yêu thích</h2>
            <SearchComponent 
              onProductSelect={onProductSelect} 
              onNavigate={onNavigate} 
            />
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNavigation 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
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