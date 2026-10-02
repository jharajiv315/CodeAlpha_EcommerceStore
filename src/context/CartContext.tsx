import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { cartService } from '../services/cartService';
import { CartItem, CartSummary, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  summary: CartSummary;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const { addToast } = useToast();

  // Initial load
  useEffect(() => {
    cartService.getCart().then(items => {
      setCart(items);
      setPromoCode(cartService.getActivePromoCode());
    });
  }, []);

  const summary = useMemo(() => {
    return cartService.calculateSummary(cart, promoCode || undefined);
  }, [cart, promoCode]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const addToCart = useCallback(async (product: Product, quantity: number = 1, openDrawer: boolean = true): Promise<boolean> => {
    const result = await cartService.addItem(product, quantity);
    setCart([...result.items]);

    if (result.error && result.addedQuantity === 0) {
      addToast(result.error, 'error');
      return false;
    }

    if (result.error && result.addedQuantity > 0) {
      addToast(`Added ${result.addedQuantity}x ${product.name}`, 'info', result.error);
    } else {
      addToast(`Added to Bag`, 'success', `${product.name} (${quantity})`);
    }

    if (openDrawer) {
      setIsCartOpen(true);
    }

    return true;
  }, [addToast]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    const result = await cartService.updateQuantity(productId, quantity);
    setCart([...result.items]);
    if (result.error) {
      addToast('Stock limit reached', 'info', result.error);
    }
  }, [addToast]);

  const removeFromCart = useCallback(async (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    const updated = await cartService.removeItem(productId);
    setCart([...updated]);
    if (item) {
      addToast('Removed from Bag', 'info', item.product.name);
    }
  }, [cart, addToast]);

  const clearCart = useCallback(async () => {
    await cartService.clearCart();
    setCart([]);
    setPromoCode(null);
  }, []);

  const applyPromoCode = useCallback(async (code: string) => {
    const res = cartService.applyPromoCode(code);
    if (res.valid) {
      setPromoCode(res.code);
      addToast('Promo applied', 'success', res.message);
      return { success: true, message: res.message };
    } else {
      addToast('Invalid code', 'error', res.message);
      return { success: false, message: res.message };
    }
  }, [addToast]);

  const removePromoCode = useCallback(() => {
    cartService.removePromoCode();
    setPromoCode(null);
    addToast('Promo removed', 'info');
  }, [addToast]);

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
