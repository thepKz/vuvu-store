const db = require('../config/db.config');
const { cloudinary } = require('../config/cloudinary.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all categories
 */
exports.getAllCategories = catchAsync(async (req, res) => {
  const result = await db.query(
    `SELECT c.*, 
            (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count,
            p.name as parent_name
     FROM categories c
     LEFT JOIN categories p ON c.parent_id = p.id
     ORDER BY c.name`
  );

  const categories = result.rows;

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

/**
 * Get category by ID
 */
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT c.*, 
            (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count,
            p.name as parent_name
     FROM categories c
     LEFT JOIN categories p ON c.parent_id = p.id
     WHERE c.id = $1`,
    [id]
  );

  const category = result.rows[0];

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Get subcategories if any
  const subcategoriesResult = await db.query(
    `SELECT id, name, description, slug, image
     FROM categories
     WHERE parent_id = $1
     ORDER BY name`,
    [id]
  );

  category.subcategories = subcategoriesResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Get products by category
 */
exports.getCategoryProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 10, sort = 'created_at', order = 'desc' } = req.query;

  // Check if category exists
  const categoryCheck = await db.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );

  if (categoryCheck.rows.length === 0) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Get subcategories if any
  const subcategoriesResult = await db.query(
    'SELECT id FROM categories WHERE parent_id = $1',
    [id]
  );

  const subcategoryIds = subcategoriesResult.rows.map(row => row.id);
  
  // Build query to include products from subcategories
  let query = `
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = $1
  `;

  const queryParams = [id];
  let paramIndex = 2;

  if (subcategoryIds.length > 0) {
    const placeholders = subcategoryIds.map((_, i) => `$${paramIndex + i}`).join(', ');
    query += ` OR p.category_id IN (${placeholders})`;
    queryParams.push(...subcategoryIds);
    paramIndex += subcategoryIds.length;
  }

  // Add sorting
  query += ` ORDER BY p.${sort} ${order.toUpperCase()}`;

  // Add pagination
  const offset = (page - 1) * limit;
  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  // Count total products for pagination
  let countQuery = `
    SELECT COUNT(*) 
    FROM products 
    WHERE category_id = $1
  `;

  const countParams = [id];
  paramIndex = 2;

  if (subcategoryIds.length > 0) {
    const placeholders = subcategoryIds.map((_, i) => `$${paramIndex + i}`).join(', ');
    countQuery += ` OR category_id IN (${placeholders})`;
    countParams.push(...subcategoryIds);
  }

  // Execute queries
  const [productsResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, countParams)
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
 * Create a new category
 */
exports.createCategory = catchAsync(async (req, res) => {
  const { name, description, slug, parent_id } = req.body;

  // Validate required fields
  if (!name || !slug) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and slug are required fields'
    });
  }

  // Check if slug is unique
  const slugCheck = await db.query(
    'SELECT * FROM categories WHERE slug = $1',
    [slug]
  );

  if (slugCheck.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Slug already exists. Please use a unique slug.'
    });
  }

  // Check if parent category exists if provided
  if (parent_id) {
    const parentCheck = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [parent_id]
    );

    if (parentCheck.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Parent category not found'
      });
    }
  }

  // Create category
  const result = await db.query(
    `INSERT INTO categories (
      id, name, description, slug, image, parent_id
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      uuidv4(),
      name,
      description || null,
      slug,
      req.file?.path || null,
      parent_id || null
    ]
  );

  const category = result.rows[0];

  res.status(201).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Update a category
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, slug, parent_id } = req.body;

  // Check if category exists
  const categoryCheck = await db.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );

  if (categoryCheck.rows.length === 0) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Check if slug is unique if provided
  if (slug) {
    const slugCheck = await db.query(
      'SELECT * FROM categories WHERE slug = $1 AND id != $2',
      [slug, id]
    );

    if (slugCheck.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Slug already exists. Please use a unique slug.'
      });
    }
  }

  // Check if parent category exists if provided
  if (parent_id) {
    // Prevent circular reference
    if (parent_id === id) {
      return res.status(400).json({
        status: 'error',
        message: 'A category cannot be its own parent'
      });
    }

    const parentCheck = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [parent_id]
    );

    if (parentCheck.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Parent category not found'
      });
    }

    // Check for circular reference in the hierarchy
    const checkCircularRef = async (childId, potentialParentId) => {
      if (childId === potentialParentId) return true;
      
      const result = await db.query(
        'SELECT parent_id FROM categories WHERE id = $1',
        [potentialParentId]
      );
      
      if (!result.rows[0].parent_id) return false;
      
      return checkCircularRef(childId, result.rows[0].parent_id);
    };

    const isCircular = await checkCircularRef(id, parent_id);
    if (isCircular) {
      return res.status(400).json({
        status: 'error',
        message: 'Circular reference detected in category hierarchy'
      });
    }
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

  if (slug !== undefined) {
    updateFields.push(`slug = $${paramIndex++}`);
    queryParams.push(slug);
  }

  if (parent_id !== undefined) {
    updateFields.push(`parent_id = $${paramIndex++}`);
    queryParams.push(parent_id || null);
  }

  if (req.file) {
    updateFields.push(`image = $${paramIndex++}`);
    queryParams.push(req.file.path);
  }

  // Add updated_at timestamp
  updateFields.push(`updated_at = $${paramIndex++}`);
  queryParams.push(new Date());

  // Add category ID to params
  queryParams.push(id);

  // Update category if there are fields to update
  if (updateFields.length > 0) {
    const updateQuery = `
      UPDATE categories
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(updateQuery, queryParams);
    const category = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        category
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
 * Delete a category
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if category exists
  const categoryCheck = await db.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );

  if (categoryCheck.rows.length === 0) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Check if category has subcategories
  const subcategoriesCheck = await db.query(
    'SELECT * FROM categories WHERE parent_id = $1',
    [id]
  );

  if (subcategoriesCheck.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
    });
  }

  // Check if category has products
  const productsCheck = await db.query(
    'SELECT * FROM products WHERE category_id = $1',
    [id]
  );

  if (productsCheck.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete category with products. Please delete or reassign products first.'
    });
  }

  // Delete category image from Cloudinary if exists
  const category = categoryCheck.rows[0];
  if (category.image) {
    const publicId = category.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`dudu-store/categories/${publicId}`);
  }

  // Delete category
  await db.query(
    'DELETE FROM categories WHERE id = $1',
    [id]
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});