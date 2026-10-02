import React, { useState } from 'react';
import { useComparison } from '../../context/ComparisonContext';
import { formatPrice } from '../../utils/currency';
import { Scale, X, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export const CompareDock: React.FC = () => {
  const { compareProducts, removeFromCompare, clearCompare, openCompare, isCompareOpen } = useComparison();
  const [isMinimized, setIsMinimized] = useState(false);

  // If no products in compare or the modal is currently open, don't show the floating dock
  if (compareProducts.length === 0 || isCompareOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Product comparison dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-auto animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* Minimized Pill */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="bg-[#123C35] text-[#FFFFFF] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#0D302A] transition-all cursor-pointer"
        >
          <Scale className="w-4 h-4" />
          <span>Compare ({compareProducts.length}/3)</span>
          <ChevronUp className="w-3.5 h-3.5 opacity-80" />
        </button>
      ) : (
        /* Expanded Floating Card Dock */
        <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 backdrop-blur-md">
          {/* Header & Controls in Dock */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EDE4D2] text-[#123C35] flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-[#171A19] block leading-tight">
                  Compare
                </span>
                <span className="text-[10px] text-[#666B67] tabular-nums">
                  {compareProducts.length}/3 items
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:hidden">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 text-[#666B67] hover:text-[#171A19]"
                aria-label="Minimize comparison dock"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearCompare}
                className="p-1 text-[#666B67] hover:text-[#171A19]"
                aria-label="Clear all items"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Thumbnail Slots (Up to 3) */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {compareProducts.map(product => (
              <div
                key={product.id}
                className="relative flex items-center gap-2 bg-[#F7F5F0] border border-[#E4E1DA] rounded-xl p-1.5 pr-2.5 max-w-[150px] shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] p-0.5 border border-[#E4E1DA] shrink-0 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-[#171A19] truncate block leading-tight">
                    {product.name}
                  </span>
                  <span className="text-[10px] text-[#666B67] tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  className="w-4 h-4 rounded-full bg-[#FFFFFF] hover:bg-[#E4E1DA] text-[#666B67] hover:text-[#171A19] flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
                  aria-label={`Remove ${product.name} from comparison`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {/* Empty Slot Placeholder */}
            {Array.from({ length: 3 - compareProducts.length }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                className="hidden sm:flex items-center justify-center w-24 h-11 border border-dashed border-[#E4E1DA] rounded-xl text-[10px] text-[#666B67] text-center px-1"
              >
                <span>+ Slot {compareProducts.length + idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={clearCompare}
              className="hidden sm:inline-block text-xs text-[#666B67] hover:text-[#171A19] px-2 py-1 transition-colors cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={openCompare}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                compareProducts.length >= 2
                  ? 'bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] shadow-sm'
                  : 'bg-[#EDE4D2] text-[#123C35] hover:bg-[#E3D6C1]'
              }`}
            >
              <span>{compareProducts.length >= 2 ? 'Compare Now' : 'Compare (Select 2+)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="hidden sm:flex p-1.5 text-[#666B67] hover:text-[#171A19] rounded-lg transition-colors cursor-pointer"
              title="Minimize comparison bar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
