const db = require('../../config/db.config');
const { cloudinary } = require('../../config/cloudinary.config');
const { catchAsync, AppError } = require('../../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all products with advanced filtering for admin
 */
exports.getAllProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'created_at',
    order = 'desc',
    category,
    collection,
    search,
    minPrice,
    maxPrice,
    inStock,
    featured,
    isNew,
    isSale
  } = req.query;

  // Build the base query
  let query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  
  // Build query parameters array
  const queryParams = [];
  let paramIndex = 1;

  // Add filters
  if (category) {
    query += ` AND p.category_id = $${paramIndex++}`;
    queryParams.push(category);
  }

  if (collection) {
    query += ` AND p.id IN (
      SELECT product_id FROM product_collection WHERE collection_id = $${paramIndex++}
    )`;
    queryParams.push(collection);
  }

  if (search) {
    query += ` AND (p.name ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex++})`;
    const searchTerm = `%${search}%`;
    queryParams.push(searchTerm, searchTerm);
  }

  if (minPrice) {
    query += ` AND p.price >= $${paramIndex++}`;
    queryParams.push(minPrice);
  }

  if (maxPrice) {
    query += ` AND p.price <= $${paramIndex++}`;
    queryParams.push(maxPrice);
  }

  if (inStock === 'true') {
    query += ` AND p.stock > 0`;
  } else if (inStock === 'false') {
    query += ` AND p.stock = 0`;
  }

  if (featured === 'true') {
    query += ` AND p.is_featured = true`;
  }

  if (isNew === 'true') {
    query += ` AND p.is_new = true`;
  }

  if (isSale === 'true') {
    query += ` AND p.is_sale = true`;
  }

  // Add sorting
  query += ` ORDER BY p.${sort} ${order.toUpperCase()}`;

  // Add pagination
  const offset = (page - 1) * limit;
  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  // Count total products for pagination
  let countQuery = `
    SELECT COUNT(*) FROM products p
    WHERE 1=1
  `;

  // Add the same filters to count query
  let countParams = [];
  paramIndex = 1;

  if (category) {
    countQuery += ` AND p.category_id = $${paramIndex++}`;
    countParams.push(category);
  }

  if (collection) {
    countQuery += ` AND p.id IN (
      SELECT product_id FROM product_collection WHERE collection_id = $${paramIndex++}
    )`;
    countParams.push(collection);
  }

  if (search) {
    countQuery += ` AND (p.name ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex++})`;
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm);
  }

  if (minPrice) {
    countQuery += ` AND p.price >= $${paramIndex++}`;
    countParams.push(minPrice);
  }

  if (maxPrice) {
    countQuery += ` AND p.price <= $${paramIndex++}`;
    countParams.push(maxPrice);
  }

  if (inStock === 'true') {
    countQuery += ` AND p.stock > 0`;
  } else if (inStock === 'false') {
    countQuery += ` AND p.stock = 0`;
  }

  if (featured === 'true') {
    countQuery += ` AND p.is_featured = true`;
  }

  if (isNew === 'true') {
    countQuery += ` AND p.is_new = true`;
  }

  if (isSale === 'true') {
    countQuery += ` AND p.is_sale = true`;
  }

  // Execute queries
  const [productsResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, countParams)
  ]);

  const products = productsResult.rows;
  const totalCount = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: 'success',
    results: products.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
      totalPages
    },
    data: {
      products
    }
  });
});

/**
 * Get product details by ID for admin
 */
