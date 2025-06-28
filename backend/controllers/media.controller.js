const { cloudinary, generateUploadSignature } = require('../config/cloudinary.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const db = require('../config/db.config');

/**
 * Upload image to Cloudinary
 */
exports.uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      format: req.file.format,
      width: req.file.width,
      height: req.file.height
    }
  });
});

/**
 * Generate upload signature for direct frontend uploads
 */
exports.getUploadSignature = catchAsync(async (req, res) => {
  const { folder = 'products', tags, publicId } = req.body;
  
  // Generate signature with optional parameters
  const params = {
    folder: `dudu-store/${folder}`
  };
  
  if (tags) params.tags = tags;
  if (publicId) params.public_id = publicId;
  
  const signatureData = generateUploadSignature(params);
  
  res.status(200).json({
    status: 'success',
    data: signatureData
  });
});

/**
 * Delete image from Cloudinary
 */
exports.deleteImage = catchAsync(async (req, res) => {
  const { publicId } = req.params;
  
  if (!publicId) {
    return res.status(400).json({
      status: 'error',
      message: 'Public ID is required'
    });
  }
  
  const result = await cloudinary.uploader.destroy(publicId);
  
  if (result.result !== 'ok') {
    return res.status(400).json({
      status: 'error',
      message: 'Failed to delete image',
      details: result
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      result
    }
  });
});

/**
 * Get media library
 */
exports.getMediaLibrary = catchAsync(async (req, res) => {
  const { 
    folder = 'dudu-store', 
    type = 'image',
    max_results = 30,
    next_cursor = null
  } = req.query;
  
  const result = await cloudinary.search
    .expression(`folder:${folder}/*`)
    .sort_by('created_at', 'desc')
    .max_results(max_results)
    .next_cursor(next_cursor)
    .execute();
  
  res.status(200).json({
    status: 'success',
    data: {
      resources: result.resources,
      total_count: result.total_count,
      next_cursor: result.next_cursor
    }
  });
});

/**
 * Create media folder
 */
exports.createMediaFolder = catchAsync(async (req, res) => {
  const { folderName } = req.body;
  
  if (!folderName) {
    return res.status(400).json({
      status: 'error',
      message: 'Folder name is required'
    });
  }
  
  // Cloudinary doesn't have a direct API for creating empty folders
  // We'll create a placeholder file and then delete it
  const placeholder = await cloudinary.uploader.upload(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    { 
      folder: `dudu-store/${folderName}`,
      public_id: 'placeholder'
    }
  );
  
  await cloudinary.uploader.destroy(placeholder.public_id);
  
  res.status(201).json({
    status: 'success',
    data: {
      folder: `dudu-store/${folderName}`
    }
  });
});

/**
 * Track media usage
 */
exports.trackMediaUsage = catchAsync(async (req, res) => {
  const { publicId, entityType, entityId } = req.body;
  
  if (!publicId || !entityType || !entityId) {
    return res.status(400).json({
      status: 'error',
      message: 'Public ID, entity type, and entity ID are required'
    });
  }
  
  // Check if tracking record already exists
  const existingRecord = await db.query(
    'SELECT * FROM media_usage WHERE public_id = $1 AND entity_type = $2 AND entity_id = $3',
    [publicId, entityType, entityId]
  );
  
  if (existingRecord.rows.length > 0) {
    // Update existing record
    await db.query(
      'UPDATE media_usage SET updated_at = $1 WHERE public_id = $2 AND entity_type = $3 AND entity_id = $4',
      [new Date(), publicId, entityType, entityId]
    );
  } else {
    // Create new record
    await db.query(
      'INSERT INTO media_usage (public_id, entity_type, entity_id) VALUES ($1, $2, $3)',
      [publicId, entityType, entityId]
    );
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      publicId,
      entityType,
      entityId
    }
  });
});