import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../styles/ProductManager.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    collection: '',
    search: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1
  });
  
  // Mock data for products
  const mockProducts = [
    {
      id: 'prod-001',
      name: 'DIMOO Premium Gold',
      description: 'Bộ sưu tập cao cấp với thiết kế độc đáo',
      price: 850000,
      original_price: null,
      stock: 10,
      image: 'https://via.placeholder.com/100x100?text=DIMOO',
      category_id: 'cat-001',
      category: { id: 'cat-001', name: 'DIMOO' },
      is_featured: true,
      is_new: true,
      is_sale: false,
      badge: 'Mới',
      rating: 4.9,
      view_count: 245,
      created_at: '2025-01-15T10:30:00Z',
      updated_at: '2025-06-20T14:45:00Z',
      shopeeUrl: 'https://shopee.vn/product/123456789/1234567890'
    },
    {
      id: 'prod-002',
      name: 'DIMOO Limited Edition',
      description: 'Phiên bản giới hạn chỉ có tại Dudu Store',
      price: 253000,
      original_price: null,
      stock: 5,
      image: 'https://via.placeholder.com/100x100?text=DIMOO+Limited',
      category_id: 'cat-001',
      category: { id: 'cat-001', name: 'DIMOO' },
      is_featured: true,
      is_new: false,
      is_sale: false,
      badge: 'Hot',
      rating: 4.8,
      view_count: 198,
      created_at: '2025-02-10T09:15:00Z',
      updated_at: '2025-06-18T11:20:00Z',
      shopeeUrl: 'https://shopee.vn/product/123456789/1234567891'
    },
    {
      id: 'prod-003',
      name: 'MOLLY Exclusive Series',
      description: 'Series độc quyền với chất liệu cao cấp',
      price: 805000,
      original_price: 1150000,
      stock: 8,
      image: 'https://via.placeholder.com/100x100?text=MOLLY',
      category_id: 'cat-002',
      category: { id: 'cat-002', name: 'MOLLY' },
      is_featured: true,
      is_new: false,
      is_sale: true,
      badge: 'Sale',
      rating: 4.7,
      view_count: 176,
      created_at: '2025-03-05T14:20:00Z',
      updated_at: '2025-06-15T16:30:00Z',
      shopeeUrl: 'https://shopee.vn/product/123456789/1234567892'
    },
    {
      id: 'prod-004',
      name: 'MOLLY Deluxe Collection',
      description: 'Bộ sưu tập deluxe với packaging đặc biệt',
      price: 805000,
      original_price: 1150000,
      stock: 3,
      image: 'https://via.placeholder.com/100x100?text=MOLLY+Deluxe',
      category_id: 'cat-002',
      category: { id: 'cat-002', name: 'MOLLY' },
      is_featured: false,
      is_new: false,
      is_sale: true,
      badge: 'Sale',
      rating: 4.9,
      view_count: 145,
      created_at: '2025-01-20T11:45:00Z',
      updated_at: '2025-06-10T09:30:00Z',
      shopeeUrl: 'https://shopee.vn/product/123456789/1234567893'
    },
    {
      id: 'prod-005',
      name: 'LABUBU Special Edition',
      description: 'Phiên bản đặc biệt với màu sắc độc đáo',
      price: 805000,
      original_price: 1150000,
      stock: 0,
      image: 'https://via.placeholder.com/100x100?text=LABUBU',
      category_id: 'cat-003',
      category: { id: 'cat-003', name: 'LABUBU' },
      is_featured: false,
      is_new: true,
      is_sale: true,
      badge: 'Sale',
      rating: 4.8,
      view_count: 132,
      created_at: '2025-04-15T08:30:00Z',
      updated_at: '2025-06-05T13:15:00Z',
      shopeeUrl: 'https://shopee.vn/product/123456789/1234567894'
    }
  ];
  
  // Mock data for categories
  const mockCategories = [
    { id: 'cat-001', name: 'DIMOO' },
    { id: 'cat-002', name: 'MOLLY' },
    { id: 'cat-003', name: 'LABUBU' }
  ];
  
  // Mock data for collections
  const mockCollections = [
    { id: 'col-001', name: 'Premium Collection' },
    { id: 'col-002', name: 'Limited Edition' },
    { id: 'col-003', name: 'Seasonal Collection' }
  ];
  
  // Fetch products, categories, and collections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
          setProducts(mockProducts);
          setCategories(mockCategories);
          setCollections(mockCollections);
          setPagination({
            page: 1,
            limit: 10,
            totalCount: mockProducts.length,
            totalPages: Math.ceil(mockProducts.length / 10)
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (filters.category && product.category_id !== filters.category) {
      return false;
    }
    
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status === 'in-stock' && product.stock <= 0) {
      return false;
    }
    if (filters.status === 'out-of-stock' && product.stock > 0) {
      return false;
    }
    if (filters.status === 'low-stock' && (product.stock <= 0 || product.stock > 5)) {
      return false;
    }
    
    return true;
  });
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      collection: '',
      search: '',
      status: ''
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Toggle product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  // Select/deselect all products
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };
  
  // Delete selected products
  const deleteSelectedProducts = async () => {
    if (!selectedProducts.length) return;
    
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        setLoading(false);
        alert('Đã xóa sản phẩm thành công');
      }, 1000);
    } catch (err) {
      console.error('Error deleting products:', err);
      setError(err.message);
      alert('Lỗi khi xóa sản phẩm: ' + err.message);
      setLoading(false);
    }
  };
  
  // Edit product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsCreating(false);
  };
  
  // Create new product
  const handleCreateProduct = () => {
    setCurrentProduct(null);
    setIsEditing(false);
    setIsCreating(true);
  };
  
  // Save product changes
  const handleSaveProduct = (formData) => {
    try {
      setLoading(true);
      
      if (isCreating) {
        // Simulate creating new product
        const newProduct = {
          id: `prod-${Date.now()}`,
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          view_count: 0,
          rating: 0
        };
        
        setProducts([newProduct, ...products]);
        alert('Đã thêm sản phẩm mới thành công');
      } else if (isEditing && currentProduct) {
        // Simulate updating product
        setProducts(products.map(p => 
          p.id === currentProduct.id ? { ...p, ...formData, updated_at: new Date().toISOString() } : p
        ));
        alert('Đã cập nhật sản phẩm thành công');
      }
      
      setIsEditing(false);
      setIsCreating(false);
      setCurrentProduct(null);
      setLoading(false);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message);
      alert('Lỗi khi lưu sản phẩm: ' + err.message);
      setLoading(false);
    }
  };
  
  // Cancel editing/creating
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setCurrentProduct(null);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };
  
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

  return (
    <motion.div
      className="product-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="manager-header">
        <h1>Quản lý sản phẩm</h1>
        <div className="header-actions">
          <button 
            className="add-product-btn"
            onClick={handleCreateProduct}
          >
            <span>+</span> Thêm sản phẩm
          </button>
        </div>
      </div>
      
      <div className="filters-bar">
        <div className="filters-group">
          <div className="filter">
            <label>Danh mục</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter">
            <label>Trạng thái</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="in-stock">Còn hàng</option>
              <option value="low-stock">Sắp hết hàng</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>
          
          <div className="filter search-filter">
            <label>Tìm kiếm</label>
            <input 
              type="text" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange}
              placeholder="Tìm kiếm sản phẩm..."
            />
          </div>
        </div>
        
        <button 
          className="clear-filters-btn"
          onClick={clearFilters}
          disabled={!Object.values(filters).some(Boolean)}
        >
          Xóa bộ lọc
        </button>
      </div>
      
      <div className="bulk-actions">
        <div className="selection-info">
          <label>
            <input 
              type="checkbox" 
              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
              onChange={toggleSelectAll}
            />
            <span>Chọn tất cả</span>
          </label>
          
          {selectedProducts.length > 0 && (
            <span className="selected-count">
              {selectedProducts.length} sản phẩm đã chọn
            </span>
          )}
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="bulk-buttons">
            <button 
              className="bulk-delete-btn"
              onClick={deleteSelectedProducts}
            >
              Xóa đã chọn
            </button>
          </div>
        )}
      </div>
      
      {loading && products.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải sản phẩm: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Không tìm thấy sản phẩm</h3>
          <p>Hãy điều chỉnh bộ lọc hoặc thêm sản phẩm mới</p>
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th className="checkbox-cell"></th>
                <th className="image-cell">Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Lượt xem</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="checkbox-cell">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
                  <td className="image-cell">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || 'Chưa phân loại'}</td>
                  <td className="price-cell">
                    <div className="price-display">
                      <span className="current-price">
                        {formatCurrency(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="original-price">
                          {formatCurrency(product.original_price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="stock-cell">
                    <span className={`stock-badge ${getStockStatusClass(product.stock)}`}>
                      {getStockStatusText(product.stock)}
                    </span>
                  </td>
                  <td>{product.view_count || 0}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => window.open(product.shopeeUrl || '#', '_blank')}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Product Modal */}
      {(isEditing || isCreating) && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isCreating ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h2>
              <button className="close-btn" onClick={handleCancelEdit}>✕</button>
            </div>
            
            <div className="modal-body">
              <ProductForm 
                product={currentProduct}
                categories={categories}
                collections={collections}
                onSave={handleSaveProduct}
                onCancel={handleCancelEdit}
                isCreating={isCreating}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Product Form Component
const ProductForm = ({ product, categories, collections, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    stock: product?.stock || 0,
    category_id: product?.category_id || '',
    image: product?.image || '',
    shopeeUrl: product?.shopeeUrl || '',
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
    is_sale: product?.is_sale || false,
    badge: product?.badge || ''
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Tên sản phẩm</label>
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
          <label htmlFor="category_id">Danh mục</label>
          <select 
            id="category_id" 
            name="category_id" 
            value={formData.category_id} 
            onChange={handleChange}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            value={formData.price} 
            onChange={handleChange}
            min="0"
            step="1000"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="original_price">Giá gốc (nếu có)</label>
          <input 
            type="number" 
            id="original_price" 
            name="original_price" 
            value={formData.original_price} 
            onChange={handleChange}
            min="0"
            step="1000"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Tồn kho</label>
          <input 
            type="number" 
            id="stock" 
            name="stock" 
            value={formData.stock} 
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="badge">Badge (tùy chọn)</label>
          <input 
            type="text" 
            id="badge" 
            name="badge" 
            value={formData.badge} 
            onChange={handleChange}
            placeholder="Ví dụ: Mới, Sale, Hot"
          />
        </div>
        
        <div className="form-group full-width">
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
        
        <div className="form-group full-width">
          <label htmlFor="shopeeUrl">URL Shopee</label>
          <input 
            type="text" 
            id="shopeeUrl" 
            name="shopeeUrl" 
            value={formData.shopeeUrl} 
            onChange={handleChange}
            placeholder="https://shopee.vn/product/123456789/1234567890"
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="description">Mô tả</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-group checkboxes">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="is_featured" 
              checked={formData.is_featured} 
              onChange={handleChange}
            />
            Sản phẩm nổi bật
          </label>
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="is_new" 
              checked={formData.is_new} 
              onChange={handleChange}
            />
            Sản phẩm mới
          </label>
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="is_sale" 
              checked={formData.is_sale} 
              onChange={handleChange}
            />
            Đang giảm giá
          </label>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="save-btn">
          {isCreating ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
};

// Helper functions
function getStockStatusClass(stock) {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= 5) return 'low-stock';
  return 'in-stock';
}

function getStockStatusText(stock) {
  if (stock <= 0) return 'Hết hàng';
  if (stock <= 5) return `Sắp hết (${stock})`;
  return `Còn hàng (${stock})`;
}

export default ProductManager;