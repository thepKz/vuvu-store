/**
 * Product model
 * 
 * This file defines the structure and validation for product data
 */

/**
 * Validate product data
 * @param {Object} data - Product data to validate
 * @returns {Object} - Validation result with errors if any
 */
exports.validateProduct = (data) => {
  const errors = {};

  // Validate required fields
  if (!data.name) {
    errors.name = 'Product name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  } else if (data.name.length > 255) {
    errors.name = 'Product name must be less than 255 characters';
  }

  if (!data.price) {
    errors.price = 'Product price is required';
  } else if (isNaN(data.price) || parseFloat(data.price) <= 0) {
    errors.price = 'Product price must be a positive number';
  }

  if (!data.category_id) {
    errors.category_id = 'Category is required';
  }

  // Validate optional fields
  if (data.original_price && (isNaN(data.original_price) || parseFloat(data.original_price) <= 0)) {
    errors.original_price = 'Original price must be a positive number';
  }

  if (data.stock && (isNaN(data.stock) || parseInt(data.stock) < 0)) {
    errors.stock = 'Stock must be a non-negative integer';
  }

  // Validate variants if provided
  if (data.variants && Array.isArray(data.variants)) {
    const variantErrors = [];
    
    data.variants.forEach((variant, index) => {
      const variantError = {};
      
      if (!variant.name) {
        variantError.name = 'Variant name is required';
      }
      
      if (!variant.price) {
        variantError.price = 'Variant price is required';
      } else if (isNaN(variant.price) || parseFloat(variant.price) <= 0) {
        variantError.price = 'Variant price must be a positive number';
      }
      
      if (variant.stock && (isNaN(variant.stock) || parseInt(variant.stock) < 0)) {
        variantError.stock = 'Variant stock must be a non-negative integer';
      }
      
      if (Object.keys(variantError).length > 0) {
        variantErrors.push({ index, errors: variantError });
      }
    });
    
    if (variantErrors.length > 0) {
      errors.variants = variantErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format product data for response
 * @param {Object} product - Raw product data from database
 * @param {Array} variants - Product variants
 * @param {Array} collections - Product collections
 * @returns {Object} - Formatted product data
 */
exports.formatProduct = (product, variants = [], collections = []) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    formattedPrice: formatPrice(product.price),
    original_price: product.original_price,
    formattedOriginalPrice: product.original_price ? formatPrice(product.original_price) : null,
    discount: product.original_price ? calculateDiscount(product.price, product.original_price) : null,
    stock: product.stock,
    inStock: product.stock > 0,
    image: product.image,
    category_id: product.category_id,
    category_name: product.category_name,
    is_featured: product.is_featured,
    is_new: product.is_new,
    is_sale: product.is_sale,
    badge: product.badge,
    rating: product.rating,
    view_count: product.view_count,
    created_at: product.created_at,
    updated_at: product.updated_at,
    variants: variants.map(variant => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      formattedPrice: formatPrice(variant.price),
      stock: variant.stock,
      inStock: variant.stock > 0,
      image: variant.image
    })),
    collections: collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      badge: collection.badge,
      color: collection.color
    }))
  };
};

/**
 * Format price as currency
 * @param {number} price - Price to format
 * @returns {string} - Formatted price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

/**
 * Calculate discount percentage
 * @param {number} currentPrice - Current price
 * @param {number} originalPrice - Original price
 * @returns {number} - Discount percentage
 */
function calculateDiscount(currentPrice, originalPrice) {
  return Math.round((1 - (currentPrice / originalPrice)) * 100);
}