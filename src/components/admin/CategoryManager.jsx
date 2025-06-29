import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase, { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/supabaseClient';
import '../../styles/CategoryManager.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        const categoriesData = await getCategories();
        
        // Organize categories into a tree structure
        const categoriesMap = {};
        const rootCategories = [];
        
        // First pass: create map of id -> category
        categoriesData.forEach(category => {
          categoriesMap[category.id] = {
            ...category,
            children: []
          };
        });
        
        // Second pass: build tree
        categoriesData.forEach(category => {
          if (category.parent_id && categoriesMap[category.parent_id]) {
            categoriesMap[category.parent_id].children.push(categoriesMap[category.id]);
          } else {
            rootCategories.push(categoriesMap[category.id]);
          }
        });
        
        setCategories(rootCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filterCategories = (categories, term) => {
    if (!term) return categories;
    
    return categories.filter(category => {
      const matchesName = category.name.toLowerCase().includes(term.toLowerCase());
      const matchesDescription = category.description && category.description.toLowerCase().includes(term.toLowerCase());
      const hasMatchingChildren = category.children && filterCategories(category.children, term).length > 0;
      
      return matchesName || matchesDescription || hasMatchingChildren;
    });
  };

  const filteredCategories = filterCategories(categories, searchTerm);

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

  // Edit category
  const editCategory = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Create new category
  const createCategory = (parentId = null) => {
    setSelectedCategory({
      name: '',
      description: '',
      slug: '',
      image: '',
      parent_id: parentId
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      await adminDeleteCategory(id);
      
      // Update local state
      const removeCategory = (categories, id) => {
        return categories.filter(category => {
          if (category.id === id) {
            return false;
          }
          
          if (category.children && category.children.length > 0) {
            category.children = removeCategory(category.children, id);
          }
          
          return true;
        });
      };
      
      setCategories(removeCategory(categories, id));
      
      alert('Đã xóa danh mục thành công');
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message);
      alert('Lỗi khi xóa danh mục: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save category
  const saveCategory = async (formData) => {
    try {
      setLoading(true);
      
      let result;
      
      if (isCreating) {
        // Create new category
        result = await adminCreateCategory(formData);
      } else {
        // Update existing category
        result = await adminUpdateCategory(formData.id, formData);
      }
      
      // Update local state
      const updateCategoryTree = (categories, newCategory) => {
        return categories.map(category => {
          if (category.id === newCategory.id) {
            return {
              ...newCategory,
              children: category.children || []
            };
          }
          
          if (category.children && category.children.length > 0) {
            return {
              ...category,
              children: updateCategoryTree(category.children, newCategory)
            };
          }
          
          return category;
        });
      };
      
      if (isCreating) {
        // Add new category to tree
        if (formData.parent_id) {
          const addToParent = (categories, parentId, newCategory) => {
            return categories.map(category => {
              if (category.id === parentId) {
                return {
                  ...category,
                  children: [...(category.children || []), { ...newCategory, children: [] }]
                };
              }
              
              if (category.children && category.children.length > 0) {
                return {
                  ...category,
                  children: addToParent(category.children, parentId, newCategory)
                };
              }
              
              return category;
            });
          };
          
          setCategories(addToParent(categories, formData.parent_id, result));
        } else {
          setCategories([...categories, { ...result, children: [] }]);
        }
      } else {
        setCategories(updateCategoryTree(categories, result));
      }
      
      setIsEditing(false);
      setIsCreating(false);
      setSelectedCategory(null);
      
      alert(isCreating ? 'Đã tạo danh mục thành công' : 'Đã cập nhật danh mục thành công');
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.message);
      alert('Lỗi khi lưu danh mục: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedCategory(null);
  };

  // Render category tree
  const renderCategoryTree = (categories, level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <tr className={`category-row level-${level}`}>
          <td className="name-cell">
            <div className="category-name" style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0 && <span className="indent-marker">└─</span>}
              <span>{category.name}</span>
            </div>
          </td>
          <td>{category.slug}</td>
          <td>{category.children?.length || 0}</td>
          <td>{formatDate(category.updated_at)}</td>
          <td>
            <div className="category-actions">
              <button 
                className="add-subcategory-btn"
                onClick={() => createCategory(category.id)}
                title="Thêm danh mục con"
              >
                +
              </button>
              <button 
                className="edit-btn"
                onClick={() => editCategory(category)}
              >
                Sửa
              </button>
              <button 
                className="delete-btn"
                onClick={() => deleteCategory(category.id)}
              >
                Xóa
              </button>
            </div>
          </td>
        </tr>
        {category.children && category.children.length > 0 && renderCategoryTree(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <motion.div
      className="category-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Quản lý danh mục</h1>
        <p className="page-description">Quản lý danh mục sản phẩm</p>
      </div>
      
      <div className="category-actions-bar">
        <div className="search-box">
          <input 
            type="text"
            placeholder="Tìm kiếm danh mục..."
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
        
        <button 
          className="add-category-btn"
          onClick={() => createCategory()}
        >
          <span>+</span> Thêm danh mục
        </button>
      </div>
      
      {loading && categories.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh mục...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải danh mục: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <h3>Không tìm thấy danh mục</h3>
          <p>Hãy tạo danh mục mới hoặc thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="category-table-container">
          <table className="category-table">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Danh mục con</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {renderCategoryTree(filteredCategories)}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Category Edit/Create Modal */}
      {(isEditing || isCreating) && selectedCategory && (
        <div className="modal-overlay" onClick={cancelEditing}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isCreating ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}</h2>
              <button className="close-btn" onClick={cancelEditing}>✕</button>
            </div>
            
            <div className="modal-body">
              <CategoryForm 
                category={selectedCategory}
                categories={categories}
                onSave={saveCategory}
                onCancel={cancelEditing}
                isCreating={isCreating}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Category Form Component
const CategoryForm = ({ category, categories, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState({
    ...category
  });
  
  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug when name changes
    if (name === 'name' && (isCreating || !formData.slug)) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Flatten categories for select dropdown
  const flattenCategories = (categories, level = 0, result = []) => {
    categories.forEach(category => {
      if (category.id !== formData.id) { // Prevent circular reference
        result.push({
          id: category.id,
          name: '—'.repeat(level) + ' ' + category.name,
          level
        });
        
        if (category.children && category.children.length > 0) {
          flattenCategories(category.children, level + 1, result);
        }
      }
    });
    
    return result;
  };
  
  const flatCategories = flattenCategories(categories);
  
  return (
    <form onSubmit={handleSubmit} className="category-form">
      <div className="form-group">
        <label htmlFor="name">Tên danh mục</label>
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
        <label htmlFor="slug">Slug</label>
        <input 
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea 
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="parent_id">Danh mục cha</label>
        <select 
          id="parent_id"
          name="parent_id"
          value={formData.parent_id || ''}
          onChange={handleChange}
        >
          <option value="">Không có danh mục cha</option>
          {flatCategories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
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
      
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="save-btn">
          {isCreating ? 'Tạo danh mục' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
};

export default CategoryManager;