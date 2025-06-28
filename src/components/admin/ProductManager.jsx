import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';
import '../../styles/ProductManager.css';

const ProductManager = () => {
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
  
  // Fetch products, categories, and collections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name),
            variants:product_variants(*)
          `)
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
      } catch (err) {
        setError(err.message);
      } finally {
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
    
    // Collection filter (would need to fetch product collections for this)
    
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
    
    return true;
  });
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      collection: '',
      search: '',
      status: ''
    });
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
    
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
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
      
      alert('Products deleted successfully');
    } catch (err) {
      setError(err.message);
      alert('Error deleting products: ' + err.message);
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
      
      alert('Product updated successfully');
    } catch (err) {
      setError(err.message);
      alert('Error updating product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentProduct(null);
  };

  return (
    <motion.div
      className="product-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="manager-header">
        <h1>Product Manager</h1>
        <div className="header-actions">
          <button className="add-product-btn">
            <span>+</span> Add Product
          </button>
        </div>
      </div>
      
      <div className="filters-bar">
        <div className="filters-group">
          <div className="filter">
            <label>Category</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter">
            <label>Status</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          
          <div className="filter search-filter">
            <label>Search</label>
            <input 
              type="text" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange}
              placeholder="Search products..."
            />
          </div>
        </div>
        
        <button 
          className="clear-filters-btn"
          onClick={clearFilters}
          disabled={!Object.values(filters).some(Boolean)}
        >
          Clear Filters
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
            <span>Select All</span>
          </label>
          
          {selectedProducts.length > 0 && (
            <span className="selected-count">
              {selectedProducts.length} products selected
            </span>
          )}
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="bulk-buttons">
            <button className="bulk-edit-btn">Edit Selected</button>
            <button 
              className="bulk-delete-btn"
              onClick={deleteSelectedProducts}
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error loading products: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or add a new product</p>
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th className="checkbox-cell"></th>
                <th className="image-cell">Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
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
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || 'Uncategorized'}</td>
                  <td className="price-cell">
                    <div className="price-display">
                      <span className="current-price">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="original-price">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="stock-cell">
                    <span className={`stock-badge ${product.stock <= 0 ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : 'in-stock'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(product)}`}>
                      {getStatusLabel(product)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

// Helper component for editing a product
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
          <h2>Edit Product</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
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
              <label htmlFor="category_id">Category</label>
              <select 
                id="category_id" 
                name="category_id" 
                value={formData.category_id} 
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price</label>
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
              <label htmlFor="original_price">Original Price (optional)</label>
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
              <label htmlFor="stock">Stock</label>
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
              <label htmlFor="badge">Badge (optional)</label>
              <input 
                type="text" 
                id="badge" 
                name="badge" 
                value={formData.badge || ''} 
                onChange={handleChange}
                placeholder="e.g., New, Sale, Hot"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="image">Image URL</label>
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
              <label htmlFor="description">Description</label>
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
                Featured Product
              </label>
              
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="is_new" 
                  checked={formData.is_new} 
                  onChange={handleChange}
                />
                New Product
              </label>
              
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="is_sale" 
                  checked={formData.is_sale} 
                  onChange={handleChange}
                />
                On Sale
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const getStatusClass = (product) => {
  if (product.stock <= 0) return 'out-of-stock';
  if (product.is_new) return 'new';
  if (product.is_sale) return 'sale';
  if (product.is_featured) return 'featured';
  return 'active';
};

const getStatusLabel = (product) => {
  if (product.stock <= 0) return 'Out of Stock';
  if (product.is_new) return 'New';
  if (product.is_sale) return 'On Sale';
  if (product.is_featured) return 'Featured';
  return 'Active';
};

export default ProductManager;