import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ShopeeProductCard.css';

const ShopeeProductCard = ({ product, onViewDetails }) => {
  const handleShopeeRedirect = (e) => {
    e.stopPropagation();
    if (product.shopeeUrl) {
      window.open(product.shopeeUrl, '_blank');
    } else {
      alert('Liên kết Shopee không có sẵn cho sản phẩm này');
    }
  };

  return (
    <motion.div
      className="shopee-product-card"
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      onClick={() => onViewDetails(product)}
    >
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
          }}
        />
        
        {product.badge && (
          <div className={`product-badge badge-${product.badge.toLowerCase()}`}>
            {product.badge}
          </div>
        )}
        
        <div className="product-overlay">
          <motion.button
            className="view-details-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewDetails(product)}
          >
            🔍 Xem chi tiết
          </motion.button>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price">
          {product.originalPrice && (
            <span className="original-price">{product.originalPrice}</span>
          )}
          <span className="current-price">{product.price}</span>
        </div>
        
        <motion.button
          className="shopee-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShopeeRedirect}
        >
          🛒 Mua trên Shopee
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShopeeProductCard;