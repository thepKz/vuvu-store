import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';
import '../styles/MediaLibrary.css';
import { uploadImage, getMediaLibrary, deleteImage } from '../services/cloudinaryService';

const AdminMediaLibrary = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Fetch media items
  const fetchMediaItems = useCallback(async (folder = 'all', cursor = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const folderPath = folder === 'all' ? 'dudu-store' : `dudu-store/${folder}`;
      const result = await getMediaLibrary({
        folder: folderPath,
        max_results: 30,
        next_cursor: cursor
      });
      
      const formattedItems = result.resources.map(resource => ({
        id: resource.public_id,
        url: resource.secure_url,
        name: resource.public_id.split('/').pop(),
        type: resource.resource_type,
        format: resource.format,
        size: resource.bytes,
        width: resource.width,
        height: resource.height,
        folder: resource.folder.split('/').pop(),
        created_at: resource.created_at,
        public_id: resource.public_id
      }));
      
      if (cursor) {
        setMediaItems(prev => [...prev, ...formattedItems]);
      } else {
        setMediaItems(formattedItems);
      }
      
      setNextCursor(result.next_cursor);
      setHasMore(!!result.next_cursor);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError(err.message || 'Lỗi khi tải thư viện media');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMediaItems(currentFolder);
  }, [currentFolder, fetchMediaItems]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000); // Cloudinary returns Unix timestamp
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedItems = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const folder = currentFolder === 'all' ? 'products' : currentFolder;
        
        // Update progress
        setUploadProgress(Math.round((i / files.length) * 100));
        
        // Upload file
        const result = await uploadImage(file, folder);
        
        uploadedItems.push({
          id: result.public_id,
          url: result.secure_url,
          name: result.public_id.split('/').pop(),
          type: result.resource_type,
          format: result.format,
          size: result.bytes,
          width: result.width,
          height: result.height,
          folder: result.folder.split('/').pop(),
          created_at: Math.floor(Date.now() / 1000), // Current timestamp in seconds
          public_id: result.public_id
        });
      }
      
      // Add new items to the list
      setMediaItems(prev => [...uploadedItems, ...prev]);
      setUploadProgress(100);
      
      // Reset upload state after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err.message || 'Lỗi khi tải lên file');
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedItems = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const folder = currentFolder === 'all' ? 'products' : currentFolder;
        
        // Update progress
        setUploadProgress(Math.round((i / files.length) * 100));
        
        // Upload file
        const result = await uploadImage(file, folder);
        
        uploadedItems.push({
          id: result.public_id,
          url: result.secure_url,
          name: result.public_id.split('/').pop(),
          type: result.resource_type,
          format: result.format,
          size: result.bytes,
          width: result.width,
          height: result.height,
          folder: result.folder.split('/').pop(),
          created_at: Math.floor(Date.now() / 1000), // Current timestamp in seconds
          public_id: result.public_id
        });
      }
      
      // Add new items to the list
      setMediaItems(prev => [...uploadedItems, ...prev]);
      setUploadProgress(100);
      
      // Reset upload state after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err.message || 'Lỗi khi tải lên file');
      setIsUploading(false);
    }
  };

  // Handle view media details
  const handleViewMedia = (media) => {
    setSelectedMedia(media);
    setShowMediaModal(true);
  };

  // Handle delete media
  const handleDeleteMedia = async (publicId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa file này?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Delete from Cloudinary
      await deleteImage(publicId);
      
      // Update local state
      setMediaItems(prev => prev.filter(item => item.public_id !== publicId));
      
      // Close modal if open
      if (selectedMedia && selectedMedia.public_id === publicId) {
        setShowMediaModal(false);
        setSelectedMedia(null);
      }
      
      alert('Đã xóa file thành công');
    } catch (err) {
      console.error('Error deleting media:', err);
      setError(err.message || 'Lỗi khi xóa file');
      alert('Lỗi khi xóa file: ' + (err.message || 'Đã xảy ra lỗi'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copy URL
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Đã sao chép URL vào clipboard!');
      })
      .catch(err => {
        console.error('Không thể sao chép URL:', err);
        alert('Lỗi khi sao chép URL: ' + err.message);
      });
  };

  // Load more media items
  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchMediaItems(currentFolder, nextCursor);
    }
  };

  // Filter media items
  const filteredMedia = mediaItems.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <motion.div
      className="media-library"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Thư viện media</h1>
        <p className="page-description">Quản lý hình ảnh và tệp đa phương tiện</p>
      </div>
      
      <div className="media-filters">
        <div className="filter-group">
          <div className="filter">
            <label>Tìm kiếm</label>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên file..."
            />
          </div>
          
          <div className="filter">
            <label>Thư mục</label>
            <select 
              value={currentFolder}
              onChange={(e) => {
                setCurrentFolder(e.target.value);
                setMediaItems([]);
                setNextCursor(null);
                setHasMore(true);
              }}
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
        className="media-upload-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="media-upload">
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }}
            multiple
            accept="image/*"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className="upload-label">
            <div className="upload-icon">🖼️</div>
            <div className="upload-text">Kéo thả file vào đây hoặc click để chọn file</div>
            <div className="upload-hint">Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 10MB)</div>
          </label>
          
          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Đang tải lên... {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="media-content">
        <h2 className="section-title">Thư viện hình ảnh</h2>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchMediaItems(currentFolder)}>Thử lại</button>
          </div>
        )}
        
        {isLoading && mediaItems.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải thư viện media...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <h3>Không tìm thấy file media</h3>
            <p>Hãy tải lên file đầu tiên của bạn hoặc thay đổi bộ lọc</p>
          </div>
        ) : (
          <>
            <div className="media-grid">
              {filteredMedia.map((media) => (
                <div key={media.id} className="media-item">
                  <img src={media.url} alt={media.name} />
                  <div className="media-overlay">
                    <button 
                      className="media-action view"
                      onClick={() => handleViewMedia(media)}
                      title="Xem chi tiết"
                    >
                      🔍
                    </button>
                    <button 
                      className="media-action copy"
                      onClick={() => handleCopyUrl(media.url)}
                      title="Sao chép URL"
                    >
                      📋
                    </button>
                    <button 
                      className="media-action delete"
                      onClick={() => handleDeleteMedia(media.public_id)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="media-name">{media.name}</div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="load-more">
                <button 
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang tải...' : 'Tải thêm'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Media Detail Modal */}
      {showMediaModal && selectedMedia && (
        <div className="modal-overlay" onClick={() => setShowMediaModal(false)}>
          <div className="media-modal" onClick={(e) => e.stopPropagation()}>
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
              <div className="media-detail-layout">
                <div className="media-preview">
                  <img src={selectedMedia.url} alt={selectedMedia.name} />
                </div>
                
                <div className="media-info">
                  <div className="info-group">
                    <label>Tên file:</label>
                    <div>{selectedMedia.name}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Loại file:</label>
                    <div>{selectedMedia.type}/{selectedMedia.format}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Kích thước:</label>
                    <div>{formatFileSize(selectedMedia.size)}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Kích thước ảnh:</label>
                    <div>{selectedMedia.width} × {selectedMedia.height} px</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Thư mục:</label>
                    <div>{selectedMedia.folder}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Ngày tải lên:</label>
                    <div>{formatDate(selectedMedia.created_at)}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Public ID:</label>
                    <div className="public-id">{selectedMedia.public_id}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>URL:</label>
                    <div className="url-copy">
                      <input 
                        type="text" 
                        value={selectedMedia.url} 
                        readOnly 
                      />
                      <button 
                        className="copy-btn"
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
                className="delete-btn"
                onClick={() => handleDeleteMedia(selectedMedia.public_id)}
              >
                Xóa
              </button>
              <button 
                className="close-btn"
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