exports.getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Get product details
  const productResult = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );

  const product = productResult.rows[0];
  
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Get product variants
  const variantsResult = await db.query(
    'SELECT * FROM product_variants WHERE product_id = $1',
    [id]
  );
  
  // Get product collections
  const collectionsResult = await db.query(
    `SELECT c.* 
     FROM collections c
     JOIN product_collection pc ON c.id = pc.collection_id
     WHERE pc.product_id = $1`,
    [id]
  );

  // Get product reviews
  const reviewsResult = await db.query(
    `SELECT r.*, u.first_name, u.last_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [id]
  );

  // Get product view statistics
  const viewsResult = await db.query(
    `SELECT 
       DATE(created_at) as date,
       COUNT(*) as view_count
     FROM product_views
     WHERE product_id = $1 AND created_at > NOW() - INTERVAL '30 days'
     GROUP BY DATE(created_at)
     ORDER BY date`,
    [id]
  );

  // Combine all data
  const productData = {
    ...product,
    variants: variantsResult.rows,
    collections: collectionsResult.rows,
    reviews: reviewsResult.rows,
    viewStats: viewsResult.rows,
    rating: {
      average: product.rating,
      count: reviewsResult.rows.length
    }
  };

  res.status(200).json({
    status: 'success',
    data: {
      product: productData
    }
  });
});

/**
 * Create a new product
 */
exports.createProduct = catchAsync(async (req, res) => {
  const {
    name,
    description,
    price,
    original_price,
    stock,
    category_id,
    is_featured,
    is_new,
    is_sale,
    badge,
    collections,
    variants
  } = req.body;

  // Validate required fields
  if (!name || !price || !category_id) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, price, and category are required fields'
    });
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Generate product ID
    const productId = uuidv4();
    
    // Insert product
    const productResult = await client.query(
      `INSERT INTO products (
        id, name, description, price, original_price, stock, 
        category_id, is_featured, is_new, is_sale, badge, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        productId,
        name,
        description || null,
        price,
        original_price || null,
        stock || 0,
        category_id,
        is_featured || false,
        is_new || false,
        is_sale || false,
        badge || null,
        req.file?.path || null
      ]
    );

    const product = productResult.rows[0];

    // Add to collections if specified
    if (collections && Array.isArray(collections)) {
      for (const collectionId of collections) {
        await client.query(
          'INSERT INTO product_collection (product_id, collection_id) VALUES ($1, $2)',
          [productId, collectionId]
        );
      }
    }

    // Add variants if specified
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        await client.query(
          `INSERT INTO product_variants (
            id, product_id, name, price, stock, image
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            uuidv4(),
            productId,
            variant.name,
            variant.price,
            variant.stock || 0,
            variant.image || null
          ]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Update a product
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    original_price,
    stock,
    category_id,
    is_featured,
    is_new,
    is_sale,
    badge,
    collections
  } = req.body;

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
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

    if (price !== undefined) {
      updateFields.push(`price = $${paramIndex++}`);
      queryParams.push(price);
    }

    if (original_price !== undefined) {
      updateFields.push(`original_price = $${paramIndex++}`);
      queryParams.push(original_price);
    }

    if (stock !== undefined) {
      updateFields.push(`stock = $${paramIndex++}`);
      queryParams.push(stock);
    }

    if (category_id !== undefined) {
      updateFields.push(`category_id = $${paramIndex++}`);
      queryParams.push(category_id);
    }

    if (is_featured !== undefined) {
      updateFields.push(`is_featured = $${paramIndex++}`);
      queryParams.push(is_featured);
    }

    if (is_new !== undefined) {
      updateFields.push(`is_new = $${paramIndex++}`);
      queryParams.push(is_new);
    }

    if (is_sale !== undefined) {
      updateFields.push(`is_sale = $${paramIndex++}`);
      queryParams.push(is_sale);
    }

    if (badge !== undefined) {
      updateFields.push(`badge = $${paramIndex++}`);
      queryParams.push(badge);
    }

    if (req.file) {
      updateFields.push(`image = $${paramIndex++}`);
      queryParams.push(req.file.path);
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = $${paramIndex++}`);
    queryParams.push(new Date());

    // Add product ID to params
    queryParams.push(id);

    // Update product if there are fields to update
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE products
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const productResult = await client.query(updateQuery, queryParams);
      const product = productResult.rows[0];

      // Update collections if specified
      if (collections && Array.isArray(collections)) {
        // Remove existing collection associations
        await client.query(
          'DELETE FROM product_collection WHERE product_id = $1',
          [id]
        );

        // Add new collection associations
        for (const collectionId of collections) {
          await client.query(
            'INSERT INTO product_collection (product_id, collection_id) VALUES ($1, $2)',
            [id, collectionId]
          );
        }
      }

      await client.query('COMMIT');

      res.status(200).json({
        status: 'success',
        data: {
          product
        }
      });
    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Delete a product
 */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    // Delete product image from Cloudinary if exists
    const product = productCheck.rows[0];
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`dudu-store/products/${publicId}`);
    }

    // Delete product variants
    const variantsResult = await client.query(
      'SELECT * FROM product_variants WHERE product_id = $1',
      [id]
    );
    
    // Delete variant images from Cloudinary
    for (const variant of variantsResult.rows) {
      if (variant.image) {
        const publicId = variant.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`dudu-store/products/${publicId}`);
      }
    }
    
    await client.query(
      'DELETE FROM product_variants WHERE product_id = $1',
      [id]
    );

    // Delete product-collection associations
    await client.query(
      'DELETE FROM product_collection WHERE product_id = $1',
      [id]
    );

    // Delete product reviews
    await client.query(
      'DELETE FROM reviews WHERE product_id = $1',
      [id]
    );

    // Delete product views
    await client.query(
      'DELETE FROM product_views WHERE product_id = $1',
      [id]
    );

    // Delete product
    await client.query(
      'DELETE FROM products WHERE id = $1',
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
 * Manage product variants
 */
exports.getProductVariants = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Get variants
  const variantsResult = await db.query(
    'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY name',
    [id]
  );

  res.status(200).json({
    status: 'success',
    results: variantsResult.rows.length,
    data: {
      variants: variantsResult.rows
    }
  });
});

