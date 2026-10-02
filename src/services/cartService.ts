import { CartItem, CartSummary, Product } from '../types';

const STORAGE_KEY = 'nexora_cart_items_v1';
const PROMO_STORAGE_KEY = 'nexora_cart_promo_v1';

const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING_FEE = 199;

export interface PromoResult {
  valid: boolean;
  code: string;
  discountPercent: number;
  message: string;
}

const AVAILABLE_PROMOS: Record<string, { percent: number; description: string }> = {
  'NEXORA10': { percent: 10, description: '10% privilege discount applied' },
  'WELCOME15': { percent: 15, description: '15% welcome discount applied' },
  'STUDIO20': { percent: 20, description: '20% creative studio discount applied' },
};

class CartService {
  /**
   * Internal loader with defensive parsing
   */
  private loadItems(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.product && item.quantity > 0);
      }
      return [];
    } catch {
      return [];
    }
  }

  private saveItems(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable or disabled
    }
  }

  /**
   * Retrieves all cart items
   */
  async getCart(): Promise<CartItem[]> {
    return Promise.resolve(this.loadItems());
  }

  /**
   * Adds product with stock constraint verification
   */
  async addItem(product: Product, quantity: number = 1): Promise<{ items: CartItem[]; addedQuantity: number; error?: string }> {
    const items = this.loadItems();
    const existingIndex = items.findIndex(item => item.product.id === product.id);

    if (product.stock <= 0) {
      return Promise.resolve({ items, addedQuantity: 0, error: 'Product is currently out of stock.' });
    }

    let addedQty = quantity;

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stock) {
        items[existingIndex].quantity = product.stock;
        addedQty = product.stock - currentQty;
        this.saveItems(items);
        return Promise.resolve({
          items,
          addedQuantity: addedQty,
          error: `Only ${product.stock} units available in stock. Maximum added.`
        });
      }

      items[existingIndex].quantity = targetQty;
    } else {
      const safeQty = Math.min(quantity, product.stock);
      items.push({
        product,
        quantity: safeQty,
      });
      addedQty = safeQty;
    }

    this.saveItems(items);
    return Promise.resolve({ items, addedQuantity: addedQty });
  }

  /**
   * Updates quantity for an existing item
   */
  async updateQuantity(productId: string, quantity: number): Promise<{ items: CartItem[]; error?: string }> {
    let items = this.loadItems();
    const itemIndex = items.findIndex(item => item.product.id === productId);

    if (itemIndex === -1) {
      return Promise.resolve({ items });
    }

    if (quantity <= 0) {
      items = items.filter(item => item.product.id !== productId);
      this.saveItems(items);
      return Promise.resolve({ items });
    }

    const maxStock = items[itemIndex].product.stock;
    if (quantity > maxStock) {
      items[itemIndex].quantity = maxStock;
      this.saveItems(items);
      return Promise.resolve({
        items,
        error: `Only ${maxStock} units currently available.`
      });
    }

    items[itemIndex].quantity = quantity;
    this.saveItems(items);
    return Promise.resolve({ items });
  }

  /**
   * Removes an item from the cart
   */
  async removeItem(productId: string): Promise<CartItem[]> {
    const items = this.loadItems().filter(item => item.product.id !== productId);
    this.saveItems(items);
    return Promise.resolve(items);
  }

  /**
   * Clears the entire cart
   */
  async clearCart(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROMO_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
    return Promise.resolve();
  }

  /**
   * Retrieves active promo code from session/storage
   */
  getActivePromoCode(): string | null {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  }

  /**
   * Applies and validates a promo code
   */
  applyPromoCode(code: string): PromoResult {
    const normalized = code.trim().toUpperCase();
    const match = AVAILABLE_PROMOS[normalized];

    if (!match) {
      return {
        valid: false,
        code: normalized,
        discountPercent: 0,
        message: 'Invalid promo code. Try NEXORA10 or WELCOME15.'
      };
    }

    try {
      localStorage.setItem(PROMO_STORAGE_KEY, normalized);
    } catch {
      // Storage unavailable
    }

    return {
      valid: true,
      code: normalized,
      discountPercent: match.percent,
      message: match.description
    };
  }

  /**
   * Removes promo code
   */
  removePromoCode(): void {
    try {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Calculates comprehensive cart financial summary
   */
  calculateSummary(items: CartItem[], promoCodeOverride?: string): CartSummary {
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const activeCode = promoCodeOverride ?? this.getActivePromoCode();

    let discount = 0;
    if (activeCode && AVAILABLE_PROMOS[activeCode]) {
      const pct = AVAILABLE_PROMOS[activeCode].percent;
      discount = Math.round((subtotal * pct) / 100);
    }

    const freeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
    const shipping = items.length === 0 ? 0 : (freeShippingEligible ? 0 : STANDARD_SHIPPING_FEE);
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    // GST included in prices (standard 18% component for transparency)
    const tax = Math.round((subtotal - discount) * 0.18 / 1.18);
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      shipping,
      tax,
      discount,
      discountCode: activeCode || undefined,
      total,
      freeShippingEligible,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping,
    };
  }
}

export const cartService = new CartService();
