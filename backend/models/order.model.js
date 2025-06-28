/**
 * Order model
 * 
 * This file defines the structure and validation for order data
 */

/**
 * Validate order data
 * @param {Object} data - Order data to validate
 * @returns {Object} - Validation result with errors if any
 */
exports.validateOrder = (data) => {
  const errors = {};

  // Validate items
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'Order must contain at least one item';
  } else {
    const itemErrors = [];
    
    data.items.forEach((item, index) => {
      const itemError = {};
      
      if (!item.product_id) {
        itemError.product_id = 'Product ID is required';
      }
      
      if (!item.quantity) {
        itemError.quantity = 'Quantity is required';
      } else if (isNaN(item.quantity) || parseInt(item.quantity) <= 0) {
        itemError.quantity = 'Quantity must be a positive integer';
      }
      
      if (Object.keys(itemError).length > 0) {
        itemErrors.push({ index, errors: itemError });
      }
    });
    
    if (itemErrors.length > 0) {
      errors.items = itemErrors;
    }
  }

  // Validate shipping address
  if (!data.shipping_address) {
    errors.shipping_address = 'Shipping address is required';
  }

  // Validate payment method
  if (!data.payment_method) {
    errors.payment_method = 'Payment method is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format order data for response
 * @param {Object} order - Raw order data from database
 * @param {Array} items - Order items
 * @returns {Object} - Formatted order data
 */
exports.formatOrder = (order, items = []) => {
  return {
    id: order.id,
    user_id: order.user_id,
    user: order.email ? {
      email: order.email,
      first_name: order.first_name,
      last_name: order.last_name,
      full_name: `${order.first_name} ${order.last_name}`
    } : undefined,
    status: order.status,
    status_display: getStatusDisplay(order.status),
    total_amount: order.total_amount,
    formatted_total: formatPrice(order.total_amount),
    shipping_address: order.shipping_address,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    payment_status_display: getPaymentStatusDisplay(order.payment_status),
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: items.map(item => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      variant_id: item.variant_id,
      variant_name: item.variant_name,
      quantity: item.quantity,
      price: item.price,
      formatted_price: formatPrice(item.price),
      subtotal: item.price * item.quantity,
      formatted_subtotal: formatPrice(item.price * item.quantity)
    })),
    item_count: order.item_count || items.length
  };
};

/**
 * Get display text for order status
 * @param {string} status - Order status
 * @returns {string} - Display text
 */
function getStatusDisplay(status) {
  const statusMap = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  };
  
  return statusMap[status] || status;
}

/**
 * Get display text for payment status
 * @param {string} status - Payment status
 * @returns {string} - Display text
 */
function getPaymentStatusDisplay(status) {
  const statusMap = {
    'pending': 'Chờ thanh toán',
    'paid': 'Đã thanh toán',
    'failed': 'Thanh toán thất bại',
    'refunded': 'Đã hoàn tiền'
  };
  
  return statusMap[status] || status;
}

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