const db = require('../config/db.config');
const { cloudinary } = require('../config/cloudinary.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { trackProductView } = require('../services/analytics.service');

/**
 * Get all products with filtering, sorting, and pagination
 */
exports.getAllProducts = catchAsync(async (req, res) => {
  // Extract query parameters
  const {
    page = 1,
    limit = 10,
    sort = 'created_at',
    order = 'desc',
    category,
    collection,
    search,
    minPrice,
    maxPrice,
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
  const totalProducts = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalProducts / limit);

  // Get variants for each product
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variantsResult = await db.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [product.id]
      );
      
      return {
        ...product,
        variants: variantsResult.rows
      };
    })
  );

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
      products: productsWithVariants
    }
  });
});

/**
 * Get a single product by ID
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

  // Track product view
  const userId = req.user?.id || null;
  await trackProductView(id, userId, req.ip);

  // Combine all data
  const productData = {
    ...product,
    variants: variantsResult.rows,
    collections: collectionsResult.rows,
    reviews: reviewsResult.rows,
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
    badge
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
    
    // Insert product
    const productResult = await client.query(
      `INSERT INTO products (
        name, description, price, original_price, stock, 
        category_id, is_featured, is_new, is_sale, badge, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        name,
        description,
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
    if (req.body.collections && Array.isArray(req.body.collections)) {
      for (const collectionId of req.body.collections) {
        await client.query(
          'INSERT INTO product_collection (product_id, collection_id) VALUES ($1, $2)',
          [product.id, collectionId]
        );
      }
    }

    // Add variants if specified
    if (req.body.variants && Array.isArray(req.body.variants)) {
      for (const variant of req.body.variants) {
        await client.query(
          `INSERT INTO product_variants (
            product_id, name, price, stock, image
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            product.id,
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
    badge
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
      if (req.body.collections && Array.isArray(req.body.collections)) {
        // Remove existing collection associations
        await client.query(
          'DELETE FROM product_collection WHERE product_id = $1',
          [id]
        );

        // Add new collection associations
        for (const collectionId of req.body.collections) {
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
 * Get featured products
 */
exports.getFeaturedProducts = catchAsync(async (req, res) => {
  const { limit = 8 } = req.query;

  const result = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_featured = true
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );

  const products = result.rows;

  // Get variants for each product
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variantsResult = await db.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [product.id]
      );
      
      return {
        ...product,
        variants: variantsResult.rows
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: productsWithVariants
    }
  });
});

/**
 * Get new products
 */
exports.getNewProducts = catchAsync(async (req, res) => {
  const { limit = 8 } = req.query;

  const result = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_new = true
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );

  const products = result.rows;

  // Get variants for each product
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variantsResult = await db.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [product.id]
      );
      
      return {
        ...product,
        variants: variantsResult.rows
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: productsWithVariants
    }
  });
});

/**
 * Get sale products
 */
exports.getSaleProducts = catchAsync(async (req, res) => {
  const { limit = 8 } = req.query;

  const result = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_sale = true
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );

  const products = result.rows;

  // Get variants for each product
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variantsResult = await db.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [product.id]
      );
      
      return {
        ...product,
        variants: variantsResult.rows
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: productsWithVariants
    }
  });
});

/**
 * Get related products
 */
exports.getRelatedProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;

  // Check if product exists
  const productCheck = await db.query(
    'SELECT category_id FROM products WHERE id = $1',
    [id]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  const categoryId = productCheck.rows[0].category_id;

  // Get related products from same category
  const result = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = $1 AND p.id != $2
     ORDER BY p.rating DESC, p.created_at DESC
     LIMIT $3`,
    [categoryId, id, limit]
  );

  const products = result.rows;

  // Get variants for each product
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variantsResult = await db.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [product.id]
      );
      
      return {
        ...product,
        variants: variantsResult.rows
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: productsWithVariants
    }
  });
});

/**
 * Search products
 */
exports.searchProducts = catchAsync(async (req, res) => {
  const { query, limit = 10 } = req.body;

  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'Search query is required'
    });
  }

  const searchTerm = `%${query}%`;

  const result = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.name ILIKE $1 OR p.description ILIKE $1
     ORDER BY 
       CASE WHEN p.name ILIKE $2 THEN 0
            WHEN p.name ILIKE $1 THEN 1
            ELSE 2
       END,
       p.rating DESC
     LIMIT $3`,
    [searchTerm, `${query}%`, limit]
  );

  const products = result.rows;

  // Get total count for pagination
  const countResult = await db.query(
    `SELECT COUNT(*) 
     FROM products 
     WHERE name ILIKE $1 OR description ILIKE $1`,
    [searchTerm]
  );

  const total = parseInt(countResult.rows[0].count);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    data: {
      products
    }
  });
});

/**
 * Get product variants
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
    'SELECT * FROM product_variants WHERE product_id = $1',
    [id]
  );

  const variants = variantsResult.rows;

  res.status(200).json({
    status: 'success',
    results: variants.length,
    data: {
      variants
    }
  });
});

/**
 * Create product variant
 */
exports.createProductVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

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
      product_id, name, price, stock, image
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      id,
      name,
      price,
      stock || 0,
      req.file?.path || null
    ]
  );

  const variant = variantResult.rows[0];

  res.status(201).json({
    status: 'success',
    data: {
      variant
    }
  });
});

/**
 * Update product variant
 */
exports.updateProductVariant = catchAsync(async (req, res, next) => {
  const { id, variantId } = req.params;
  const { name, price, stock } = req.body;

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

  if (req.file) {
    updateFields.push(`image = $${paramIndex++}`);
    queryParams.push(req.file.path);
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
    const variant = variantResult.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        variant
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