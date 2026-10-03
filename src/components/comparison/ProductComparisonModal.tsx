import React, { useState, useEffect } from 'react';
import { useComparison } from '../../context/ComparisonContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { productService } from '../../services/productService';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  Plus,
  Scale,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface ProductComparisonModalProps {
  onSelectProduct?: (productId: string) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  onSelectProduct,
}) => {
  const {
    compareProducts,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    closeCompare,
    addToCompare,
  } = useComparison();

  const { addToCart } = useCart();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Fetch catalog to allow adding products into empty comparison slots
  useEffect(() => {
    productService.getAllProducts().then(items => setAllProducts(items));
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCompare();
      }
    };
    if (isCompareOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCompareOpen, closeCompare]);

  if (!isCompareOpen) return null;

  // Extract all unique specification keys across currently selected products
  const allSpecKeys = Array.from(
    new Set(compareProducts.flatMap(p => Object.keys(p.specifications || {})))
  );

  // Available products that aren't already in comparison
  const availableToAdd = allProducts.filter(
    p => !compareProducts.some(cp => cp.id === p.id)
  );

  const handleQuickAdd = async (product: Product) => {
    const ok = await addToCart(product, 1, false);
    if (ok) {
      setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  const handleProductClick = (productId: string) => {
    closeCompare();
    if (onSelectProduct) {
      onSelectProduct(productId);
    } else {
      window.location.hash = `#/product/${productId}`;
    }
  };

  // Helper to determine if a spec row has differing values
  const hasDiffValues = (values: (string | undefined)[]): boolean => {
    if (values.length <= 1) return false;
    const first = values[0]?.trim().toLowerCase();
    return values.some(v => (v?.trim().toLowerCase() || '—') !== (first || '—'));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171A19]/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCompare}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E4E1DA] flex flex-col overflow-hidden z-10 animate-modal-pop">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#E4E1DA] bg-[#FDFCFB] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDE4D2] text-[#123C35] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 id="comparison-title" className="text-base font-semibold text-[#171A19]">
                Product Comparison
              </h2>
              <p className="text-xs text-[#666B67]">
                Side-by-side technical specifications and hardware highlights ({compareProducts.length}/3 products selected)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Highlight Differences Toggle */}
            {compareProducts.length >= 2 && (
              <label className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#171A19] cursor-pointer bg-[#F7F5F0] hover:bg-[#EFECE6] px-3 py-1.5 rounded-lg border border-[#E4E1DA] select-none transition-colors">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="accent-[#123C35] w-3.5 h-3.5 rounded cursor-pointer"
                />
                <span>Highlight Differences</span>
              </label>
            )}

            {/* Clear All */}
            {compareProducts.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-medium text-[#666B67] hover:text-[#123C35] px-2 py-1 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={closeCompare}
              className="p-1.5 text-[#666B67] hover:text-[#171A19] hover:bg-[#F7F5F0] rounded-lg transition-colors cursor-pointer"
              aria-label="Close product comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Table Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {compareProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#EDE4D2] text-[#123C35] flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-semibold text-[#171A19]">No products selected</h3>
                <p className="text-xs text-[#666B67] mt-1">
                  Choose up to 3 products across our catalog to inspect specifications, pricing, and warranty coverage side-by-side.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCompare}
                className="px-5 py-2.5 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#0D302A] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="min-w-[680px]">
              <table className="w-full border-collapse text-left">
                {/* Product Column Headers */}
                <thead>
                  <tr className="border-b-2 border-[#123C35]/15">
                    <th className="w-48 p-4 text-xs font-semibold uppercase tracking-wider text-[#666B67] align-top bg-[#FFFFFF]">
                      Criteria
                    </th>
                    {compareProducts.map(product => (
                      <th
                        key={product.id}
                        className="w-64 p-4 align-top bg-[#FFFFFF] border-l border-[#E4E1DA]/80"
                      >
                        <div className="flex flex-col justify-between h-full space-y-3">
                          {/* Image & Remove CTA */}
                          <div className="relative aspect-square bg-[#F7F5F0] rounded-xl p-3 flex items-center justify-center group overflow-hidden border border-[#E4E1DA]">
                            <button
                              type="button"
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[#FFFFFF] hover:bg-[#E4E1DA] text-[#666B67] hover:text-[#171A19] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                              title="Remove from comparison"
                              aria-label={`Remove ${product.name} from comparison`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                              onClick={() => handleProductClick(product.id)}
                            />
                          </div>

                          {/* Product Title & Category */}
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#666B67]">
                              {product.category}
                            </span>
                            <h4
                              onClick={() => handleProductClick(product.id)}
                              className="text-sm font-semibold text-[#171A19] hover:text-[#123C35] cursor-pointer line-clamp-2 mt-0.5 leading-snug"
                            >
                              {product.name}
                            </h4>
                          </div>

                          {/* Rating & Stock */}
                          <div className="flex items-center justify-between text-xs pt-1">
                            <div className="flex items-center gap-1 text-[#B89B5E]">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-semibold text-[#171A19] tabular-nums">
                                {product.rating}
                              </span>
                              <span className="text-[#666B67]">({product.reviewCount})</span>
                            </div>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                                product.stock > 0
                                  ? 'bg-[#EBF3F0] text-[#123C35]'
                                  : 'bg-[#F7F5F0] text-[#666B67]'
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 pt-1 border-t border-[#E4E1DA]/60">
                            <span className="text-base font-bold text-[#171A19] tabular-nums">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-[#666B67] line-through tabular-nums">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Quick Add CTA */}
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            disabled={product.stock <= 0}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              addedItemIds[product.id]
                                ? 'bg-[#2F6B57] text-[#FFFFFF]'
                                : product.stock <= 0
                                ? 'bg-[#E4E1DA] text-[#666B67] cursor-not-allowed'
                                : 'bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF]'
                            }`}
                          >
                            {addedItemIds[product.id] ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Empty Slots up to 3 */}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, idx) => (
                      <th
                        key={`empty-${idx}`}
                        className="w-64 p-4 align-top bg-[#FDFCFB] border-l border-[#E4E1DA]/80"
                      >
                        <div className="h-full min-h-[300px] border-2 border-dashed border-[#E4E1DA] rounded-xl p-4 flex flex-col items-center justify-center text-center relative">
                          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E4E1DA] text-[#666B67] flex items-center justify-center mb-2">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-[#171A19]">Add Another Product</span>
                          <span className="text-[11px] text-[#666B67] mt-1 max-w-[140px]">
                            Compare up to 3 products side-by-side
                          </span>

                          {/* Add Product Dropdown */}
                          <div className="mt-4 w-full">
                            <select
                              onChange={(e) => {
                                const selected = allProducts.find(p => p.id === e.target.value);
                                if (selected) addToCompare(selected);
                              }}
                              defaultValue=""
                              className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-2.5 py-1.5 text-xs text-[#171A19] font-medium cursor-pointer"
                            >
                              <option value="" disabled>Select product...</option>
                              {availableToAdd.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({formatPrice(p.price)})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body: Section by Section */}
                <tbody className="divide-y divide-[#E4E1DA] text-xs">
                  {/* SECTION 1: OVERVIEW */}
                  <tr className="bg-[#F7F5F0]/70 font-semibold text-[#123C35]">
                    <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                      1. Overview & Tagline
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">Tagline</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-[#171A19] border-l border-[#E4E1DA]/80">
                        {p.tagline}
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">Description</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-[#666B67] leading-relaxed border-l border-[#E4E1DA]/80">
                        {p.description}
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>

                  {/* SECTION 2: CORE HIGHLIGHTS & FEATURES */}
                  <tr className="bg-[#F7F5F0]/70 font-semibold text-[#123C35]">
                    <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                      2. Engineered Features
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB] align-top">
                      Key Capabilities
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 align-top border-l border-[#E4E1DA]/80">
                        <ul className="space-y-1.5">
                          {p.features.map((feat, fidx) => (
                            <li key={fidx} className="flex items-start gap-1.5 text-[#171A19]">
                              <Check className="w-3.5 h-3.5 text-[#123C35] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>

                  {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
                  <tr className="bg-[#F7F5F0]/70 font-semibold text-[#123C35]">
                    <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                      3. Technical Specifications
                    </td>
                  </tr>
                  {allSpecKeys.map(specKey => {
                    const values = compareProducts.map(p => p.specifications[specKey]);
                    const isDiff = hasDiffValues(values);
                    const rowHighlightClass = highlightDifferences && isDiff ? 'bg-[#EDE4D2]/40' : '';

                    return (
                      <tr key={specKey} className={rowHighlightClass}>
                        <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">
                          <div className="flex items-center gap-1.5">
                            <span>{specKey}</span>
                            {highlightDifferences && isDiff && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B89B5E]" title="Differs between models" />
                            )}
                          </div>
                        </td>
                        {compareProducts.map(p => {
                          const val = p.specifications[specKey];
                          return (
                            <td
                              key={p.id}
                              className={`p-4 border-l border-[#E4E1DA]/80 tabular-nums ${
                                val ? 'text-[#171A19] font-medium' : 'text-[#666B67]'
                              }`}
                            >
                              {val || '—'}
                            </td>
                          );
                        })}
                        {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                        ))}
                      </tr>
                    );
                  })}

                  {/* SECTION 4: PHYSICAL DIMENSIONS & WEIGHT */}
                  <tr className="bg-[#F7F5F0]/70 font-semibold text-[#123C35]">
                    <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                      4. Form & Dimensions
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">Dimensions</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-[#171A19] border-l border-[#E4E1DA]/80 tabular-nums">
                        {p.dimensions || '—'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">Product Weight</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-[#171A19] font-medium border-l border-[#E4E1DA]/80 tabular-nums">
                        {p.weight || '—'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>

                  {/* SECTION 5: WARRANTY & LOGISTICS */}
                  <tr className="bg-[#F7F5F0]/70 font-semibold text-[#123C35]">
                    <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                      5. Warranty & Fulfillment
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">Domestic Warranty</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-[#171A19] border-l border-[#E4E1DA]/80">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#123C35] shrink-0" />
                          <span>{p.warranty || '1-Year Official NEXORA Warranty'}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#666B67] bg-[#FDFCFB]">Shipping Details</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#123C35] shrink-0" />
                          <span>{p.shippingInfo || 'Complimentary expedited insured shipping.'}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <td key={i} className="p-4 text-[#666B67] border-l border-[#E4E1DA]/80 bg-[#FDFCFB]">—</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#E4E1DA] bg-[#FDFCFB] flex items-center justify-between">
          <span className="text-xs text-[#666B67]">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E4E1DA] rounded text-[10px]">ESC</kbd> to return to your previous page.
          </span>
          <button
            type="button"
            onClick={closeCompare}
            className="px-5 py-2 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
