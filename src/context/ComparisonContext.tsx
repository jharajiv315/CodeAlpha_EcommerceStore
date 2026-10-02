import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface ComparisonContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'nexora_compare_items_v1';
const MAX_COMPARE_ITEMS = 3;

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [compareProducts, setCompareProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareProducts));
    } catch {
      // Storage unavailable or full
    }
  }, [compareProducts]);

  const isInCompare = (productId: string): boolean => {
    return compareProducts.some(p => p.id === productId);
  };

  const addToCompare = (product: Product): boolean => {
    if (isInCompare(product.id)) {
      return true;
    }

    if (compareProducts.length >= MAX_COMPARE_ITEMS) {
      addToast(
        `Comparison limit reached (max ${MAX_COMPARE_ITEMS})`,
        'info',
        'Remove one product from your comparison dock to add another.',
        'View Comparison',
        () => setIsCompareOpen(true)
      );
      return false;
    }

    const updated = [...compareProducts, product];
    setCompareProducts(updated);
    addToast(
      `Added to compare (${updated.length}/${MAX_COMPARE_ITEMS})`,
      'success',
      `${product.name} is now queued for side-by-side analysis.`,
      updated.length >= 2 ? 'Compare Now' : undefined,
      updated.length >= 2 ? () => setIsCompareOpen(true) : undefined
    );
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      addToast('Removed from compare', 'info', `${product.name} was removed from comparison.`);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareProducts([]);
    addToast('Comparison cleared', 'info', 'All items have been removed from your comparison dock.');
  };

  const openCompare = () => {
    if (compareProducts.length === 0) {
      addToast('No products selected', 'info', 'Please select at least 2 products to compare.');
      return;
    }
    setIsCompareOpen(true);
  };

  const closeCompare = () => {
    setIsCompareOpen(false);
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        openCompare,
        closeCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
