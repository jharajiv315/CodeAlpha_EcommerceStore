import { INITIAL_PRODUCTS } from '../data/products';
import { Product, ProductCategory, ProductFilterState, SortOption } from '../types';

/**
 * Product Service
 * Encapsulates catalog retrieval, filtering, search, and sorting.
 * Ready to be swapped with `fetch('/api/products')` in future backend integration.
 */
class ProductService {
  private products: Product[] = [...INITIAL_PRODUCTS];

  /**
   * Retrieves all products
   */
  async getAllProducts(): Promise<Product[]> {
    // Simulate brief asynchronous dispatch for realistic feel
    return Promise.resolve([...this.products]);
  }

  /**
   * Retrieves a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return Promise.resolve(product ? { ...product } : null);
  }

  /**
   * Retrieves featured products for the storefront
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const featured = this.products.filter(p => p.featured);
    return Promise.resolve([...featured]);
  }

  /**
   * Retrieves new arrival products
   */
  async getNewArrivals(): Promise<Product[]> {
    const arrivals = this.products.filter(p => p.newArrival);
    return Promise.resolve([...arrivals]);
  }

  /**
   * Retrieves all unique categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    const categories: ProductCategory[] = ['Electronics', 'Accessories', 'Gaming', 'Lifestyle'];
    return Promise.resolve(categories);
  }

  /**
   * Retrieves related products in the same category, excluding the active one
   */
  async getRelatedProducts(currentId: string, limit: number = 4): Promise<Product[]> {
    const current = this.products.find(p => p.id === currentId);
    if (!current) return Promise.resolve(this.products.slice(0, limit));

    const related = this.products
      .filter(p => p.id !== currentId && p.category === current.category)
      .slice(0, limit);

    // If fewer than limit, fill with other featured items
    if (related.length < limit) {
      const remaining = this.products
        .filter(p => p.id !== currentId && !related.some(r => r.id === p.id))
        .slice(0, limit - related.length);
      related.push(...remaining);
    }

    return Promise.resolve(related);
  }

  /**
   * Filters and sorts products client-side
   */
  async queryProducts(filters: ProductFilterState, sort: SortOption): Promise<Product[]> {
    let result = [...this.products];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    // Price range filter
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Stock availability
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Customer Rating filter
    if (filters.minRating && filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }

    // Sorting
    switch (sort) {
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return Promise.resolve(result);
  }
}

export const productService = new ProductService();
