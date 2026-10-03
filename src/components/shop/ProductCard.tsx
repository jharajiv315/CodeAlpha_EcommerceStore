import React, { useState } from 'react';
import { Product } from '../../types';
import { formatPrice, calculateDiscountPercent } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const success = await addToCart(product, 1, false);
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

  // Determine legitimate commerce badge
  const commerceBadge = (() => {
    if (product.stock > 0 && product.stock <= 3) return 'Low Stock';
    if (discountPercent >= 18) return `${discountPercent}% OFF`;
    if (product.rating >= 4.8 && product.reviewCount > 1000) return 'Top Rated';
    if (product.tag) return product.tag;
    return null;
  })();

  return (
    <article
      onClick={() => onSelect(product.id)}
      className="group bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-200 cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square bg-[#FFFFFF] overflow-hidden flex items-center justify-center p-6 border-b border-[#E4E1DA]/60">
        {/* Purposeful Commerce Badge */}
        {commerceBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm ${
                commerceBadge.includes('OFF')
                  ? 'bg-[#123C35] text-[#FFFFFF]'
                  : commerceBadge === 'Low Stock'
                  ? 'bg-[#A67C35] text-[#FFFFFF]'
                  : 'bg-[#EDE4D2] text-[#123C35]'
              }`}
            >
              {commerceBadge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
            isFavorited
              ? 'bg-[#123C35] text-[#FFFFFF] border-[#123C35]'
              : 'bg-[#FFFFFF] hover:bg-[#F7F5F0] text-[#666B67] hover:text-[#171A19] border-[#E4E1DA] shadow-xs'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Real Product Photography */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-102"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#FFFFFF]/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A94747] bg-[#FFFFFF] border border-[#A94747]/40 px-3 py-1 rounded shadow-xs">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-[11px] text-[#666B67]">
            <span className="font-bold uppercase tracking-wider text-[#123C35]">
              {product.brand || product.category}
            </span>
            <span className="text-[11px] text-[#8C928D] truncate max-w-[120px]">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-[#171A19] leading-snug line-clamp-2 group-hover:text-[#123C35] transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating and Review Count */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 text-[#B89B5E]">
              <Star className="w-3.5 h-3.5 fill-current text-[#B89B5E]" />
              <span className="font-bold text-[#171A19]">{product.rating}</span>
            </div>
            <span className="text-[#8C928D]">({product.reviewCount?.toLocaleString() || 0})</span>
            {isLowStock && (
              <span className="text-[10px] font-semibold text-[#A67C35] ml-auto">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-[#E4E1DA] space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#171A19] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-[#8C928D] line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[11px] font-semibold text-[#2F6B57]">
                  {discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              justAdded
                ? 'bg-[#2F6B57] text-[#FFFFFF]'
                : isOutOfStock
                ? 'bg-[#E4E1DA] text-[#8C928D] cursor-not-allowed'
                : 'bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] shadow-xs active:scale-[0.99]'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added to Cart</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

