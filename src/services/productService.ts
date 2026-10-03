import { apiRequest } from './apiClient';
import { Product, ProductCategory, ProductFilterState, SortOption } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

/**
 * Product Service
 * Communicates with the PostgreSQL-backed Express.js REST API
 * with defensive fallback to offline initial data if network is unavailable.
 */
class ProductService {
  private allProductsCache: { data: Product[]; expiresAt: number } | null = null;
  private productCache = new Map<string, { data: Product; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 60 * 1000; // 60 seconds

  /**
   * Clears internal memory cache when stock or orders change
   */
  invalidateCache(): void {
    this.allProductsCache = null;
    this.productCache.clear();
  }

  /**
   * Retrieves all products from PostgreSQL database
   */
  async getAllProducts(): Promise<Product[]> {
    const now = Date.now();
    if (this.allProductsCache && this.allProductsCache.expiresAt > now) {
      return this.allProductsCache.data;
    }

    try {
      const res = await apiRequest<{ products: Product[]; total: number }>('/products?limit=150');
      this.allProductsCache = { data: res.products, expiresAt: now + this.CACHE_TTL_MS };
      return res.products;
    } catch (err) {
      console.warn('[ProductService] Backend offline, using local fallback:', err);
      return [...INITIAL_PRODUCTS];
    }
  }

  /**
   * Retrieves a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const now = Date.now();
    const cached = this.productCache.get(id);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    try {
      const product = await apiRequest<Product>(`/products/${id}`);
      this.productCache.set(id, { data: product, expiresAt: now + this.CACHE_TTL_MS });
      return product;
    } catch (err: any) {
      if (err.statusCode === 404) return null;
      console.warn('[ProductService] Fetch failed, checking local data:', err);
      const fallback = INITIAL_PRODUCTS.find(p => p.id === id);
      return fallback ? { ...fallback } : null;
    }
  }

  /**
   * Retrieves featured products for the storefront
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      return await apiRequest<Product[]>('/products/featured?limit=12');
    } catch (err) {
      console.warn('[ProductService] Featured fetch failed, using fallback:', err);
      return INITIAL_PRODUCTS.filter(p => p.featured);
    }
  }

  /**
   * Retrieves new arrival products
   */
  async getNewArrivals(): Promise<Product[]> {
    try {
      return await apiRequest<Product[]>('/products/new-arrivals?limit=12');
    } catch (err) {
      console.warn('[ProductService] New arrivals fetch failed, using fallback:', err);
      return INITIAL_PRODUCTS.filter(p => p.newArrival);
    }
  }

  /**
   * Retrieves all unique categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      return await apiRequest<ProductCategory[]>('/products/categories');
    } catch (err) {
      return [
        'Smartphones',
        'Laptops',
        'Headphones & Audio',
        'Tablets',
        'Smartwatches & Wearables',
        'Cameras',
        'TVs & Monitors',
        'Gaming',
        'PC Components',
        'Networking & Smart Home',
        'Accessories',
      ];
    }
  }

  /**
   * Retrieves related products in the same category
   */
  async getRelatedProducts(currentId: string, limit: number = 4): Promise<Product[]> {
    try {
      return await apiRequest<Product[]>(`/products/${currentId}/related?limit=${limit}`);
    } catch (err) {
      const current = INITIAL_PRODUCTS.find(p => p.id === currentId);
      if (!current) return INITIAL_PRODUCTS.slice(0, limit);
      return INITIAL_PRODUCTS.filter(p => p.id !== currentId && p.category === current.category).slice(0, limit);
    }
  }

  /**
   * Filters and sorts products via backend API with parameterized SQL
   */
  async queryProducts(filters: ProductFilterState, sort: SortOption): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') {
        params.append('category', filters.category);
      }
      if (filters.brand && filters.brand !== 'All') {
        params.append('brand', filters.brand);
      }
      if (filters.searchQuery?.trim()) {
        params.append('search', filters.searchQuery.trim());
      }
      if (filters.minPrice !== undefined) {
        params.append('minPrice', String(filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        params.append('maxPrice', String(filters.maxPrice));
      }
      if (filters.inStockOnly) {
        params.append('inStockOnly', 'true');
      }
      if (filters.minRating && filters.minRating > 0) {
        params.append('minRating', String(filters.minRating));
      }
      if (sort) {
        params.append('sort', sort);
      }
      params.append('limit', '150');

      const res = await apiRequest<{ products: Product[]; total: number }>(`/products?${params.toString()}`);
      return res.products;
    } catch (err) {
      console.warn('[ProductService] Backend query failed, using local filtering:', err);
      // Local fallback
      let result = [...INITIAL_PRODUCTS];
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      if (filters.category !== 'All') {
        result = result.filter(p => p.category === filters.category);
      }
      result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
      if (filters.inStockOnly) {
        result = result.filter(p => p.stock > 0);
      }
      if (filters.minRating && filters.minRating > 0) {
        result = result.filter(p => p.rating >= filters.minRating!);
      }
      return result;
    }
  }
}

export const productService = new ProductService();
