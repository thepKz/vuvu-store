const db = require('../config/db.config');
const { cloudinary } = require('../config/cloudinary.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all collections
 */
exports.getAllCollections = catchAsync(async (req, res) => {
  const result = await db.query(
    `SELECT c.*, 
            (SELECT COUNT(*) FROM product_collection WHERE collection_id = c.id) as product_count
     FROM collections c
     ORDER BY c.name`
  );

  const collections = result.rows;

  res.status(200).json({
    status: 'success',
    results: collections.length,
    data: {
      collections
    }
  });
});

/**
 * Get collection by ID
 */
exports.getCollectionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT c.*, 
            (SELECT COUNT(*) FROM product_collection WHERE collection_id = c.id) as product_count
     FROM collections c
     WHERE c.id = $1`,
    [id]
  );

  const collection = result.rows[0];

  if (!collection) {
    return next(new AppError('No collection found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      collection
    }
  });
});

/**
 * Get products by collection
 */
exports.getCollectionProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 10, sort = 'created_at', order = 'desc' } = req.query;

  // Check if collection exists
  const collectionCheck = await db.query(
    'SELECT * FROM collections WHERE id = $1',
    [id]
  );

  if (collectionCheck.rows.length === 0) {
    return next(new AppError('No collection found with that ID', 404));
  }

  // Get products in collection
  const query = `
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN product_collection pc ON p.id = pc.product_id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE pc.collection_id = $1
    ORDER BY p.${sort} ${order.toUpperCase()}
    LIMIT $2 OFFSET $3
  `;

  const offset = (page - 1) * limit;
  const queryParams = [id, limit, offset];

  // Count total products for pagination
  const countQuery = `
    SELECT COUNT(*) 
    FROM product_collection 
    WHERE collection_id = $1
  `;

  // Execute queries
  const [productsResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, [id])
  ]);

  const products = productsResult.rows;
  const totalProducts = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    status: 'success',
    results: products.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalProducts,
      totalPages
    },
    data: {
      products
    }
  });
});

/**
 * Create a new collection
 */
exports.createCollection = catchAsync(async (req, res) => {
  const { name, description, badge, color } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Name is required'
    });
  }

  // Create collection
  const result = await db.query(
    `INSERT INTO collections (
      id, name, description, image, badge, color
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      uuidv4(),
      name,
      description || null,
      req.file?.path || null,
      badge || null,
      color || null
    ]
  );

  const collection = result.rows[0];

  res.status(201).json({
    status: 'success',
    data: {
      collection
    }
  });
});

/**
 * Update a collection
 */
exports.updateCollection = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, badge, color } = req.body;

  // Check if collection exists
  const collectionCheck = await db.query(
    'SELECT * FROM collections WHERE id = $1',
    [id]
  );

  if (collectionCheck.rows.length === 0) {
    return next(new AppError('No collection found with that ID', 404));
  }

  // Build update query dynamically
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updateFields.push(`name = $${paramIndex++}`);
    queryParams.push(name);
  }

  if (description !== undefined) {
    updateFields.push(`description = $${paramIndex++}`);
    queryParams.push(description);
  }

  if (badge !== undefined) {
    updateFields.push(`badge = $${paramIndex++}`);
    queryParams.push(badge);
  }

  if (color !== undefined) {
    updateFields.push(`color = $${paramIndex++}`);
    queryParams.push(color);
  }

  if (req.file) {
    updateFields.push(`image = $${paramIndex++}`);
    queryParams.push(req.file.path);
  }

  // Add updated_at timestamp
  updateFields.push(`updated_at = $${paramIndex++}`);
  queryParams.push(new Date());

  // Add collection ID to params
  queryParams.push(id);

  // Update collection if there are fields to update
  if (updateFields.length > 0) {
    const updateQuery = `
      UPDATE collections
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(updateQuery, queryParams);
    const collection = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        collection
      }
    });
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'No fields to update'
    });
  }
});

/**
 * Delete a collection
 */
exports.deleteCollection = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if collection exists
  const collectionCheck = await db.query(
    'SELECT * FROM collections WHERE id = $1',
    [id]
  );

  if (collectionCheck.rows.length === 0) {
    return next(new AppError('No collection found with that ID', 404));
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    // Delete collection image from Cloudinary if exists
    const collection = collectionCheck.rows[0];
    if (collection.image) {
      const publicId = collection.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`dudu-store/collections/${publicId}`);
    }

    // Delete product-collection associations
    await client.query(
      'DELETE FROM product_collection WHERE collection_id = $1',
      [id]
    );

    // Delete collection
    await client.query(
      'DELETE FROM collections WHERE id = $1',
      [id]
    );

    await client.query('COMMIT');

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Add product to collection
 */
exports.addProductToCollection = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;

  // Check if collection exists
  const collectionCheck = await db.query(
    'SELECT * FROM collections WHERE id = $1',
    [id]
  );

  if (collectionCheck.rows.length === 0) {
    return next(new AppError('No collection found with that ID', 404));
  }

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [productId]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Check if product is already in collection
  const existingCheck = await db.query(
    'SELECT * FROM product_collection WHERE collection_id = $1 AND product_id = $2',
    [id, productId]
  );

  if (existingCheck.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Product is already in this collection'
    });
  }

  // Add product to collection
  await db.query(
    'INSERT INTO product_collection (collection_id, product_id) VALUES ($1, $2)',
    [id, productId]
  );

  res.status(201).json({
    status: 'success',
    data: {
      message: 'Product added to collection'
    }
  });
});

/**
 * Remove product from collection
 */
exports.removeProductFromCollection = catchAsync(async (req, res, next) => {
  const { id, productId } = req.params;

  // Check if collection exists
  const collectionCheck = await db.query(
    'SELECT * FROM collections WHERE id = $1',
    [id]
  );

  if (collectionCheck.rows.length === 0) {
    return next(new AppError('No collection found with that ID', 404));
  }

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [productId]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Check if product is in collection
  const existingCheck = await db.query(
    'SELECT * FROM product_collection WHERE collection_id = $1 AND product_id = $2',
    [id, productId]
  );

  if (existingCheck.rows.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Product is not in this collection'
    });
  }

  // Remove product from collection
  await db.query(
    'DELETE FROM product_collection WHERE collection_id = $1 AND product_id = $2',
    [id, productId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Product removed from collection'
    }
  });
});