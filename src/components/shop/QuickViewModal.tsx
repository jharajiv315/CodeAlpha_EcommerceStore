import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Check,
  ExternalLink,
  ShieldCheck,
  Truck,
  Star,
} from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewDetails,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Sync state whenever active product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  // Handle ESC key and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxAllowedQuantity = Math.max(1, Math.min(product.stock, 10));

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => Math.min(maxAllowedQuantity, prev + 1));
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const success = await addToCart(product, quantity, false);
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleNavigatePDP = () => {
    onClose();
    onViewDetails(product.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171A19]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#666B67] hover:text-[#171A19] bg-[#FFFFFF]/80 hover:bg-[#F7F5F0] rounded-full border border-[#E4E1DA] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual Gallery Column */}
          <div className="bg-[#F7F5F0] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E4E1DA]">
            {/* Tag & Favorite Overlay */}
            <div className="flex items-center justify-between w-full mb-2">
              {product.tag ? (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-2.5 py-1 rounded-sm">
                  {product.tag}
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                className={`p-2 rounded-full border border-[#E4E1DA] transition-all cursor-pointer ${
                  isFavorited
                    ? 'bg-[#123C35] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#666B67] hover:text-[#171A19]'
                }`}
                title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-square max-h-72 w-full flex items-center justify-center my-auto p-2">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-200"
              />
            </div>

            {/* Thumbnails if available */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[#E4E1DA]/60 overflow-x-auto">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-12 h-12 rounded-lg bg-[#FFFFFF] border p-1 shrink-0 transition-all cursor-pointer ${
                      (selectedImage || product.image) === imgUrl
                        ? 'border-[#123C35] ring-1 ring-[#123C35]'
                        : 'border-[#E4E1DA] hover:border-[#171A19]/30'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Controls Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Rating, Stock */}
              <div className="flex items-center justify-between text-xs text-[#666B67]">
                <span className="font-medium uppercase tracking-wider text-[#123C35]">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[#171A19] tabular-nums">{product.rating}</span>
                  <span className="text-[#666B67]/70">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2
                  id="quick-view-title"
                  className="text-xl sm:text-2xl font-semibold text-[#171A19] leading-tight"
                >
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#666B67] mt-1.5 font-normal line-clamp-2">
                  {product.tagline}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-[#171A19] tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#666B67] line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-semibold text-[#2F6B57] bg-[#EDE4D2] px-2 py-0.5 rounded">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Inventory Alert */}
              <div>
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    <span>Currently out of stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                    <span>Low inventory: Only {product.stock} items remaining</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#123C35] bg-[#EDE4D2]/60 px-2.5 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
                    <span>In stock and ready to dispatch</span>
                  </div>
                )}
              </div>

              {/* Compact Highlights */}
              {product.features && product.features.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#666B67] mb-2">
                    Key Highlights
                  </h4>
                  <ul className="text-xs text-[#171A19] space-y-1.5">
                    {product.features.slice(0, 3).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#123C35] shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions Area */}
            <div className="space-y-3 pt-4 border-t border-[#E4E1DA]">
              {/* Stepper + Add to Cart */}
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#E4E1DA] rounded-lg bg-[#FFFFFF] overflow-hidden">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 text-[#666B67] hover:text-[#171A19] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F5F0] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-10 text-center text-xs font-semibold text-[#171A19] tabular-nums select-none">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={quantity >= maxAllowedQuantity || isOutOfStock}
                    className="p-2.5 text-[#666B67] hover:text-[#171A19] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F5F0] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    justAdded
                      ? 'bg-[#2F6B57] text-[#FFFFFF]'
                      : isOutOfStock
                      ? 'bg-[#E4E1DA] text-[#666B67] cursor-not-allowed'
                      : 'bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] shadow-sm active:scale-[0.98]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* View Full Product Details Link */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleNavigatePDP}
                  className="text-xs font-medium text-[#123C35] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View full specifications & warranty</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5 text-[11px] text-[#666B67]">
                  <Truck className="w-3.5 h-3.5 text-[#123C35]" />
                  <span>Free express dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
