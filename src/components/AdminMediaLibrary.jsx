import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';

const AdminMediaLibrary = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Giả lập dữ liệu thư viện media
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setTimeout(() => {
      const mockMediaItems = Array.from({ length: 20 }, (_, i) => ({
        id: `media-${i + 1}`,
        url: `https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1`,
        name: `squishy-image-${i + 1}.jpg`,
        type: 'image/jpeg',
        size: Math.floor(Math.random() * 1000000) + 100000, // 100KB - 1MB
        dimensions: '1200x1200',
        folder: i % 3 === 0 ? 'products' : i % 3 === 1 ? 'categories' : 'collections',
        uploaded_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        public_id: `dudu-store/${i % 3 === 0 ? 'products' : i % 3 === 1 ? 'categories' : 'collections'}/squishy-image-${i + 1}`
      }));
      
      setMediaItems(mockMediaItems);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Định dạng kích thước file
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Xử lý upload file
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Giả lập quá trình upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Thêm file mới vào danh sách
            const newMediaItems = Array.from(files).map((file, index) => ({
              id: `media-new-${Date.now()}-${index}`,
              url: URL.createObjectURL(file),
              name: file.name,
              type: file.type,
              size: file.size,
              dimensions: '1200x1200', // Giả định
              folder: currentFolder === 'all' ? 'products' : currentFolder,
              uploaded_at: new Date().toISOString(),
              public_id: `dudu-store/${currentFolder === 'all' ? 'products' : currentFolder}/${file.name}`
            }));
            
            setMediaItems(prev => [...newMediaItems, ...prev]);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Xử lý kéo thả file
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files.length) return;
    
    // Giả lập upload file
    setIsUploading(true);
    setUploadProgress(0);
    
    // Giả lập quá trình upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Thêm file mới vào danh sách
            const newMediaItems = Array.from(files).map((file, index) => ({
              id: `media-new-${Date.now()}-${index}`,
              url: URL.createObjectURL(file),
              name: file.name,
              type: file.type,
              size: file.size,
              dimensions: '1200x1200', // Giả định
              folder: currentFolder === 'all' ? 'products' : currentFolder,
              uploaded_at: new Date().toISOString(),
              public_id: `dudu-store/${currentFolder === 'all' ? 'products' : currentFolder}/${file.name}`
            }));
            
            setMediaItems(prev => [...newMediaItems, ...prev]);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Xử lý xem chi tiết media
  const handleViewMedia = (media) => {
    setSelectedMedia(media);
    setShowMediaModal(true);
  };

  // Xử lý xóa media
  const handleDeleteMedia = (mediaId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa file media này?')) {
      // Trong thực tế, đây sẽ là API call
      setMediaItems(mediaItems.filter(item => item.id !== mediaId));
    }
  };

  // Xử lý sao chép URL
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Đã sao chép URL vào clipboard!');
      })
      .catch(err => {
        console.error('Không thể sao chép URL: ', err);
      });
  };

  // Lọc media theo folder
  const filteredMedia = mediaItems.filter(item => {
    // Lọc theo folder
    if (currentFolder !== 'all' && item.folder !== currentFolder) {
      return false;
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Thư viện media</h1>
        <p className="page-description">Quản lý hình ảnh và tệp đa phương tiện</p>
      </div>

      <div className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tìm kiếm</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tìm kiếm theo tên file..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Thư mục</label>
            <select 
              className="form-select"
              value={currentFolder}
              onChange={(e) => setCurrentFolder(e.target.value)}
            >
              <option value="all">Tất cả thư mục</option>
              <option value="products">Sản phẩm</option>
              <option value="categories">Danh mục</option>
              <option value="collections">Bộ sưu tập</option>
            </select>
          </div>
        </div>
      </div>

      <div 
        className="form-card"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="media-upload">
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }}
            multiple
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
            <div className="upload-icon">📤</div>
            <div className="upload-text">Kéo thả file vào đây hoặc click để chọn file</div>
            {isUploading && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${uploadProgress}%`, 
                      backgroundColor: '#a855f7', 
                      height: '100%',
                      transition: 'width 0.2s ease'
                    }}
                  ></div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                  Đang tải lên... {uploadProgress}%
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="form-card">
        <div className="form-section-title">Thư viện hình ảnh</div>
        
        {isLoading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : (
          <>
            {filteredMedia.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                Không tìm thấy file media nào
              </div>
            ) : (
              <div className="media-grid">
                {filteredMedia.map((media) => (
                  <div key={media.id} className="media-item">
                    <img src={media.url} alt={media.name} />
                    <div className="media-overlay">
                      <div 
                        className="media-action"
                        onClick={() => handleViewMedia(media)}
                      >
                        🔍
                      </div>
                      <div 
                        className="media-action"
                        onClick={() => handleCopyUrl(media.url)}
                      >
                        📋
                      </div>
                      <div 
                        className="media-action"
                        onClick={() => handleDeleteMedia(media.id)}
                      >
                        🗑️
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal xem chi tiết media */}
      {showMediaModal && selectedMedia && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Chi tiết media</h2>
              <button 
                className="modal-close"
                onClick={() => setShowMediaModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 300px' }}>
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.name} 
                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Tên file</div>
                    <div>{selectedMedia.name}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Loại file</div>
                    <div>{selectedMedia.type}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Kích thước</div>
                    <div>{formatFileSize(selectedMedia.size)}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Kích thước ảnh</div>
                    <div>{selectedMedia.dimensions}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Thư mục</div>
                    <div>{selectedMedia.folder}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Ngày tải lên</div>
                    <div>{formatDate(selectedMedia.uploaded_at)}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Public ID</div>
                    <div>{selectedMedia.public_id}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>URL</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={selectedMedia.url} 
                        readOnly 
                        style={{ 
                          flex: '1', 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
                          border: '1px solid #d1d5db',
                          fontSize: '0.875rem'
                        }}
                      />
                      <button 
                        className="admin-btn btn-primary"
                        onClick={() => handleCopyUrl(selectedMedia.url)}
                      >
                        Sao chép
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="admin-btn btn-danger"
                onClick={() => {
                  handleDeleteMedia(selectedMedia.id);
                  setShowMediaModal(false);
                }}
              >
                Xóa
              </button>
              <button 
                className="admin-btn btn-secondary"
                onClick={() => setShowMediaModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminMediaLibrary;