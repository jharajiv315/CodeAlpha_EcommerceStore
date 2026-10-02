import React, { useState } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useComparison } from '../../context/ComparisonContext';
import { Heart, Plus, Check, Scale } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();
  const { isInCompare, toggleCompare } = useComparison();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const success = await addToCart(product, 1, false); // Quick add from card doesn't force drawer open to avoid jarring flow
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product);
  };

  return (
    <article
      onClick={() => onSelect(product.id)}
      className="group bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35]/35 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 shadow-xs hover:shadow-xl hover:shadow-[#171A19]/[0.06] cursor-pointer focus-within:ring-2 focus-within:ring-[#123C35]"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-[#F7F5F0] group-hover:bg-[#F2EEE6] transition-colors duration-300 overflow-hidden flex items-center justify-center p-4">
        {/* Subtle tag indicator (at most 1 quiet unboxed or minimalist tag) */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#123C35] bg-[#EDE4D2]/80 backdrop-blur-xs px-2 py-0.5 rounded-sm">
              {product.tag}
            </span>
          </div>
        )}

        {/* Compare Button */}
        <button
          type="button"
          onClick={handleCompareToggle}
          className={`absolute top-3 right-12 z-10 h-8 px-2.5 rounded-full flex items-center gap-1.5 transition-all duration-200 cursor-pointer text-[10px] font-semibold ${
            isCompared
              ? 'bg-[#123C35] text-[#FFFFFF] shadow-sm'
              : 'bg-[#FFFFFF]/85 hover:bg-[#FFFFFF] text-[#666B67] hover:text-[#171A19] shadow-xs'
          }`}
          aria-label={isCompared ? 'Remove from comparison' : 'Compare product'}
          title={isCompared ? 'Remove from comparison' : 'Compare up to 3 products'}
        >
          <Scale className="w-3.5 h-3.5" />
          <span className={isCompared ? 'inline' : 'hidden sm:inline'}>
            {isCompared ? 'Added' : 'Compare'}
          </span>
        </button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isFavorited
              ? 'bg-[#123C35] text-[#FFFFFF]'
              : 'bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#666B67] hover:text-[#171A19] shadow-xs'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Studio Product Rendering */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#FFFFFF]/75 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666B67] bg-[#E4E1DA] px-3 py-1 rounded">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata line without pills */}
          <div className="flex items-center gap-1.5 text-xs text-[#4D524E] mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>★ {product.rating}</span>
            <span className="text-[#4D524E]">({product.reviewCount})</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-semibold text-[#171A19] leading-snug line-clamp-1 group-hover:text-[#123C35] transition-colors">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product.id);
              }}
              className="text-left hover:underline focus:outline-none cursor-pointer"
            >
              {product.name}
            </button>
          </h3>

          {/* Short tagline */}
          <p className="text-xs text-[#666B67] line-clamp-1 mt-1 font-normal">
            {product.tagline}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E4E1DA]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#171A19] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#666B67] line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
              justAdded
                ? 'bg-[#2F6B57] text-[#FFFFFF]'
                : isOutOfStock
                ? 'bg-[#E4E1DA] text-[#666B67] cursor-not-allowed opacity-60'
                : 'bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] active:scale-95'
            }`}
            aria-label={`Add ${product.name} to bag`}
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
