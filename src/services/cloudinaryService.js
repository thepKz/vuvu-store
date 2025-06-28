import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'demo'; // Thay thế bằng cloud name thật của bạn
const CLOUDINARY_UPLOAD_PRESET = 'dudu_store'; // Thay thế bằng upload preset thật của bạn

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Tải lên hình ảnh lên Cloudinary
 * @param {File} file - File hình ảnh cần tải lên
 * @param {string} folder - Thư mục lưu trữ (products, categories, collections)
 * @returns {Promise<Object>} - Kết quả tải lên
 */
export const uploadImage = async (file, folder = 'products') => {
  try {
    // Tạo form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `dudu-store/${folder}`);

    // Tải lên Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Lấy chữ ký tải lên từ backend
 * @param {Object} params - Tham số tải lên
 * @returns {Promise<Object>} - Dữ liệu chữ ký
 */
export const getUploadSignature = async (params = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.post(
      `${API_BASE_URL}/media/signature`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting upload signature:', error);
    throw error;
  }
};

/**
 * Tải lên hình ảnh với chữ ký bảo mật
 * @param {File} file - File hình ảnh cần tải lên
 * @param {string} folder - Thư mục lưu trữ
 * @param {Array} tags - Tags cho hình ảnh
 * @returns {Promise<Object>} - Kết quả tải lên
 */
export const uploadImageWithSignature = async (file, folder = 'products', tags = []) => {
  try {
    // Lấy chữ ký từ backend
    const signatureData = await getUploadSignature({ folder, tags });
    
    // Tạo form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('signature', signatureData.signature);
    formData.append('folder', `dudu-store/${folder}`);
    
    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    
    // Tải lên Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      formData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image with signature:', error);
    throw error;
  }
};

/**
 * Xóa hình ảnh khỏi Cloudinary
 * @param {string} publicId - Public ID của hình ảnh
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteImage = async (publicId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.delete(
      `${API_BASE_URL}/media/${publicId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Lấy danh sách hình ảnh từ thư viện media
 * @param {Object} params - Tham số truy vấn
 * @returns {Promise<Object>} - Danh sách hình ảnh
 */
export const getMediaLibrary = async (params = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get(
      `${API_BASE_URL}/media/library`,
      {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting media library:', error);
    throw error;
  }
};

/**
 * Tạo URL hình ảnh với các biến đổi
 * @param {string} publicId - Public ID của hình ảnh
 * @param {Object} options - Tùy chọn biến đổi
 * @returns {string} - URL hình ảnh đã biến đổi
 */
export const getImageUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  let transformations = [];
  
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  const transformationString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
};

export default {
  uploadImage,
  uploadImageWithSignature,
  deleteImage,
  getMediaLibrary,
  getImageUrl,
  getUploadSignature
};