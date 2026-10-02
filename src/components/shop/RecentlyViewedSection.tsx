import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { getRecentlyViewedIds, clearRecentlyViewed, onRecentlyViewedChange } from '../../utils/recentlyViewed';
import { ProductCard } from './ProductCard';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

interface RecentlyViewedSectionProps {
  onSelectProduct: (productId: string) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  onSelectProduct,
}) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecentProducts = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setRecentProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      const all = await productService.getAllProducts();
      // Maintain exact chronological order of ids
      const mapped = ids
        .map(id => all.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4);

      setRecentProducts(mapped);
    } catch {
      setRecentProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecentProducts(getRecentlyViewedIds());
    const unsubscribe = onRecentlyViewedChange(ids => {
      loadRecentProducts(ids);
    });
    return unsubscribe;
  }, []);

  if (isLoading || recentProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Recently viewed products"
      className="mt-14 pt-10 border-t border-[#E4E1DA] space-y-6 animate-in fade-in duration-300"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E4E1DA]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EDE4D2] text-[#123C35] flex items-center justify-center shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#171A19] tracking-tight">
              Recently Viewed
            </h2>
            <p className="text-xs text-[#666B67] mt-0.5">
              The last {recentProducts.length} {recentProducts.length === 1 ? 'item' : 'items'} you inspected in our catalog
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="text-xs font-medium text-[#666B67] hover:text-[#123C35] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Grid of up to 4 Recently Viewed Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
};
