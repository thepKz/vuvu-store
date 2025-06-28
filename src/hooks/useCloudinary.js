import { useState, useCallback } from 'react';
import cloudinaryService from '../services/cloudinaryService';

/**
 * Hook for uploading images to Cloudinary
 */
export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file, folder = 'products', tags = []) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Create upload progress handler
      const onProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      };

      // Add progress event listener
      const originalUpload = cloudinaryService.uploadImage;
      cloudinaryService.uploadImage = async (file, folder, tags) => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener('progress', onProgress);
          
          // Create a promise that resolves when the upload is complete
          const uploadPromise = new Promise((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
              } else {
                reject(new Error('Upload failed'));
              }
            };
            xhr.onerror = () => reject(new Error('Upload failed'));
          });
          
          // Start the upload
          const result = await originalUpload(file, folder, tags, xhr);
          return result;
        } catch (error) {
          throw error;
        }
      };

      // Perform the upload
      const result = await cloudinaryService.uploadImage(file, folder, tags);
      
      // Restore original upload function
      cloudinaryService.uploadImage = originalUpload;
      
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadImage, uploading, progress, error };
};

/**
 * Hook for managing media library
 */
export const useMediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  const fetchMedia = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await cloudinaryService.getMediaLibrary({
        ...params,
        next_cursor: params.next_cursor || nextCursor
      });
      
      if (params.next_cursor || nextCursor) {
        setMedia(prev => [...prev, ...data.resources]);
      } else {
        setMedia(data.resources);
      }
      
      setNextCursor(data.next_cursor);
      setHasMore(!!data.next_cursor);
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch media library');
      return null;
    } finally {
      setLoading(false);
    }
  }, [nextCursor]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMedia({ next_cursor: nextCursor });
    }
  }, [fetchMedia, loading, hasMore, nextCursor]);

  const deleteImage = useCallback(async (publicId) => {
    try {
      await cloudinaryService.deleteImage(publicId);
      setMedia(prev => prev.filter(item => item.public_id !== publicId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      return false;
    }
  }, []);

  return { 
    media, 
    loading, 
    error, 
    hasMore, 
    fetchMedia, 
    loadMore, 
    deleteImage 
  };
};

/**
 * Hook for getting image URL with transformations
 */
export const useCloudinaryImage = () => {
  const getImageUrl = useCallback((publicId, options = {}) => {
    return cloudinaryService.getImageUrl(publicId, options);
  }, []);

  return { getImageUrl };
};