/**
 * Create product variant
 */
exports.createProductVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, image } = req.body;

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and price are required fields'
    });
  }

  // Create variant
  const variantResult = await db.query(
    `INSERT INTO product_variants (
      id, product_id, name, price, stock, image
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      uuidv4(),
      id,
      name,
      price,
      stock || 0,
      image || (req.file ? req.file.path : null)
    ]
  );

  res.status(201).json({
    status: 'success',
    data: {
      variant: variantResult.rows[0]
    }
  });
});

/**
 * Update product variant
 */
exports.updateProductVariant = catchAsync(async (req, res, next) => {
  const { id, variantId } = req.params;
  const { name, price, stock, image } = req.body;

  // Check if product and variant exist
  const variantCheck = await db.query(
    `SELECT v.* 
     FROM product_variants v
     JOIN products p ON v.product_id = p.id
     WHERE p.id = $1 AND v.id = $2`,
    [id, variantId]
  );

  if (variantCheck.rows.length === 0) {
    return next(new AppError('No variant found with that ID for this product', 404));
  }

  // Build update query dynamically
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updateFields.push(`name = $${paramIndex++}`);
    queryParams.push(name);
  }

  if (price !== undefined) {
    updateFields.push(`price = $${paramIndex++}`);
    queryParams.push(price);
  }

  if (stock !== undefined) {
    updateFields.push(`stock = $${paramIndex++}`);
    queryParams.push(stock);
  }

  if (image !== undefined || req.file) {
    updateFields.push(`image = $${paramIndex++}`);
    queryParams.push(image || (req.file ? req.file.path : null));
  }

  // Add updated_at timestamp
  updateFields.push(`updated_at = $${paramIndex++}`);
  queryParams.push(new Date());

  // Add variant ID to params
  queryParams.push(variantId);

  // Update variant if there are fields to update
  if (updateFields.length > 0) {
    const updateQuery = `
      UPDATE product_variants
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const variantResult = await db.query(updateQuery, queryParams);

    res.status(200).json({
      status: 'success',
      data: {
        variant: variantResult.rows[0]
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
 * Delete product variant
 */
exports.deleteProductVariant = catchAsync(async (req, res, next) => {
  const { id, variantId } = req.params;

  // Check if product and variant exist
  const variantCheck = await db.query(
    `SELECT v.* 
     FROM product_variants v
     JOIN products p ON v.product_id = p.id
     WHERE p.id = $1 AND v.id = $2`,
    [id, variantId]
  );

  if (variantCheck.rows.length === 0) {
    return next(new AppError('No variant found with that ID for this product', 404));
  }

  // Delete variant image from Cloudinary if exists
  const variant = variantCheck.rows[0];
  if (variant.image) {
    const publicId = variant.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`dudu-store/products/${publicId}`);
  }

  // Delete variant
  await db.query(
    'DELETE FROM product_variants WHERE id = $1',
    [variantId]
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Bulk update product stock
 */
exports.bulkUpdateStock = catchAsync(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Products array is required'
    });
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const updatedProducts = [];
    const errors = [];
    
    for (const [index, item] of products.entries()) {
      try {
        if (!item.id) {
          throw new Error('Product ID is required');
        }
        
        if (item.stock === undefined) {
          throw new Error('Stock value is required');
        }
        
        // Update product stock
        if (item.variantId) {
          // Update variant stock
          const variantResult = await client.query(
            `UPDATE product_variants 
             SET stock = $1, updated_at = NOW()
             WHERE id = $2 AND product_id = $3
             RETURNING *`,
            [item.stock, item.variantId, item.id]
          );
          
          if (variantResult.rows.length === 0) {
            throw new Error(`Variant with ID ${item.variantId} not found for product ${item.id}`);
          }
          
          updatedProducts.push({
            id: item.id,
            variantId: item.variantId,
            stock: item.stock,
            name: `Variant of product ${item.id}`
          });
        } else {
          // Update product stock
          const productResult = await client.query(
            `UPDATE products 
             SET stock = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, name, stock`,
            [item.stock, item.id]
          );
          
          if (productResult.rows.length === 0) {
            throw new Error(`Product with ID ${item.id} not found`);
          }
          
          updatedProducts.push(productResult.rows[0]);
        }
      } catch (error) {
        errors.push({
          index,
          id: item.id,
          error: error.message
        });
      }
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({
      status: 'success',
      results: updatedProducts.length,
      errors: errors.length > 0 ? errors : null,
      data: {
        products: updatedProducts
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Get product view statistics
 */
exports.getProductViewStats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { period = 'month' } = req.query;
  
  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }
  
  let timeFilter;
  switch (period) {
    case 'week':
      timeFilter = "created_at > NOW() - INTERVAL '7 days'";
      break;
    case 'month':
      timeFilter = "created_at > NOW() - INTERVAL '30 days'";
      break;
    case 'quarter':
      timeFilter = "created_at > NOW() - INTERVAL '90 days'";
      break;
    case 'year':
      timeFilter = "created_at > NOW() - INTERVAL '365 days'";
      break;
    default:
      timeFilter = "created_at > NOW() - INTERVAL '30 days'";
  }
  
  // Get views by date
  const viewsByDateQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as view_count
    FROM product_views
    WHERE product_id = $1 AND ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  // Get total views
  const totalViewsQuery = `
    SELECT COUNT(*) as total_views
    FROM product_views
    WHERE product_id = $1 AND ${timeFilter}
  `;
  
  // Get unique viewers
  const uniqueViewersQuery = `
    SELECT COUNT(DISTINCT user_id) as unique_viewers
    FROM product_views
    WHERE product_id = $1 AND user_id IS NOT NULL AND ${timeFilter}
  `;
  
  const [
    viewsByDate,
    totalViews,
    uniqueViewers
  ] = await Promise.all([
    db.query(viewsByDateQuery, [id]),
    db.query(totalViewsQuery, [id]),
    db.query(uniqueViewersQuery, [id])
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalViews: parseInt(totalViews.rows[0].total_views),
      uniqueViewers: parseInt(uniqueViewers.rows[0].unique_viewers),
      viewsByDate: viewsByDate.rows
    }
  });
});