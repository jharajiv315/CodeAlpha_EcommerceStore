import React, { useState } from 'react';
import { ProductCategory, ProductFilterState, Product } from '../../types';
import { PriceRangeSlider } from './PriceRangeSlider';
import { Star, RotateCcw, ChevronDown, ChevronUp, Check, Layers, ShieldCheck } from 'lucide-react';

interface ShopSidebarFilterProps {
  filters: ProductFilterState;
  onFilterChange: (newFilters: ProductFilterState) => void;
  allProducts: Product[];
  totalResults: number;
}

const CATEGORIES: ProductCategory[] = ['Electronics', 'Accessories', 'Gaming', 'Lifestyle'];

const RATING_TIERS = [
  { value: 0, label: 'All Ratings' },
  { value: 4.8, label: '4.8 & above' },
  { value: 4.5, label: '4.5 & above' },
  { value: 4.0, label: '4.0 & above' },
];

export const ShopSidebarFilter: React.FC<ShopSidebarFilterProps> = ({
  filters,
  onFilterChange,
  allProducts,
  totalResults,
}) => {
  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategorySelect = (category: ProductCategory | 'All') => {
    onFilterChange({ ...filters, category });
  };

  const handleRatingSelect = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating === 0 ? undefined : rating });
  };

  const handleAvailabilityToggle = (inStockOnly: boolean) => {
    onFilterChange({ ...filters, inStockOnly });
  };

  const resetAllFilters = () => {
    onFilterChange({
      category: 'All',
      minPrice: 0,
      maxPrice: 100000,
      inStockOnly: false,
      minRating: undefined,
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000 ||
    filters.inStockOnly ||
    (filters.minRating !== undefined && filters.minRating > 0) ||
    filters.searchQuery.trim().length > 0;

  // Aggregate product counts
  const totalCount = allProducts.length;
  const inStockCount = allProducts.filter(p => p.stock > 0).length;
  const getCategoryCount = (cat: ProductCategory) => allProducts.filter(p => p.category === cat).length;
  const getRatingCount = (minRate: number) => allProducts.filter(p => p.rating >= minRate).length;

  return (
    <aside className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden divide-y divide-[#E4E1DA]/80">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between bg-[#FDFCFB]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#123C35]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A19]">
            Catalog Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="flex items-center gap-1 text-[11px] font-medium text-[#666B67] hover:text-[#123C35] transition-colors cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter Section */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171A19] cursor-pointer mb-3"
          aria-expanded={openSections.categories}
        >
          <span>Category</span>
          {openSections.categories ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#666B67]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#666B67]" />
          )}
        </button>

        {openSections.categories && (
          <div className="space-y-1">
            {/* All Categories Option */}
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                filters.category === 'All'
                  ? 'bg-[#123C35] text-[#FFFFFF] font-semibold'
                  : 'text-[#171A19] hover:bg-[#F7F5F0]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${filters.category === 'All' ? 'bg-[#FFFFFF]' : 'bg-transparent'}`} />
                <span>All Disciplines</span>
              </div>
              <span className={`text-[11px] tabular-nums ${filters.category === 'All' ? 'text-[#FFFFFF]/80' : 'text-[#666B67]'}`}>
                {totalCount}
              </span>
            </button>

            {/* Individual Categories */}
            {CATEGORIES.map(cat => {
              const active = filters.category === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#123C35] text-[#FFFFFF] font-semibold'
                      : 'text-[#171A19] hover:bg-[#F7F5F0]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#FFFFFF]' : 'bg-transparent'}`} />
                    <span>{cat}</span>
                  </div>
                  <span className={`text-[11px] tabular-nums ${active ? 'text-[#FFFFFF]/80' : 'text-[#666B67]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Price Range Slider Section */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171A19] cursor-pointer mb-3"
          aria-expanded={openSections.price}
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#666B67]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#666B67]" />
          )}
        </button>

        {openSections.price && (
          <div className="pt-1">
            <PriceRangeSlider
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={(min, max) => onFilterChange({ ...filters, minPrice: min, maxPrice: max })}
              compact={true}
            />
          </div>
        )}
      </div>

      {/* 3. Rating Filter Section */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171A19] cursor-pointer mb-3"
          aria-expanded={openSections.rating}
        >
          <span>Customer Rating</span>
          {openSections.rating ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#666B67]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#666B67]" />
          )}
        </button>

        {openSections.rating && (
          <div className="space-y-1">
            {RATING_TIERS.map(tier => {
              const active = tier.value === 0
                ? !filters.minRating || filters.minRating === 0
                : filters.minRating === tier.value;
              const count = tier.value === 0 ? totalCount : getRatingCount(tier.value);

              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => handleRatingSelect(tier.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#EDE4D2] text-[#123C35] font-semibold'
                      : 'text-[#171A19] hover:bg-[#F7F5F0]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {tier.value === 0 ? (
                      <span>All Ratings</span>
                    ) : (
                      <>
                        <div className="flex items-center text-[#B89B5E]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span>{tier.label}</span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] text-[#666B67] tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Availability Filter Section */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleSection('availability')}
          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171A19] cursor-pointer mb-3"
          aria-expanded={openSections.availability}
        >
          <span>Availability</span>
          {openSections.availability ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#666B67]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#666B67]" />
          )}
        </button>

        {openSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#F7F5F0]/70 hover:bg-[#F7F5F0] cursor-pointer transition-colors select-none">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => handleAvailabilityToggle(e.target.checked)}
                  className="accent-[#123C35] w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-[#171A19]">In Stock Only</span>
              </div>
              <span className="text-[11px] text-[#666B67] tabular-nums">
                {inStockCount} units
              </span>
            </label>

            <div className="flex items-center gap-1.5 px-2 text-[11px] text-[#666B67]">
              <ShieldCheck className="w-3 h-3 text-[#123C35]" />
              <span>Ships within 24 hours from Tokyo</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
