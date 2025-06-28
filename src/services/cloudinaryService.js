import { Cloudinary } from "@cloudinary/url-gen";
import axios from 'axios';

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get upload signature from backend
 * @param {Object} params - Upload parameters
 * @returns {Promise<Object>} - Signature data
 */
const getUploadSignature = async (params = {}) => {
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
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder to upload to
 * @param {Array} tags - Tags to add to image
 * @returns {Promise<Object>} - Upload result
 */
const uploadImage = async (file, folder = 'products', tags = []) => {
  try {
    // Get upload signature
    const signatureData = await getUploadSignature({ folder, tags });
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('signature', signatureData.signature);
    formData.append('folder', `dudu-store/${folder}`);
    
    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    
    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of image to delete
 * @returns {Promise<Object>} - Delete result
 */
const deleteImage = async (publicId) => {
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
 * Get media library
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Media library data
 */
const getMediaLibrary = async (params = {}) => {
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
 * Create image URL with transformations
 * @param {string} publicId - Public ID of image
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
const getImageUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const image = cld.image(publicId);
  
  if (options.width) {
    image.resize(`w_${options.width}`);
  }
  
  if (options.height) {
    image.resize(`h_${options.height}`);
  }
  
  if (options.crop) {
    image.resize(`c_${options.crop}`);
  }
  
  if (options.quality) {
    image.quality(`q_${options.quality}`);
  }
  
  return image.toURL();
};

export default {
  cld,
  uploadImage,
  deleteImage,
  getMediaLibrary,
  getImageUrl
};