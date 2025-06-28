const { cloudinary, generateUploadSignature } = require('../../config/cloudinary.config');
const { catchAsync, AppError } = require('../../middleware/errorHandler');
const db = require('../../config/db.config');

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
 * Get media usage
 */
exports.getMediaUsage = catchAsync(async (req, res) => {
  const { publicId } = req.params;
  
  if (!publicId) {
    return res.status(400).json({
      status: 'error',
      message: 'Public ID is required'
    });
  }
  
  const result = await db.query(
    `SELECT mu.*, 
            CASE 
              WHEN mu.entity_type = 'product' THEN p.name
              WHEN mu.entity_type = 'category' THEN c.name
              WHEN mu.entity_type = 'collection' THEN col.name
              WHEN mu.entity_type = 'variant' THEN pv.name
              ELSE NULL
            END as entity_name
     FROM media_usage mu
     LEFT JOIN products p ON mu.entity_type = 'product' AND mu.entity_id = p.id
     LEFT JOIN categories c ON mu.entity_type = 'category' AND mu.entity_id = c.id
     LEFT JOIN collections col ON mu.entity_type = 'collection' AND mu.entity_id = col.id
     LEFT JOIN product_variants pv ON mu.entity_type = 'variant' AND mu.entity_id = pv.id
     WHERE mu.public_id = $1`,
    [publicId]
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      usage: result.rows
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
 * Delete media
 */
exports.deleteMedia = catchAsync(async (req, res) => {
  const { publicId } = req.params;
  
  if (!publicId) {
    return res.status(400).json({
      status: 'error',
      message: 'Public ID is required'
    });
  }
  
  // Check if media is in use
  const usageResult = await db.query(
    'SELECT COUNT(*) as usage_count FROM media_usage WHERE public_id = $1',
    [publicId]
  );
  
  const usageCount = parseInt(usageResult.rows[0].usage_count);
  
  if (usageCount > 0) {
    return res.status(400).json({
      status: 'error',
      message: `Cannot delete media that is in use (${usageCount} usages found)`,
      data: {
        usageCount
      }
    });
  }
  
  // Delete from Cloudinary
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
      'INSERT INTO media_usage (id, public_id, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [uuidv4(), publicId, entityType, entityId]
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

/**
 * Get upload signature for direct frontend uploads
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
 * Get media stats
 */
exports.getMediaStats = catchAsync(async (req, res) => {
  // Get Cloudinary account usage
  const usage = await cloudinary.api.usage();
  
  // Get media counts by type
  const mediaCountsQuery = `
    SELECT 
      entity_type,
      COUNT(*) as count
    FROM media_usage
    GROUP BY entity_type
    ORDER BY count DESC
  `;
  
  // Get total media usage
  const totalUsageQuery = `
    SELECT COUNT(*) as total_usage
    FROM media_usage
  `;
  
  // Get unused media (this is a complex query and would require comparing with Cloudinary API)
  // For this example, we'll just return a placeholder
  
  const [
    mediaCounts,
    totalUsage
  ] = await Promise.all([
    db.query(mediaCountsQuery),
    db.query(totalUsageQuery)
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      cloudinaryUsage: usage,
      mediaCounts: mediaCounts.rows,
      totalUsage: parseInt(totalUsage.rows[0].total_usage),
      unusedCount: 0 // Placeholder
    }
  });
});