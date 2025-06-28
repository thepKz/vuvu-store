const db = require('../config/db.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = catchAsync(async (req, res) => {
  // Get total products
  const productsQuery = `
    SELECT COUNT(*) as total_products,
           COUNT(*) FILTER (WHERE stock > 0) as in_stock,
           COUNT(*) FILTER (WHERE stock = 0) as out_of_stock
    FROM products
  `;
  
  // Get total orders
  const ordersQuery = `
    SELECT COUNT(*) as total_orders,
           COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
           COUNT(*) FILTER (WHERE status = 'processing') as processing_orders,
           COUNT(*) FILTER (WHERE status = 'shipped') as shipped_orders,
           COUNT(*) FILTER (WHERE status = 'delivered') as delivered_orders,
           COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders
    FROM orders
  `;
  
  // Get total users
  const usersQuery = `
    SELECT COUNT(*) as total_users,
           COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users
    FROM users
  `;
  
  // Get total revenue
  const revenueQuery = `
    SELECT 
      SUM(total_amount) as total_revenue,
      SUM(total_amount) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as monthly_revenue,
      SUM(total_amount) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as weekly_revenue
    FROM orders
    WHERE status != 'cancelled'
  `;
  
  // Get recent orders
  const recentOrdersQuery = `
    SELECT o.id, o.user_id, o.status, o.total_amount, o.created_at,
           u.email, u.first_name, u.last_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
  
  // Get low stock products
  const lowStockQuery = `
    SELECT id, name, stock, price
    FROM products
    WHERE stock > 0 AND stock <= 5
    ORDER BY stock ASC
    LIMIT 5
  `;
  
  const [
    products,
    orders,
    users,
    revenue,
    recentOrders,
    lowStock
  ] = await Promise.all([
    db.query(productsQuery),
    db.query(ordersQuery),
    db.query(usersQuery),
    db.query(revenueQuery),
    db.query(recentOrdersQuery),
    db.query(lowStockQuery)
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      products: products.rows[0],
      orders: orders.rows[0],
      users: users.rows[0],
      revenue: revenue.rows[0],
      recentOrders: recentOrders.rows,
      lowStock: lowStock.rows
    }
  });
});

/**
 * Bulk create products
 */
exports.bulkCreateProducts = catchAsync(async (req, res) => {
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
    
    const createdProducts = [];
    
    for (const product of products) {
      // Validate required fields
      if (!product.name || !product.price || !product.category_id) {
        throw new AppError('Name, price, and category are required for each product', 400);
      }
      
      // Insert product
      const productResult = await client.query(
        `INSERT INTO products (
          id, name, description, price, original_price, stock, 
          category_id, is_featured, is_new, is_sale, badge, image
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          uuidv4(),
          product.name,
          product.description || null,
          product.price,
          product.original_price || null,
          product.stock || 0,
          product.category_id,
          product.is_featured || false,
          product.is_new || false,
          product.is_sale || false,
          product.badge || null,
          product.image || null
        ]
      );
      
      const createdProduct = productResult.rows[0];
      
      // Add to collections if specified
      if (product.collections && Array.isArray(product.collections)) {
        for (const collectionId of product.collections) {
          await client.query(
            'INSERT INTO product_collection (product_id, collection_id) VALUES ($1, $2)',
            [createdProduct.id, collectionId]
          );
        }
      }
      
      // Add variants if specified
      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          await client.query(
            `INSERT INTO product_variants (
              id, product_id, name, price, stock, image
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              uuidv4(),
              createdProduct.id,
              variant.name,
              variant.price,
              variant.stock || 0,
              variant.image || null
            ]
          );
        }
      }
      
      createdProducts.push(createdProduct);
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      status: 'success',
      results: createdProducts.length,
      data: {
        products: createdProducts
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
 * Bulk update products
 */
exports.bulkUpdateProducts = catchAsync(async (req, res) => {
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
    
    for (const product of products) {
      // Validate product ID
      if (!product.id) {
        throw new AppError('Product ID is required for each product', 400);
      }
      
      // Check if product exists
      const productCheck = await client.query(
        'SELECT * FROM products WHERE id = $1',
        [product.id]
      );
      
      if (productCheck.rows.length === 0) {
        throw new AppError(`Product with ID ${product.id} not found`, 404);
      }
      
      // Build update query dynamically
      const updateFields = [];
      const queryParams = [];
      let paramIndex = 1;
      
      if (product.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        queryParams.push(product.name);
      }
      
      if (product.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        queryParams.push(product.description);
      }
      
      if (product.price !== undefined) {
        updateFields.push(`price = $${paramIndex++}`);
        queryParams.push(product.price);
      }
      
      if (product.original_price !== undefined) {
        updateFields.push(`original_price = $${paramIndex++}`);
        queryParams.push(product.original_price);
      }
      
      if (product.stock !== undefined) {
        updateFields.push(`stock = $${paramIndex++}`);
        queryParams.push(product.stock);
      }
      
      if (product.category_id !== undefined) {
        updateFields.push(`category_id = $${paramIndex++}`);
        queryParams.push(product.category_id);
      }
      
      if (product.is_featured !== undefined) {
        updateFields.push(`is_featured = $${paramIndex++}`);
        queryParams.push(product.is_featured);
      }
      
      if (product.is_new !== undefined) {
        updateFields.push(`is_new = $${paramIndex++}`);
        queryParams.push(product.is_new);
      }
      
      if (product.is_sale !== undefined) {
        updateFields.push(`is_sale = $${paramIndex++}`);
        queryParams.push(product.is_sale);
      }
      
      if (product.badge !== undefined) {
        updateFields.push(`badge = $${paramIndex++}`);
        queryParams.push(product.badge);
      }
      
      if (product.image !== undefined) {
        updateFields.push(`image = $${paramIndex++}`);
        queryParams.push(product.image);
      }
      
      // Add updated_at timestamp
      updateFields.push(`updated_at = $${paramIndex++}`);
      queryParams.push(new Date());
      
      // Add product ID to params
      queryParams.push(product.id);
      
      // Update product if there are fields to update
      if (updateFields.length > 0) {
        const updateQuery = `
          UPDATE products
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const productResult = await client.query(updateQuery, queryParams);
        const updatedProduct = productResult.rows[0];
        
        // Update collections if specified
        if (product.collections && Array.isArray(product.collections)) {
          // Remove existing collection associations
          await client.query(
            'DELETE FROM product_collection WHERE product_id = $1',
            [product.id]
          );
          
          // Add new collection associations
          for (const collectionId of product.collections) {
            await client.query(
              'INSERT INTO product_collection (product_id, collection_id) VALUES ($1, $2)',
              [product.id, collectionId]
            );
          }
        }
        
        updatedProducts.push(updatedProduct);
      }
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({
      status: 'success',
      results: updatedProducts.length,
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
 * Bulk delete products
 */
exports.bulkDeleteProducts = catchAsync(async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Product IDs array is required'
    });
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Delete product-collection associations
    await client.query(
      'DELETE FROM product_collection WHERE product_id = ANY($1)',
      [productIds]
    );
    
    // Delete product variants
    await client.query(
      'DELETE FROM product_variants WHERE product_id = ANY($1)',
      [productIds]
    );
    
    // Delete product reviews
    await client.query(
      'DELETE FROM reviews WHERE product_id = ANY($1)',
      [productIds]
    );
    
    // Delete product views
    await client.query(
      'DELETE FROM product_views WHERE product_id = ANY($1)',
      [productIds]
    );
    
    // Delete products
    const result = await client.query(
      'DELETE FROM products WHERE id = ANY($1) RETURNING id',
      [productIds]
    );
    
    await client.query('COMMIT');
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        deletedIds: result.rows.map(row => row.id)
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
 * Export products
 */
exports.exportProducts = catchAsync(async (req, res) => {
  const { format = 'json' } = req.query;
  
  // Get all products with their categories and variants
  const productsResult = await db.query(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.name
  `);
  
  const products = productsResult.rows;
  
  // Get variants for each product
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variantsResult = await db.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [product.id]
      );
      
      const collectionsResult = await db.query(
        `SELECT c.* 
         FROM collections c
         JOIN product_collection pc ON c.id = pc.collection_id
         WHERE pc.product_id = $1`,
        [product.id]
      );
      
      return {
        ...product,
        variants: variantsResult.rows,
        collections: collectionsResult.rows
      };
    })
  );
  
  if (format === 'csv') {
    // Generate CSV
    const fields = [
      'id', 'name', 'description', 'price', 'original_price', 'stock',
      'category_id', 'category_name', 'is_featured', 'is_new', 'is_sale',
      'badge', 'image', 'created_at', 'updated_at'
    ];
    
    const csv = [
      fields.join(','),
      ...productsWithVariants.map(product => {
        return fields.map(field => {
          const value = product[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: productsWithVariants
    }
  });
});

/**
 * Export orders
 */
exports.exportOrders = catchAsync(async (req, res) => {
  const { format = 'json', startDate, endDate } = req.query;
  
  let query = `
    SELECT o.*, 
           u.email, u.first_name, u.last_name,
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (startDate) {
    query += ` AND o.created_at >= $${paramIndex++}`;
    queryParams.push(new Date(startDate));
  }
  
  if (endDate) {
    query += ` AND o.created_at <= $${paramIndex++}`;
    queryParams.push(new Date(endDate));
  }
  
  query += ` ORDER BY o.created_at DESC`;
  
  const ordersResult = await db.query(query, queryParams);
  const orders = ordersResult.rows;
  
  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const itemsResult = await db.query(
        `SELECT oi.*, p.name as product_name, pv.name as variant_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         LEFT JOIN product_variants pv ON oi.variant_id = pv.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      
      return {
        ...order,
        items: itemsResult.rows
      };
    })
  );
  
  if (format === 'csv') {
    // Generate CSV
    const fields = [
      'id', 'user_id', 'email', 'first_name', 'last_name', 'status',
      'total_amount', 'payment_method', 'payment_status', 'created_at'
    ];
    
    const csv = [
      fields.join(','),
      ...ordersWithItems.map(order => {
        return fields.map(field => {
          const value = order[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders: ordersWithItems
    }
  });
});

/**
 * Export users
 */
exports.exportUsers = catchAsync(async (req, res) => {
  const { format = 'json' } = req.query;
  
  const usersResult = await db.query(`
    SELECT id, email, first_name, last_name, phone, address, role, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `);
  
  const users = usersResult.rows;
  
  if (format === 'csv') {
    // Generate CSV
    const fields = [
      'id', 'email', 'first_name', 'last_name', 'phone', 'address', 'role', 'created_at'
    ];
    
    const csv = [
      fields.join(','),
      ...users.map(user => {
        return fields.map(field => {
          const value = user[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

/**
 * Import products
 */
exports.importProducts = catchAsync(async (req, res) => {
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
    
    const importedProducts = [];
    const errors = [];
    
    for (const [index, product] of products.entries()) {
      try {
        // Validate required fields
        if (!product.name || !product.price || !product.category_id) {
          throw new Error('Name, price, and category are required for each product');
        }
        
        // Check if category exists
        const categoryCheck = await client.query(
          'SELECT * FROM categories WHERE id = $1',
          [product.category_id]
        );
        
        if (categoryCheck.rows.length === 0) {
          throw new Error(`Category with ID ${product.category_id} not found`);
        }
        
        // Insert product
        const productResult = await client.query(
          `INSERT INTO products (
            id, name, description, price, original_price, stock, 
            category_id, is_featured, is_new, is_sale, badge, image
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *`,
          [
            product.id || uuidv4(),
            product.name,
            product.description || null,
            product.price,
            product.original_price || null,
            product.stock || 0,
            product.category_id,
            product.is_featured || false,
            product.is_new || false,
            product.is_sale || false,
            product.badge || null,
            product.image || null
          ]
        );
        
        const importedProduct = productResult.rows[0];
        
        // Add to collections if specified
        if (product.collections && Array.isArray(product.collections)) {
          for (const collectionId of product.collections) {
            // Check if collection exists
            const collectionCheck = await client.query(
              'SELECT * FROM collections WHERE id = $1',
              [collectionId]
            );
            
            if (collectionCheck.rows.length === 0) {
              throw new Error(`Collection with ID ${collectionId} not found`);
            }
            
            await client.query(
              'INSERT INTO product_collection (product_id, collection_id) VALUES ($1, $2)',
              [importedProduct.id, collectionId]
            );
          }
        }
        
        // Add variants if specified
        if (product.variants && Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            if (!variant.name || !variant.price) {
              throw new Error('Name and price are required for each variant');
            }
            
            await client.query(
              `INSERT INTO product_variants (
                id, product_id, name, price, stock, image
              ) VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                variant.id || uuidv4(),
                importedProduct.id,
                variant.name,
                variant.price,
                variant.stock || 0,
                variant.image || null
              ]
            );
          }
        }
        
        importedProducts.push(importedProduct);
      } catch (error) {
        errors.push({
          index,
          product: product.name || `Product at index ${index}`,
          error: error.message
        });
      }
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({
      status: 'success',
      results: importedProducts.length,
      errors: errors.length > 0 ? errors : null,
      data: {
        products: importedProducts
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
 * Get system settings
 */
exports.getSettings = catchAsync(async (req, res) => {
  const result = await db.query('SELECT * FROM settings');
  
  const settings = {};
  
  for (const row of result.rows) {
    settings[row.key] = row.value;
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

/**
 * Update system settings
 */
exports.updateSettings = catchAsync(async (req, res) => {
  const { settings } = req.body;
  
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({
      status: 'error',
      message: 'Settings object is required'
    });
  }
  
  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    for (const [key, value] of Object.entries(settings)) {
      // Check if setting exists
      const settingCheck = await client.query(
        'SELECT * FROM settings WHERE key = $1',
        [key]
      );
      
      if (settingCheck.rows.length > 0) {
        // Update existing setting
        await client.query(
          'UPDATE settings SET value = $1, updated_at = $2 WHERE key = $3',
          [value, new Date(), key]
        );
      } else {
        // Create new setting
        await client.query(
          'INSERT INTO settings (key, value) VALUES ($1, $2)',
          [key, value]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Get updated settings
    const result = await db.query('SELECT * FROM settings');
    
    const updatedSettings = {};
    
    for (const row of result.rows) {
      updatedSettings[row.key] = row.value;
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        settings: updatedSettings
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});