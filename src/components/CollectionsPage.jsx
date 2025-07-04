import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/CollectionsPage.css';

import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';

const CollectionsPage = ({ onNavigate, onProductSelect }) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const collections = [
    {
      id: 'premium',
      name: 'Premium Collection',
      description: 'Bộ sưu tập cao cấp với chất liệu và thiết kế đặc biệt',
      image: lubu1,
      productCount: 8,
      priceRange: '500.000đ - 2.000.000đ',
      color: '#ec4899',
      products: [
        { 
          id: 1, 
          name: 'DIMOO Premium Gold', 
          price: '850.000đ', 
          image: lubu1,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567890',
          variants: [
            { id: 1, name: "Kích thước S", price: "850.000đ", stock: 5 },
            { id: 2, name: "Kích thước M", price: "950.000đ", stock: 3 }
          ],
          colors: [
            { id: 1, name: "Vàng", code: "#f59e0b" },
            { id: 2, name: "Bạc", code: "#94a3b8" }
          ],
          images: [lubu1, lubu2, lubu3]
        },
        { 
          id: 2, 
          name: 'MOLLY Premium Silver', 
          price: '750.000đ', 
          image: lubu2,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567891',
          variants: [
            { id: 1, name: "Kích thước S", price: "750.000đ", stock: 7 },
            { id: 2, name: "Kích thước M", price: "850.000đ", stock: 4 }
          ],
          colors: [
            { id: 1, name: "Bạc", code: "#94a3b8" },
            { id: 2, name: "Hồng", code: "#ff6b9d" }
          ],
          images: [lubu2, lubu3, lubu4]
        }
      ]
    },
    {
      id: 'limited',
      name: 'Limited Edition',
      description: 'Phiên bản giới hạn chỉ có tại Dudu Store',
      image: lubu2,
      productCount: 6,
      priceRange: '300.000đ - 1.500.000đ',
      color: '#f59e0b',
      products: [
        { 
          id: 3, 
          name: 'LABUBU Limited 2024', 
          price: '650.000đ', 
          image: lubu3,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567892',
          variants: [
            { id: 1, name: "Kích thước S", price: "650.000đ", stock: 3 },
            { id: 2, name: "Kích thước M", price: "750.000đ", stock: 1 }
          ],
          colors: [
            { id: 1, name: "Đỏ", code: "#ef4444" },
            { id: 2, name: "Xanh", code: "#0ea5e9" }
          ],
          images: [lubu3, lubu4, lubu1]
        },
        { 
          id: 4, 
          name: 'DIMOO Limited Spring', 
          price: '550.000đ', 
          image: lubu4,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567893',
          variants: [
            { id: 1, name: "Kích thước S", price: "550.000đ", stock: 4 },
            { id: 2, name: "Kích thước M", price: "650.000đ", stock: 2 }
          ],
          colors: [
            { id: 1, name: "Hồng", code: "#ff6b9d" },
            { id: 2, name: "Xanh lá", code: "#10b981" }
          ],
          images: [lubu4, lubu1, lubu2]
        }
      ]
    },
    {
      id: 'seasonal',
      name: 'Seasonal Collection',
      description: 'Bộ sưu tập theo mùa với thiết kế thời thượng',
      image: lubu3,
      productCount: 12,
      priceRange: '200.000đ - 800.000đ',
      color: '#10b981',
      products: [
        { 
          id: 5, 
          name: 'Summer Vibes MOLLY', 
          price: '450.000đ', 
          image: lubu1,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567894',
          variants: [
            { id: 1, name: "Kích thước S", price: "450.000đ", stock: 8 },
            { id: 2, name: "Kích thước M", price: "550.000đ", stock: 5 }
          ],
          colors: [
            { id: 1, name: "Vàng", code: "#f59e0b" },
            { id: 2, name: "Xanh biển", code: "#0ea5e9" }
          ],
          images: [lubu1, lubu3, lubu4]
        },
        { 
          id: 6, 
          name: 'Spring Bloom DIMOO', 
          price: '380.000đ', 
          image: lubu2,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567895',
          variants: [
            { id: 1, name: "Kích thước S", price: "380.000đ", stock: 6 },
            { id: 2, name: "Kích thước M", price: "480.000đ", stock: 3 }
          ],
          colors: [
            { id: 1, name: "Hồng", code: "#ff6b9d" },
            { id: 2, name: "Xanh lá", code: "#10b981" }
          ],
          images: [lubu2, lubu4, lubu1]
        }
      ]
    },
    {
      id: 'classic',
      name: 'Classic Collection',
      description: 'Bộ sưu tập kinh điển với những mẫu mã được yêu thích',
      image: lubu4,
      productCount: 15,
      priceRange: '150.000đ - 600.000đ',
      color: '#8b5cf6',
      products: [
        { 
          id: 7, 
          name: 'Classic LABUBU', 
          price: '320.000đ', 
          image: lubu3,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567896',
          variants: [
            { id: 1, name: "Kích thước S", price: "320.000đ", stock: 10 },
            { id: 2, name: "Kích thước M", price: "420.000đ", stock: 7 }
          ],
          colors: [
            { id: 1, name: "Đen", code: "#1f2937" },
            { id: 2, name: "Trắng", code: "#f9fafb" }
          ],
          images: [lubu3, lubu2, lubu1]
        },
        { 
          id: 8, 
          name: 'Vintage MOLLY', 
          price: '280.000đ', 
          image: lubu4,
          shopeeUrl: 'https://shopee.vn/product/123456789/1234567897',
          variants: [
            { id: 1, name: "Kích thước S", price: "280.000đ", stock: 12 },
            { id: 2, name: "Kích thước M", price: "380.000đ", stock: 8 }
          ],
          colors: [
            { id: 1, name: "Nâu", code: "#92400e" },
            { id: 2, name: "Xám", code: "#6b7280" }
          ],
          images: [lubu4, lubu3, lubu2]
        }
      ]
    }
  ];

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    // Scroll to top when selecting a collection
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product) => {
    onProductSelect(product);
    onNavigate('product-detail');
    // Scroll to top when navigating to product detail
    window.scrollTo(0, 0);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    // Scroll to top when going back to collections
    window.scrollTo(0, 0);
  };

  if (selectedCollection) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="collection-detail-page"
      >
        <Header currentPage="collections" onNavigate={onNavigate} />
        
        <main className="collection-detail-main">
          <div className="container">
            <motion.nav 
              className="breadcrumb"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button onClick={() => onNavigate('home')}>Trang chủ</button>
              <span>/</span>
              <button onClick={handleBackToCollections}>Bộ sưu tập</button>
              <span>/</span>
              <span>{selectedCollection.name}</span>
            </motion.nav>

            <motion.div 
              className="collection-hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ '--collection-color': selectedCollection.color }}
            >
              <div className="collection-hero-content">
                <h1>{selectedCollection.name}</h1>
                <p>{selectedCollection.description}</p>
                <div className="collection-stats">
                  <span>{selectedCollection.productCount} sản phẩm</span>
                  <span>{selectedCollection.priceRange}</span>
                </div>
              </div>
              <div className="collection-hero-image">
                <img src={selectedCollection.image} alt={selectedCollection.name} />
              </div>
            </motion.div>

            <div className="collection-products">
              <h2>Sản phẩm trong bộ sưu tập</h2>
              <div className="products-grid">
                {selectedCollection.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="product-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleProductClick(product)}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <div className="product-image">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">{product.price}</p>
                      <button className="product-detail-btn">Chi tiết sản phẩm</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Scroll to top button */}
        {isVisible && (
          <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⬆️
          </motion.button>
        )}

        <Footer />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="collections-page"
    >
      <Header currentPage="collections" onNavigate={onNavigate} />
      
      <main className="collections-main">
        <section className="collections-hero">
          <div className="container">
            <motion.div
              className="collections-hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1>Bộ sưu tập Dudu Store</h1>
              <p>Khám phá các bộ sưu tập đặc biệt được tuyển chọn kỹ lưỡng</p>
            </motion.div>
          </div>
        </section>

        <section className="collections-grid-section">
          <div className="container">
            <div className="collections-grid">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  className="collection-card"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleCollectionClick(collection)}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  style={{ '--collection-color': collection.color }}
                >
                  <div className="collection-image">
                    <img src={collection.image} alt={collection.name} />
                    <div className="collection-overlay">
                      <button className="explore-btn">Khám phá</button>
                    </div>
                  </div>
                  <div className="collection-info">
                    <h3>{collection.name}</h3>
                    <p>{collection.description}</p>
                    <div className="collection-meta">
                      <span>{collection.productCount} sản phẩm</span>
                      <span>{collection.priceRange}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Scroll to top button */}
      {isVisible && (
        <motion.button
          className="scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⬆️
        </motion.button>
      )}

      <Footer />
    </motion.div>
  );
};

export default CollectionsPage;