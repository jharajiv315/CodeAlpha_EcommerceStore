import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../common/SkeletonLoader';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onSelectProduct: (productId: string) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onSelectProduct,
  onResetFilters,
}) => {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No matching products found"
        description="Try adjusting your keyword, resetting price ranges, or removing category filters to view more items."
        actionLabel={onResetFilters ? 'Clear all filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
};
