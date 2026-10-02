/**
 * NEXORA Type Definitions
 * Modern products. Simple shopping.
 */

export type ProductCategory = 'Electronics' | 'Accessories' | 'Gaming' | 'Lifestyle';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  gallery: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  newArrival: boolean;
  tag?: string;
  specifications: Record<string, string>;
  features: string[];
  dimensions?: string;
  weight?: string;
  warranty?: string;
  shippingInfo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  discountCode?: string;
  total: number;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type DeliveryMethod = 'standard' | 'express';
export type PaymentMethod = 'cod' | 'upi_mock' | 'card_mock';
export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: ProductCategory;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  avatar?: string;
  savedAddresses?: ShippingAddress[];
}

export interface ProductFilterState {
  category: ProductCategory | 'All';
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating?: number;
  searchQuery: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface ToastNotification {
  id: string;
  message: string;
  subtext?: string;
  type: 'success' | 'info' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}
