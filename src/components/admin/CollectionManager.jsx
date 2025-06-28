import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../styles/CollectionManager.css';

const CollectionManager = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for collections
  const mockCollections = [
    {
      id: 'premium',
      name: 'Premium Collection',
      description: 'Bộ sưu tập cao cấp với chất liệu và thiết kế đặc biệt',
      image: 'https://via.placeholder.com/300x200?text=Premium',
      productCount: 8,
      color: '#ec4899',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-06-20T14:45:00Z'
    },
    {
      id: 'limited',
      name: 'Limited Edition',
      description: 'Phiên bản giới hạn chỉ có tại Dudu Store',
      image: 'https://via.placeholder.com/300x200?text=Limited',
      productCount: 6,
      color: '#f59e0b',
      createdAt: '2025-02-10T09:15:00Z',
      updatedAt: '2025-06-18T11:20:00Z'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Collection',
      description: 'Bộ sưu tập theo mùa với thiết kế thời thượng',
      image: 'https://via.placeholder.com/300x200?text=Seasonal',
      productCount: 12,
      color: '#10b981',
      createdAt: '2025-03-05T14:20:00Z',
      updatedAt: '2025-06-15T16:30:00Z'
    },
    {
      id: 'classic',
      name: 'Classic Collection',
      description: 'Bộ sưu tập kinh điển với những mẫu mã được yêu thích',
      image: 'https://via.placeholder.com/300x200?text=Classic',
      productCount: 15,
      color: '#8b5cf6',
      createdAt: '2025-01-20T11:45:00Z',
      updatedAt: '2025-06-10T09:30:00Z'
    }
  ];

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
          setCollections(mockCollections);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, []);

  // Filter collections based on search term
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle view collection
  const handleViewCollection = (collection) => {
    setSelectedCollection(collection);
  };

  // Handle edit collection
  const handleEditCollection = (collection) => {
    setSelectedCollection(collection);
    setIsEditing(true);
  };

  // Handle delete collection
  const handleDeleteCollection = (collectionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) {
      // Simulate API call
      setCollections(collections.filter(c => c.id !== collectionId));
    }
  };

  // Handle create new collection
  const handleCreateCollection = () => {
    setIsCreating(true);
    setSelectedCollection(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedCollection(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Save collection
  const handleSaveCollection = (formData) => {
    if (isCreating) {
      // Simulate creating new collection
      const newCollection = {
        id: `collection-${Date.now()}`,
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCollections([...collections, newCollection]);
    } else if (isEditing && selectedCollection) {
      // Simulate updating collection
      setCollections(collections.map(c => 
        c.id === selectedCollection.id ? { ...c, ...formData, updatedAt: new Date().toISOString() } : c
      ));
    }
    
    handleCloseModal();
  };

  return (
    <motion.div
      className="collection-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="manager-header">
        <h1>Quản lý bộ sưu tập</h1>
        <div className="header-actions">
          <button 
            className="add-collection-btn"
            onClick={handleCreateCollection}
          >
            <span>+</span> Thêm bộ sưu tập
          </button>
        </div>
      </div>
      
      <div className="search-bar">
        <input 
          type="text"
          placeholder="Tìm kiếm bộ sưu tập..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải bộ sưu tập...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải bộ sưu tập: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>Không tìm thấy bộ sưu tập</h3>
          <p>Hãy tạo bộ sưu tập mới hoặc thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="collections-grid">
          {filteredCollections.map(collection => (
            <div 
              key={collection.id}
              className="collection-card"
              style={{ '--collection-color': collection.color }}
            >
              <div className="collection-image">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
              <div className="collection-content">
                <h3>{collection.name}</h3>
                <p className="collection-description">{collection.description}</p>
                <div className="collection-meta">
                  <span className="product-count">{collection.productCount} sản phẩm</span>
                  <span className="date">Cập nhật: {formatDate(collection.updatedAt)}</span>
                </div>
              </div>
              <div className="collection-actions">
                <button 
                  className="view-btn"
                  onClick={() => handleViewCollection(collection)}
                >
                  Xem
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => handleEditCollection(collection)}
                >
                  Sửa
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteCollection(collection.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Collection Modal */}
      {(selectedCollection || isCreating) && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="collection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isCreating ? 'Thêm bộ sưu tập mới' : isEditing ? 'Chỉnh sửa bộ sưu tập' : 'Chi tiết bộ sưu tập'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
            </div>
            
            <div className="modal-body">
              {isEditing || isCreating ? (
                <CollectionForm 
                  collection={selectedCollection}
                  onSave={handleSaveCollection}
                  onCancel={handleCloseModal}
                />
              ) : selectedCollection && (
                <CollectionDetail collection={selectedCollection} />
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Collection Form Component
const CollectionForm = ({ collection, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    image: collection?.image || '',
    color: collection?.color || '#ec4899'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="collection-form">
      <div className="form-group">
        <label htmlFor="name">Tên bộ sưu tập</label>
        <input 
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea 
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="image">URL hình ảnh</label>
        <input 
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="color">Màu sắc</label>
        <div className="color-picker">
          <input 
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
          <span className="color-value">{formData.color}</span>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="save-btn">
          Lưu
        </button>
      </div>
    </form>
  );
};

// Collection Detail Component
const CollectionDetail = ({ collection }) => {
  return (
    <div className="collection-detail">
      <div className="detail-header">
        <div className="detail-image">
          <img 
            src={collection.image} 
            alt={collection.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
        <div className="detail-info">
          <h3>{collection.name}</h3>
          <p className="detail-description">{collection.description}</p>
          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Sản phẩm:</span>
              <span className="meta-value">{collection.productCount}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Màu sắc:</span>
              <span className="color-preview" style={{ backgroundColor: collection.color }}></span>
              <span className="meta-value">{collection.color}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Ngày tạo:</span>
              <span className="meta-value">{formatDate(collection.createdAt)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Cập nhật:</span>
              <span className="meta-value">{formatDate(collection.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="detail-section">
        <h4>Sản phẩm trong bộ sưu tập</h4>
        <p className="empty-products">Chưa có dữ liệu sản phẩm</p>
      </div>
    </div>
  );
};

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default CollectionManager;