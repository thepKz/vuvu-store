/**
 * API Features class for filtering, sorting, and pagination
 */
class APIFeatures {
  /**
   * Constructor
   * @param {Object} query - Database query
   * @param {Object} queryString - Request query parameters
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filter query based on query parameters
   * @returns {APIFeatures} - This instance for chaining
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.where(JSON.parse(queryStr));

    return this;
  }

  /**
   * Sort query results
   * @returns {APIFeatures} - This instance for chaining
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.orderBy(sortBy);
    } else {
      this.query = this.query.orderBy('created_at', { ascending: false });
    }

    return this;
  }

  /**
   * Limit fields in query results
   * @returns {APIFeatures} - This instance for chaining
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',');
      this.query = this.query.select(...fields);
    }

    return this;
  }

  /**
   * Paginate query results
   * @returns {APIFeatures} - This instance for chaining
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const offset = (page - 1) * limit;

    this.query = this.query.range(offset, offset + limit - 1);

    return this;
  }
}

module.exports = APIFeatures;