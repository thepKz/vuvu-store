import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../styles/FeaturedProducts.css';

import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';
import lubu5 from '../images/lubu5.jpg';
import lubu6 from '../images/lubu6.jpg';

const FeaturedProducts = ({ onNavigate, onProductSelect, category }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const allProducts = [
    {
      id: 1,
      image: lubu1,
      name: "DIMOO Premium Collection",
      description: "Bộ sưu tập cao cấp với thiết kế độc đáo",
      price: "230.000đ",
      originalPrice: null,
      badge: "Premium",
      category: "dimoo",
      rating: 4.9,
      isNew: true,
      isFeatured: true
    },
    {
      id: 2,
      image: lubu2,
      name: "DIMOO Limited Edition",
      description: "Phiên bản giới hạn chỉ có tại Dudu Store",
      price: "253.000đ",
      originalPrice: null,
      badge: "Limited",
      category: "dimoo",
      rating: 4.8,
      isHot: true,
      isFeatured: true
    },
    {
      id: 3,
      image: lubu3,
      name: "MOLLY Exclusive Series",
      description: "Series độc quyền với chất liệu cao cấp",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "molly",
      rating: 4.7,
      isSale: true,
      isFeatured: true
    },
    {
      id: 4,
      image: lubu4,
      name: "MOLLY Deluxe Collection",
      description: "Bộ sưu tập deluxe với packaging đặc biệt",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "molly",
      rating: 4.9,
      isSale: true,
      isFeatured: true
    },
    {
      id: 5,
      image: lubu5,
      name: "LABUBU Special Edition",
      description: "Phiên bản đặc biệt với màu sắc độc đáo",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Special",
      category: "labubu",
      rating: 4.8,
      isSpecial: true,
      isFeatured: true
    },
    {
      id: 6,
      image: lubu6,
      name: "LABUBU Collector Series",
      description: "Series sưu tập dành cho collector",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Collector",
      category: "labubu",
      rating: 4.6,
      isCollector: true,
      isFeatured: true
    }
  ];

  const filteredProducts = category === 'all' 
    ? allProducts.filter(p => p.isFeatured)
    : allProducts.filter(p => p.category === category && p.isFeatured);

  const handleProductClick = (product) => {
    onProductSelect(product);
    onNavigate('product-detail');
    window.scrollTo(0, 0);
  };

  const handleImageView = (imageUrl, productName, e) => {
    e.stopPropagation();
    window.open(imageUrl, '_blank');
  };

  return (
    <section className="featured-products" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">
            <span className="badge-icon">⭐</span>
            <span>Sản phẩm nổi bật</span>
          </div>
          <h2>Bộ sưu tập đặc biệt</h2>
          <p>Những sản phẩm được yêu thích nhất tại Dudu Store</p>
        </motion.div>
        
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="featured-product-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Badges */}
              <div className="product-badges">
                {product.badge && (
                  <motion.div 
                    className={`product-badge badge-${product.badge.toLowerCase()}`}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  >
                    {product.badge}
                  </motion.div>
                )}
                {product.isNew && (
                  <div className="status-badge new">New</div>
                )}
                {product.isHot && (
                  <div className="status-badge hot">🔥 Hot</div>
                )}
              </div>
              
              {/* Product Image */}
              <div className="product-image-container">
                <motion.img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                
                {/* Image Overlay */}
                <motion.div 
                  className="image-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="view-image-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleImageView(product.image, product.name, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Xem ảnh
                  </motion.button>
                  
                  <motion.button
                    className="quick-view-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Xem nhanh
                  </motion.button>
                </motion.div>

                {/* Product Glow Effect */}
                <div className="product-glow"></div>
              </div>
              
              {/* Product Info */}
              <div className="product-info">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'filled' : ''}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="rating-value">({product.rating})</span>
                  </div>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-price">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="discount-percent">
                      -{Math.round((1 - parseInt(product.price.replace(/\D/g, '')) / parseInt(product.originalPrice.replace(/\D/g, ''))) * 100)}%
                    </span>
                  )}
                </div>
                
                <div className="product-actions">
                  <motion.button
                    className="add-to-cart-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Thêm vào giỏ
                  </motion.button>
                  
                  <motion.button
                    className="wishlist-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ♡
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="section-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="view-all-products-btn"
            onClick={() => onNavigate('products')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🛍️</span>
            Xem tất cả sản phẩm
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;