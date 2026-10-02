import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  onNavigateToCart: () => void;
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCart,
  onNavigateToCheckout,
  onNavigateToShop,
}) => {
  const {
    cart,
    summary,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItemCount,
  } = useCart();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const percentToFreeShipping = Math.min(100, Math.round((summary.subtotal / summary.freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171A19]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E4E1DA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#123C35]" />
              <h3 className="text-base font-semibold text-[#171A19]">Shopping Bag</h3>
              <span className="text-xs text-[#666B67] tabular-nums">({totalItemCount})</span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1 text-[#666B67] hover:text-[#171A19] transition-colors rounded-lg cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#F7F5F0] px-6 py-3 border-b border-[#E4E1DA]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {summary.freeShippingEligible ? (
                <span className="font-semibold text-[#2F6B57]">
                  ✓ You've unlocked complimentary standard shipping
                </span>
              ) : (
                <span className="text-[#666B67]">
                  Add <strong className="text-[#171A19] tabular-nums">{formatPrice(summary.amountToFreeShipping)}</strong> more for free delivery
                </span>
              )}
              <span className="text-[11px] font-semibold text-[#123C35] tabular-nums">
                {percentToFreeShipping}%
              </span>
            </div>
            <div className="w-full bg-[#E4E1DA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#123C35] h-full transition-all duration-300"
                style={{ width: `${percentToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E4E1DA]/60">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-10 h-10 text-[#666B67]/50 mx-auto mb-3 stroke-[1.2]" />
                <h4 className="text-sm font-semibold text-[#171A19]">Your bag is empty</h4>
                <p className="text-xs text-[#666B67] mt-1 mb-6 max-w-xs mx-auto">
                  Explore our curated collections of precision instruments and everyday essentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onNavigateToShop();
                  }}
                  className="px-5 py-2 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-[#F7F5F0] rounded-lg border border-[#E4E1DA] p-1 flex items-center justify-center shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-sm font-semibold text-[#171A19] leading-tight truncate">
                          {product.name}
                        </h5>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#666B67] hover:text-[#A94747] p-1 transition-colors cursor-pointer"
                          aria-label={`Remove ${product.name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#666B67] mt-0.5">
                        {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E4E1DA] rounded-md bg-[#F7F5F0]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-[#FFFFFF] text-[#666B67] hover:text-[#171A19] transition-colors rounded-l-md cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#171A19] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="p-1 hover:bg-[#FFFFFF] text-[#666B67] hover:text-[#171A19] transition-colors rounded-r-md cursor-pointer disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-[#171A19] tabular-nums">
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Financial Breakdown & Primary Actions */}
          {cart.length > 0 && (
            <div className="border-t border-[#E4E1DA] p-6 bg-[#FFFFFF] space-y-4">
              <div className="space-y-1.5 text-xs text-[#666B67]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171A19] tabular-nums">{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-[#2F6B57]">
                    <span>Discount ({summary.discountCode})</span>
                    <span className="font-semibold tabular-nums">-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#171A19] tabular-nums">
                    {summary.shipping === 0 ? 'Complimentary' : formatPrice(summary.shipping)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E4E1DA] flex justify-between text-base font-semibold text-[#171A19]">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(summary.total)}</span>
                </div>
                <p className="text-[11px] text-[#666B67]/80 pt-0.5">
                  Includes 18% GST ({formatPrice(summary.tax)}). Secure checkout guaranteed.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onNavigateToCart();
                  }}
                  className="w-full py-2 bg-transparent text-[#171A19] hover:bg-[#F7F5F0] text-xs font-semibold tracking-wide rounded-lg transition-colors cursor-pointer text-center"
                >
                  View Full Bag & Promo Codes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
