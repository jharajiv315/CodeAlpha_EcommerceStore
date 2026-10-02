import { apiRequest } from './apiClient';
import { CartItem, CartSummary, DeliveryMethod, Order, PaymentMethod, ShippingAddress } from '../types';

export interface CreateOrderPayload {
  userId?: string;
  items: CartItem[];
  summary: CartSummary;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}

class OrderService {
  /**
   * Validates shipping form fields client-side for immediate responsive feedback
   */
  validateShippingAddress(address: ShippingAddress): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!address.fullName?.trim() || address.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full recipient name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!address.email?.trim() || !emailRegex.test(address.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    const phoneClean = (address.phone || '').replace(/[\s\-\(\)]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!address.addressLine?.trim() || address.addressLine.trim().length < 5) {
      errors.addressLine = 'Please provide a complete street address with house/flat number';
    }

    if (!address.city?.trim()) {
      errors.city = 'Please enter your city';
    }

    if (!address.state?.trim()) {
      errors.state = 'Please specify your state / province';
    }

    const pinClean = (address.postalCode || '').replace(/\s/g, '');
    if (!pinClean || pinClean.length < 5) {
      errors.postalCode = 'Please enter a valid postal code';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Creates an authoritative, transaction-backed order in PostgreSQL
   * Client sends only item IDs and quantities — the backend calculates prices and validates inventory.
   */
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Cannot process order with an empty cart.');
    }

    const validation = this.validateShippingAddress(payload.shippingAddress);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const requestBody = {
      items: payload.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress: payload.shippingAddress,
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
      discountCode: payload.summary.discountCode,
    };

    const confirmedOrder = await apiRequest<Order>('/orders', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(requestBody),
    });

    return confirmedOrder;
  }

  /**
   * Retrieves orders for authenticated user from PostgreSQL
   */
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const orders = await apiRequest<Order[]>('/orders', { requiresAuth: true });
      return orders;
    } catch (err: any) {
      if (err.statusCode === 401) {
        return [];
      }
      console.warn('[OrderService] Could not fetch orders from backend:', err.message);
      return [];
    }
  }

  /**
   * Retrieves a single order by public order number or internal ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      return await apiRequest<Order>(`/orders/${orderId}`, { requiresAuth: true });
    } catch (err: any) {
      if (err.statusCode === 404) return null;
      console.warn('[OrderService] Error retrieving order:', err.message);
      return null;
    }
  }
}

export const orderService = new OrderService();
