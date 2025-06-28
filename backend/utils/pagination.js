/**
 * Create pagination object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {Object} - Pagination object
 */
exports.createPagination = (page, limit, totalItems) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    page: currentPage,
    limit: itemsPerPage,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

/**
 * Calculate offset for pagination
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {number} - Offset
 */
exports.calculateOffset = (page, limit) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  
  return (currentPage - 1) * itemsPerPage;
};

/**
 * Create pagination links
 * @param {Object} pagination - Pagination object
 * @param {string} baseUrl - Base URL for links
 * @param {Object} query - Query parameters
 * @returns {Object} - Pagination links
 */
exports.createPaginationLinks = (pagination, baseUrl, query = {}) => {
  const { page, limit, totalPages } = pagination;
  const links = {};
  
  // Create query string
  const createQueryString = (page) => {
    const params = new URLSearchParams({ ...query, page, limit });
    return params.toString();
  };
  
  // First page
  links.first = `${baseUrl}?${createQueryString(1)}`;
  
  // Last page
  links.last = `${baseUrl}?${createQueryString(totalPages)}`;
  
  // Previous page
  if (page > 1) {
    links.prev = `${baseUrl}?${createQueryString(page - 1)}`;
  }
  
  // Next page
  if (page < totalPages) {
    links.next = `${baseUrl}?${createQueryString(page + 1)}`;
  }
  
  return links;
};