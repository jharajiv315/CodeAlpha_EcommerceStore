import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { Product } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { Heart } from 'lucide-react';

interface WishlistPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onSelectProduct: (productId: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onSelectProduct,
}) => {
  const { wishlist } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    productService.getAllProducts().then(all => {
      const filtered = all.filter(p => wishlist.includes(p.id));
      setProducts(filtered);
      setIsLoading(false);
    });
  }, [wishlist]);

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Wishlist', active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="pb-4 border-b border-[#E4E1DA] flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#171A19] tracking-tight">
            Saved Instruments
          </h1>
          <p className="text-xs text-[#666B67] mt-1">
            Curate and monitor availability of your prioritized workstation items.
          </p>
        </div>
        <span className="text-xs text-[#666B67] tabular-nums">
          {products.length} {products.length === 1 ? 'item' : 'items'} saved
        </span>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Explore our catalog and click the heart icon on any product to save it for later consideration."
          actionLabel="Explore Catalog"
          onAction={onNavigateShop}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
