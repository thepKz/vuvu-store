import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../services/supabaseClient';
import '../styles/AdminDashboard.css';
import '../styles/ProductManager.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
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
  
  // Fetch products, categories, and collections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const { data: productsData, error: productsError, count } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name)
          `, { count: 'exact' })
          .range(
            (pagination.page - 1) * pagination.limit, 
            pagination.page * pagination.limit - 1
          )
          .order('created_at', { ascending: false });
          
        if (productsError) throw productsError;
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        // Fetch collections
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .order('name');
          
        if (collectionsError) throw collectionsError;
        
        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setCollections(collectionsData || []);
        setPagination(prev => ({
          ...prev,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / prev.limit)
        }));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pagination.page, pagination.limit]);
  
  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name)
          `, { count: 'exact' });
        
        // Apply category filter
        if (filters.category) {
          query = query.eq('category_id', filters.category);
        }
        
        // Apply search filter
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        
        // Apply status filter
        if (filters.status === 'in-stock') {
          query = query.gt('stock', 0);
        } else if (filters.status === 'out-of-stock') {
          query = query.eq('stock', 0);
        } else if (filters.status === 'low-stock') {
          query = query.gt('stock', 0).lte('stock', 5);
        }
        
        // Apply pagination
        query = query
          .range(
            (pagination.page - 1) * pagination.limit, 
            pagination.page * pagination.limit - 1
          )
          .order('created_at', { ascending: false });
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setProducts(data || []);
        setPagination(prev => ({
          ...prev,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / prev.limit)
        }));
      } catch (err) {
        console.error('Error applying filters:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [filters, pagination.page, pagination.limit]);
  
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
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
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
      
      // Delete products
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);
        
      if (error) throw error;
      
      // Update local state
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      
      alert('Đã xóa sản phẩm thành công');
    } catch (err) {
      console.error('Error deleting products:', err);
      setError(err.message);
      alert('Lỗi khi xóa sản phẩm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Edit product
  const editProduct = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };
  
  // Save product changes
  const saveProductChanges = async (updatedProduct) => {
    try {
      setLoading(true);
      
      // Update product
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          original_price: updatedProduct.original_price,
          stock: updatedProduct.stock,
          category_id: updatedProduct.category_id,
          is_featured: updatedProduct.is_featured,
          is_new: updatedProduct.is_new,
          is_sale: updatedProduct.is_sale,
          badge: updatedProduct.badge,
          image: updatedProduct.image,
          updated_at: new Date()
        })
        .eq('id', updatedProduct.id)
        .select();
        
      if (error) throw error;
      
      // Update local state
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...data[0] } : p));
      setIsEditing(false);
      setCurrentProduct(null);
      
      alert('Cập nhật sản phẩm thành công');
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
      alert('Lỗi khi cập nhật sản phẩm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentProduct(null);
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };
  
  // Get stock status
  const getStockStatus = (stock) => {
    if (stock <= 0) return { class: 'out-of-stock', text: 'Hết hàng' };
    if (stock <= 5) return { class: 'low-stock', text: `Sắp hết (${stock})` };
    return { class: 'in-stock', text: `Còn hàng (${stock})` };
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
          <button className="add-product-btn">
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
              checked={selectedProducts.length === products.length && products.length > 0}
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
            <button className="bulk-edit-btn">Sửa hàng loạt</button>
            <button 
              className="bulk-delete-btn"
              onClick={deleteSelectedProducts}
            >
              Xóa đã chọn
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải sản phẩm: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : products.length === 0 ? (
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
              {products.map(product => (
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
                      <img src={product.image} alt={product.name} />
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
                    <span className={`stock-badge ${getStockStatus(product.stock).class}`}>
                      {getStockStatus(product.stock).text}
                    </span>
                  </td>
                  <td>{product.view_count || 0}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => editProduct(product)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination-container">
            <div className="pagination">
              <button 
                className="page-btn"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                &laquo;
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, and pages around current page
                  return page === 1 || 
                         page === pagination.totalPages || 
                         (page >= pagination.page - 1 && page <= pagination.page + 1);
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="page-ellipsis">...</span>
                        <button 
                          className={`page-btn ${pagination.page === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button 
                      key={page}
                      className={`page-btn ${pagination.page === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              
              <button 
                className="page-btn"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                &raquo;
              </button>
            </div>
            
            <div className="pagination-info">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, pagination.totalCount)} của {pagination.totalCount} sản phẩm
            </div>
          </div>
        </div>
      )}
      
      {isEditing && currentProduct && (
        <ProductEditModal 
          product={currentProduct}
          categories={categories}
          collections={collections}
          onSave={saveProductChanges}
          onCancel={cancelEditing}
        />
      )}
    </motion.div>
  );
};

// Product Edit Modal Component
const ProductEditModal = ({ product, categories, collections, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...product,
    category_id: product.category_id || '',
    is_featured: product.is_featured || false,
    is_new: product.is_new || false,
    is_sale: product.is_sale || false
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
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="modal-header">
          <h2>Chỉnh sửa sản phẩm</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
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
                value={formData.original_price || ''} 
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
                value={formData.badge || ''} 
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
                value={formData.image || ''} 
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Mô tả</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description || ''} 
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductManagement;