import { CartItem, CartSummary, DeliveryMethod, Order, OrderItem, PaymentMethod, ShippingAddress } from '../types';
import { generateOrderId, getEstimatedDeliveryDate } from '../utils/id';
import { productImages } from '../data/productImages';

const ORDERS_STORAGE_KEY = 'nexora_orders_v1';

export interface CreateOrderPayload {
  userId?: string;
  items: CartItem[];
  summary: CartSummary;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}

class OrderService {
  private loadOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) {
        // Seed default initial order for sample demonstration
        const seedOrder: Order = {
          id: 'NX-2026-01842',
          userId: 'usr_alex_01',
          items: [
            {
              productId: 'nexora-arc-headphones',
              name: 'Nexora Arc Wireless Headphones',
              price: 14999,
              quantity: 1,
              image: productImages.arcHeadphones.main,
              category: 'Electronics',
            }
          ],
          subtotal: 14999,
          shipping: 0,
          tax: 2287,
          discount: 1500,
          total: 13499,
          shippingAddress: {
            fullName: 'Alex Morgan',
            email: 'alex@nexora.design',
            phone: '+91 98765 43210',
            addressLine: 'Flat 402, Signature Pavilion, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
            country: 'India',
          },
          deliveryMethod: 'express',
          paymentMethod: 'upi_mock',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: 'Delivered on Oct 18, 2026',
          trackingNumber: 'DEL-NX-9928172',
        };
        this.saveOrders([seedOrder]);
        return [seedOrder];
      }

      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Validates shipping form fields
   */
  validateShippingAddress(address: ShippingAddress): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!address.fullName.trim() || address.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full recipient name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!address.email.trim() || !emailRegex.test(address.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    const phoneClean = address.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!address.addressLine.trim() || address.addressLine.trim().length < 5) {
      errors.addressLine = 'Please provide a complete street address with house/flat number';
    }

    if (!address.city.trim()) {
      errors.city = 'Please enter your city';
    }

    if (!address.state.trim()) {
      errors.state = 'Please specify your state / province';
    }

    const pinClean = address.postalCode.replace(/\s/g, '');
    if (!pinClean || pinClean.length < 6) {
      errors.postalCode = 'Please enter a valid 6-digit postal PIN code';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Creates and records an order
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

    const orderItems: OrderItem[] = payload.items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      category: item.product.category,
    }));

    const deliveryDays = payload.deliveryMethod === 'express' ? 2 : 4;
    const estimatedDelivery = getEstimatedDeliveryDate(deliveryDays);
    const trackingNumber = `NX-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder: Order = {
      id: generateOrderId(),
      userId: payload.userId,
      items: orderItems,
      subtotal: payload.summary.subtotal,
      shipping: payload.summary.shipping,
      tax: payload.summary.tax,
      discount: payload.summary.discount,
      total: payload.summary.total,
      shippingAddress: { ...payload.shippingAddress },
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery,
      trackingNumber,
    };

    const orders = this.loadOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    return Promise.resolve(newOrder);
  }

  /**
   * Retrieves all orders (or filtered by userId)
   */
  async getOrders(userId?: string): Promise<Order[]> {
    const orders = this.loadOrders();
    if (userId) {
      // In prototype, show user's orders + anonymous ones placed during current session
      return Promise.resolve(orders.filter(o => !o.userId || o.userId === userId));
    }
    return Promise.resolve(orders);
  }

  /**
   * Retrieves a single order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = this.loadOrders();
    const order = orders.find(o => o.id === orderId);
    return Promise.resolve(order ? { ...order } : null);
  }
}

export const orderService = new OrderService();
