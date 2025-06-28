import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Giả lập dữ liệu sản phẩm
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setTimeout(() => {
      const mockProducts = [
        {
          id: 'PROD-001',
          name: 'DIMOO Premium Collection',
          description: 'Bộ sưu tập cao cấp với thiết kế độc đáo',
          price: 230000,
          original_price: null,
          stock: 10,
          image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100',
          category: { id: 'CAT-001', name: 'DIMOO' },
          is_featured: true,
          is_new: true,
          is_sale: false,
          badge: 'Mới',
          rating: 4.9,
          view_count: 245,
          created_at: '2025-06-01T10:30:00Z'
        },
        {
          id: 'PROD-002',
          name: 'DIMOO Limited Edition',
          description: 'Phiên bản giới hạn chỉ có tại Dudu Store',
          price: 253000,
          original_price: null,
          stock: 2,
          image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100',
          category: { id: 'CAT-001', name: 'DIMOO' },
          is_featured: true,
          is_new: false,
          is_sale: false,
          badge: 'Hot',
          rating: 4.8,
          view_count: 189,
          created_at: '2025-06-02T14:20:00Z'
        },
        {
          id: 'PROD-003',
          name: 'MOLLY Exclusive Series',
          description: 'Series độc quyền với chất liệu cao cấp',
          price: 805000,
          original_price: 1150000,
          stock: 8,
          image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100',
          category: { id: 'CAT-002', name: 'MOLLY' },
          is_featured: true,
          is_new: false,
          is_sale: true,
          badge: 'Sale',
          rating: 4.7,
          view_count: 312,
          created_at: '2025-06-03T09:15:00Z'
        },
        {
          id: 'PROD-004',
          name: 'MOLLY Deluxe Collection',
          description: 'Bộ sưu tập deluxe với packaging đặc biệt',
          price: 805000,
          original_price: 1150000,
          stock: 3,
          image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100',
          category: { id: 'CAT-002', name: 'MOLLY' },
          is_featured: false,
          is_new: false,
          is_sale: true,
          badge: 'Sale',
          rating: 4.9,
          view_count: 278,
          created_at: '2025-06-04T16:45:00Z'
        },
        {
          id: 'PROD-005',
          name: 'LABUBU Special Edition',
          description: 'Phiên bản đặc biệt với màu sắc độc đáo',
          price: 805000,
          original_price: 1150000,
          stock: 0,
          image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=100',
          category: { id: 'CAT-003', name: 'LABUBU' },
          is_featured: false,
          is_new: true,
          is_sale: true,
          badge: 'Sale',
          rating: 4.8,
          view_count: 245,
          created_at: '2025-06-05T11:10:00Z'
        }
      ];
      
      setProducts(mockProducts);
      setTotalPages(5); // Giả sử có 5 trang
      setIsLoading(false);
    }, 1000);
  }, []);

  // Định dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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

  // Render trạng thái tồn kho
  const renderStockStatus = (stock) => {
    if (stock === 0) {
      return <span className="product-status status-out-of-stock">Hết hàng</span>;
    } else if (stock <= 5) {
      return <span className="product-status status-low-stock">Sắp hết ({stock})</span>;
    } else {
      return <span className="product-status status-in-stock">Còn hàng ({stock})</span>;
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý thay đổi bộ lọc danh mục
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  // Xử lý thêm sản phẩm
  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  // Xử lý chỉnh sửa sản phẩm
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Trong thực tế, đây sẽ là API call
      console.log(`Xóa sản phẩm có ID: ${productId}`);
      // Sau khi xóa thành công, cập nhật lại danh sách
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  // Xử lý phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Quản lý sản phẩm</h1>
        <p className="page-description">Quản lý tất cả sản phẩm trong cửa hàng</p>
      </div>

      <div className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tìm kiếm</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tìm kiếm theo tên sản phẩm..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select 
              className="form-select"
              value={categoryFilter}
              onChange={handleCategoryChange}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="CAT-001">DIMOO</option>
              <option value="CAT-002">MOLLY</option>
              <option value="CAT-003">LABUBU</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sắp xếp theo</label>
            <select 
              className="form-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="created_at-desc">Mới nhất</option>
              <option value="created_at-asc">Cũ nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="view_count-desc">Lượt xem nhiều nhất</option>
              <option value="stock-asc">Tồn kho thấp nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Danh sách sản phẩm</div>
          <div className="table-actions">
            <button 
              className="admin-btn btn-primary btn-icon"
              onClick={handleAddProduct}
            >
              <span>+</span>
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Lượt xem</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="admin-product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category.name}</td>
                    <td>
                      {formatCurrency(product.price)}
                      {product.original_price && (
                        <div style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#9ca3af' }}>
                          {formatCurrency(product.original_price)}
                        </div>
                      )}
                    </td>
                    <td>{renderStockStatus(product.stock)}</td>
                    <td>{product.view_count}</td>
                    <td>
                      <div className="product-actions">
                        <div 
                          className="action-btn action-edit"
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️
                        </div>
                        <div 
                          className="action-btn action-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          🗑️
                        </div>
                        <div className="action-btn">🔍</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              <div className="pagination">
                <div 
                  className="page-button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  «
                </div>
                {[...Array(totalPages).keys()].map((page) => (
                  <div 
                    key={page + 1}
                    className={`page-button ${currentPage === page + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </div>
                ))}
                <div 
                  className="page-button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                >
                  »
                </div>
              </div>
              <div className="page-info">
                Hiển thị {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, products.length)} của {products.length} sản phẩm
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal thêm sản phẩm */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Thêm sản phẩm mới</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Tên sản phẩm</label>
                <input type="text" className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <select className="form-select">
                    <option value="">Chọn danh mục</option>
                    <option value="CAT-001">DIMOO</option>
                    <option value="CAT-002">MOLLY</option>
                    <option value="CAT-003">LABUBU</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Giá</label>
                  <input type="number" className="form-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Giá gốc (nếu có)</label>
                  <input type="number" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tồn kho</label>
                  <input type="number" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Hình ảnh</label>
                <input type="file" className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Badge</label>
                  <select className="form-select">
                    <option value="">Không có</option>
                    <option value="new">Mới</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" />
                      <span>Nổi bật</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" />
                      <span>Mới</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" />
                      <span>Giảm giá</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="admin-btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button className="admin-btn btn-primary">Thêm sản phẩm</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa sản phẩm */}
      {showEditModal && currentProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Chỉnh sửa sản phẩm</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Tên sản phẩm</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={currentProduct.name}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <select 
                    className="form-select"
                    defaultValue={currentProduct.category.id}
                  >
                    <option value="CAT-001">DIMOO</option>
                    <option value="CAT-002">MOLLY</option>
                    <option value="CAT-003">LABUBU</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Giá</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    defaultValue={currentProduct.price}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Giá gốc (nếu có)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    defaultValue={currentProduct.original_price || ''}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tồn kho</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    defaultValue={currentProduct.stock}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea 
                  className="form-textarea"
                  defaultValue={currentProduct.description}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Hình ảnh hiện tại</label>
                <div style={{ marginBottom: '12px' }}>
                  <img 
                    src={currentProduct.image} 
                    alt={currentProduct.name} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <label className="form-label">Thay đổi hình ảnh</label>
                <input type="file" className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Badge</label>
                  <select 
                    className="form-select"
                    defaultValue={currentProduct.badge?.toLowerCase() || ''}
                  >
                    <option value="">Không có</option>
                    <option value="mới">Mới</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={currentProduct.is_featured}
                      />
                      <span>Nổi bật</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={currentProduct.is_new}
                      />
                      <span>Mới</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={currentProduct.is_sale}
                      />
                      <span>Giảm giá</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="admin-btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
              <button className="admin-btn btn-primary">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminProductManagement;