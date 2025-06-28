import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase, { adminGetAllUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../../services/supabaseClient';
import '../../styles/AdminDashboard.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const { users, count } = await adminGetAllUsers({
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search || undefined,
          role: filters.role || undefined
        });
        
        setUsers(users);
        setPagination(prev => ({
          ...prev,
          totalCount: count,
          totalPages: Math.ceil(count / prev.limit)
        }));
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [filters, pagination.page, pagination.limit]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      role: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Edit user
  const editUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Create new user
  const createUser = () => {
    setSelectedUser({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      role: 'customer'
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Save user changes
  const saveUserChanges = async (updatedUser) => {
    try {
      setLoading(true);
      
      let result;
      
      if (isCreating) {
        // Create new user
        result = await adminCreateUser(updatedUser);
        
        // Add to local state
        setUsers(prev => [result, ...prev]);
      } else {
        // Update existing user
        result = await adminUpdateUser(updatedUser.id, updatedUser);
        
        // Update local state
        setUsers(prev => prev.map(u => u.id === result.id ? result : u));
      }
      
      setIsEditing(false);
      setIsCreating(false);
      setSelectedUser(null);
      
      alert(isCreating ? 'Đã tạo người dùng thành công' : 'Đã cập nhật người dùng thành công');
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.message);
      alert('Lỗi khi lưu người dùng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      await adminDeleteUser(id);
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== id));
      
      alert('Đã xóa người dùng thành công');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
      alert('Lỗi khi xóa người dùng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedUser(null);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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
      className="user-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Quản lý người dùng</h1>
        <p className="page-description">Quản lý tài khoản người dùng</p>
      </div>
      
      <div className="filters-bar">
        <div className="filters-group">
          <div className="filter">
            <label>Vai trò</label>
            <select 
              name="role" 
              value={filters.role} 
              onChange={handleFilterChange}
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="staff">Nhân viên</option>
              <option value="customer">Khách hàng</option>
            </select>
          </div>
          
          <div className="filter search-filter">
            <label>Tìm kiếm</label>
            <input 
              type="text" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange}
              placeholder="Tìm kiếm theo email, tên..."
            />
          </div>
        </div>
        
        <div className="filters-actions">
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
            disabled={!Object.values(filters).some(Boolean)}
          >
            Xóa bộ lọc
          </button>
          
          <button 
            className="add-user-btn"
            onClick={createUser}
          >
            <span>+</span> Thêm người dùng
          </button>
        </div>
      </div>
      
      {loading && users.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải người dùng...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Lỗi khi tải người dùng: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Không tìm thấy người dùng</h3>
          <p>Hãy điều chỉnh bộ lọc hoặc thêm người dùng mới</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'admin' ? 'Admin' : 
                       user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="user-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => editUser(user)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Xóa
                      </button>
                    </div>
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
              Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, pagination.totalCount)} của {pagination.totalCount} người dùng
            </div>
          </div>
        </div>
      )}
      
      {/* User Edit/Create Modal */}
      {(isEditing || isCreating) && selectedUser && (
        <UserEditModal 
          user={selectedUser}
          onSave={saveUserChanges}
          onCancel={cancelEditing}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
};

// User Edit Modal Component
const UserEditModal = ({ user, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState({
    ...user
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          <h2>{isCreating ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                required
              />
            </div>
            
            {isCreating && (
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  required={isCreating}
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="first_name">Tên</label>
              <input 
                type="text" 
                id="first_name" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">Họ</label>
              <input 
                type="text" 
                id="last_name" 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Vai trò</label>
              <select 
                id="role" 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                required
              >
                <option value="customer">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="address">Địa chỉ</label>
              <textarea 
                id="address" 
                name="address" 
                value={formData.address || ''} 
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="save-btn">
              {isCreating ? 'Tạo người dùng' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManager;