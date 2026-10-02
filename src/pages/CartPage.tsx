import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react';

interface CartPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateCheckout: () => void;
  onSelectProduct: (productId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateCheckout,
  onSelectProduct,
}) => {
  const {
    cart,
    summary,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    await applyPromoCode(promoInput);
    setIsApplyingPromo(false);
  };

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Catalog', onClick: onNavigateShop },
    { label: 'Shopping Bag', active: true },
  ];

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Breadcrumb items={breadcrumbs} />
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping bag is empty"
          description="Explore our collection of acoustic instruments, precision typing gear, and focused accessories."
          actionLabel="Explore Collection"
          onAction={onNavigateShop}
        />
      </div>
    );
  }

  const percentToFreeShipping = Math.min(100, Math.round((summary.subtotal / summary.freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#E4E1DA]">
        <div>
          <h1 className="text-3xl font-semibold text-[#171A19] tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#666B67] mt-1">
            Review your selected gear before proceeding to checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-[#666B67] hover:text-[#A94747] transition-colors underline cursor-pointer self-start sm:self-auto"
        >
          Clear all items
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          {summary.freeShippingEligible ? (
            <span className="font-semibold text-[#2F6B57] flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              Complimentary standard courier delivery unlocked!
            </span>
          ) : (
            <span className="text-[#666B67]">
              Add <strong className="text-[#171A19] tabular-nums">{formatPrice(summary.amountToFreeShipping)}</strong> more to unlock free shipping across India.
            </span>
          )}
          <span className="font-semibold text-[#123C35] tabular-nums">
            {percentToFreeShipping}%
          </span>
        </div>
        <div className="w-full bg-[#F7F5F0] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#123C35] h-full transition-all duration-300"
            style={{ width: `${percentToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl divide-y divide-[#E4E1DA] overflow-hidden">
          {/* Header row for desktop */}
          <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 bg-[#F7F5F0] text-xs font-semibold uppercase tracking-wider text-[#666B67]">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Cart Items */}
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
            >
              {/* Product Info */}
              <div className="sm:col-span-6 flex items-center gap-4">
                <div
                  onClick={() => onSelectProduct(product.id)}
                  className="w-20 h-20 bg-[#F7F5F0] border border-[#E4E1DA] rounded-lg p-2 shrink-0 flex items-center justify-center cursor-pointer hover:border-[#123C35] transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#123C35]">
                    {product.category}
                  </span>
                  <h4
                    onClick={() => onSelectProduct(product.id)}
                    className="text-sm font-semibold text-[#171A19] leading-tight truncate hover:text-[#123C35] cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#666B67] mt-0.5 line-clamp-1">
                    {product.tagline}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="mt-2 text-xs text-[#666B67] hover:text-[#A94747] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                <div className="flex items-center border border-[#E4E1DA] rounded-lg bg-[#F7F5F0]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 text-[#666B67] hover:text-[#171A19] transition-colors rounded-l-lg cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#171A19] tabular-nums select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1.5 text-[#666B67] hover:text-[#171A19] transition-colors rounded-r-lg cursor-pointer disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Unit Price */}
              <div className="sm:col-span-2 text-left sm:text-right text-xs text-[#666B67] tabular-nums">
                <span className="sm:hidden font-medium text-[#171A19] mr-2">Unit:</span>
                {formatPrice(product.price)}
              </div>

              {/* Total for Row */}
              <div className="sm:col-span-2 text-left sm:text-right text-sm font-semibold text-[#171A19] tabular-nums">
                <span className="sm:hidden font-medium text-[#666B67] mr-2">Subtotal:</span>
                {formatPrice(product.price * quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-5">
            <h3 className="text-base font-semibold text-[#171A19] pb-3 border-b border-[#E4E1DA]">
              Order Summary
            </h3>

            {/* Financial Details */}
            <div className="space-y-3 text-xs text-[#666B67]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#171A19] tabular-nums">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between text-[#2F6B57]">
                  <div className="flex items-center gap-1.5">
                    <span>Discount ({summary.discountCode})</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-xs text-[#A94747] hover:underline cursor-pointer"
                    >
                      (Remove)
                    </button>
                  </div>
                  <span className="font-semibold tabular-nums">
                    -{formatPrice(summary.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-[#171A19] tabular-nums">
                  {summary.shipping === 0 ? 'Complimentary' : formatPrice(summary.shipping)}
                </span>
              </div>

              <div className="flex justify-between text-[#666B67]">
                <span>Taxes & Duties</span>
                <span>Included (18% GST)</span>
              </div>

              <div className="pt-3 border-t border-[#E4E1DA] flex justify-between text-lg font-bold text-[#171A19]">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatPrice(summary.total)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-3 border-t border-[#E4E1DA] space-y-2">
              <label htmlFor="promo-input" className="text-xs font-semibold uppercase tracking-wider text-[#666B67] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#123C35]" />
                <span>Privilege Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="promo-input"
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="e.g. NEXORA10"
                  className="flex-1 bg-[#F7F5F0] border border-[#E4E1DA] focus:border-[#123C35] rounded-lg px-3 py-2 text-xs uppercase font-medium text-[#171A19] placeholder:normal-case placeholder:text-[#666B67]/70"
                />
                <button
                  type="submit"
                  disabled={isApplyingPromo || !promoInput.trim()}
                  className="px-4 py-2 bg-[#171A19] hover:bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              <p className="text-[11px] text-[#666B67]">
                Available codes: <strong className="text-[#123C35]">NEXORA10</strong> (10% off), <strong className="text-[#123C35]">WELCOME15</strong> (15% off)
              </p>
            </form>

            {/* Primary Checkout CTA */}
            <button
              type="button"
              onClick={onNavigateCheckout}
              className="w-full py-3.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:translate-y-[-1px] active:translate-y-0"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onNavigateShop}
              className="w-full py-2 bg-transparent text-[#666B67] hover:text-[#171A19] text-xs font-medium tracking-wide text-center transition-colors cursor-pointer"
            >
              ← Continue Exploring Catalog
            </button>
          </div>

          {/* Reassurance Features */}
          <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-4 space-y-3 text-xs text-[#666B67]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#123C35] shrink-0" />
              <span>256-bit SSL encrypted checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#123C35] shrink-0" />
              <span>Complimentary insured shipping on ₹2,000+</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-[#123C35] shrink-0" />
              <span>30-day doorstep return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
