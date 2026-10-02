import { query } from '../config/db.js';

/**
 * Maps a database product row to the frontend Product contract
 */
export const mapProductRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || '',
    description: row.description,
    fullDescription: row.full_description || row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    category: row.category,
    brand: row.brand || undefined,
    sku: row.sku || undefined,
    image: row.image_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    stock: Number(row.stock),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    featured: Boolean(row.featured),
    newArrival: Boolean(row.new_arrival),
    tag: row.tag || undefined,
    specifications: typeof row.specifications === 'object' && row.specifications !== null ? row.specifications : {},
    features: Array.isArray(row.features) ? row.features : [],
    dimensions: row.dimensions || undefined,
    weight: row.weight || undefined,
    warranty: row.warranty || undefined,
    shippingInfo: row.shipping_info || undefined,
  };
};

class ProductService {
  /**
   * Retrieves products with filtering, search, sorting, and pagination
   */
  async getProducts(filters = {}) {
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      minRating,
      sort,
      page = 1,
      limit = 120, // generous default so catalog displays comprehensively
    } = filters;

    const conditions = [];
    const values = [];
    let idx = 1;

    // Category filter
    if (category && category !== 'All') {
      conditions.push(`category = $${idx++}`);
      values.push(category);
    }

    // Brand filter
    if (brand && brand !== 'All') {
      conditions.push(`LOWER(brand) = LOWER($${idx++})`);
      values.push(brand);
    }

    // Search query across name, brand, SKU, tagline, description, category
    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(LOWER(name) LIKE $${idx} OR LOWER(COALESCE(brand, '')) LIKE $${idx} OR LOWER(COALESCE(sku, '')) LIKE $${idx} OR LOWER(tagline) LIKE $${idx} OR LOWER(description) LIKE $${idx} OR LOWER(category) LIKE $${idx})`);
      values.push(q);
      idx++;
    }

    // Price range
    if (minPrice !== undefined && minPrice !== null && !isNaN(Number(minPrice))) {
      conditions.push(`price >= $${idx++}`);
      values.push(Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null && !isNaN(Number(maxPrice))) {
      conditions.push(`price <= $${idx++}`);
      values.push(Number(maxPrice));
    }

    // In stock
    if (inStockOnly === true || inStockOnly === 'true') {
      conditions.push(`stock > 0`);
    }

    // Min rating
    if (minRating !== undefined && minRating !== null && !isNaN(Number(minRating)) && Number(minRating) > 0) {
      conditions.push(`rating >= $${idx++}`);
      values.push(Number(minRating));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'ORDER BY featured DESC, id ASC';
    switch (sort) {
      case 'newest':
        orderBy = 'ORDER BY new_arrival DESC, created_at DESC';
        break;
      case 'price-asc':
        orderBy = 'ORDER BY price ASC';
        break;
      case 'price-desc':
        orderBy = 'ORDER BY price DESC';
        break;
      case 'rating':
        orderBy = 'ORDER BY rating DESC, review_count DESC';
        break;
      case 'featured':
      default:
        orderBy = 'ORDER BY featured DESC, id ASC';
        break;
    }

    // Count total matching
    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const countRes = await query(countSql, values);
    const total = parseInt(countRes.rows[0].total, 10);

    // Pagination
    const numLimit = Math.max(1, Math.min(200, Number(limit) || 120));
    const numPage = Math.max(1, Number(page) || 1);
    const offset = (numPage - 1) * numLimit;

    const dataValues = [...values, numLimit, offset];
    const dataSql = `
      SELECT * FROM products
      ${whereClause}
      ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    const dataRes = await query(dataSql, dataValues);
    const products = dataRes.rows.map(mapProductRow);

    return {
      products,
      total,
      page: numPage,
      limit: numLimit,
      totalPages: Math.ceil(total / numLimit),
    };
  }

  /**
   * Retrieves single product by ID
   */
  async getProductById(id) {
    const res = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapProductRow(res.rows[0]);
  }

  /**
   * Retrieves single product by Slug
   */
  async getProductBySlug(slug) {
    const res = await query('SELECT * FROM products WHERE slug = $1', [slug]);
    if (res.rows.length === 0) return null;
    return mapProductRow(res.rows[0]);
  }

  /**
   * Retrieves featured products
   */
  async getFeaturedProducts(limit = 8) {
    const res = await query(
      'SELECT * FROM products WHERE featured = TRUE ORDER BY rating DESC, price DESC LIMIT $1',
      [limit]
    );
    return res.rows.map(mapProductRow);
  }

  /**
   * Retrieves new arrival products
   */
  async getNewArrivals(limit = 8) {
    const res = await query(
      'SELECT * FROM products WHERE new_arrival = TRUE ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return res.rows.map(mapProductRow);
  }

  /**
   * Retrieves all product categories
   */
  async getCategories() {
    const res = await query('SELECT name, slug, description FROM categories ORDER BY name ASC');
    return res.rows.map(r => r.name);
  }

  /**
   * Retrieves related products in the same category
   */
  async getRelatedProducts(currentId, limit = 4) {
    const current = await this.getProductById(currentId);
    if (!current) {
      const fallback = await query('SELECT * FROM products LIMIT $1', [limit]);
      return fallback.rows.map(mapProductRow);
    }

    const res = await query(
      `SELECT * FROM products
       WHERE category = $1 AND id != $2
       ORDER BY featured DESC, rating DESC
       LIMIT $3`,
      [current.category, currentId, limit]
    );

    let related = res.rows.map(mapProductRow);

    // If fewer than limit, backfill with featured products from other categories
    if (related.length < limit) {
      const remainingLimit = limit - related.length;
      const excludeIds = [currentId, ...related.map(p => p.id)];
      const backfillRes = await query(
        `SELECT * FROM products
         WHERE id != ALL($1)
         ORDER BY featured DESC, rating DESC
         LIMIT $2`,
        [excludeIds, remainingLimit]
      );
      related = [...related, ...backfillRes.rows.map(mapProductRow)];
    }

    return related;
  }
}

export const productService = new ProductService();
