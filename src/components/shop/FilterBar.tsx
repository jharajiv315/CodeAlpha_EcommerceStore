import React, { useState, useRef, useEffect } from 'react';
import { ProductCategory, ProductFilterState, SortOption } from '../../types';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { PriceRangeSlider } from './PriceRangeSlider';
import { formatPrice } from '../../utils/currency';

interface FilterBarProps {
  filters: ProductFilterState;
  onFilterChange: (newFilters: ProductFilterState) => void;
  sort: SortOption;
  onSortChange: (newSort: SortOption) => void;
  totalResults: number;
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Smartphones',
  'Laptops',
  'Headphones & Audio',
  'Tablets',
  'Smartwatches & Wearables',
  'Cameras',
  'TVs & Monitors',
  'Gaming',
  'PC Components',
  'Networking & Smart Home',
  'Accessories',
];

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings' },
  { value: 4.8, label: '4.8 & above' },
  { value: 4.5, label: '4.5 & above' },
  { value: 4.0, label: '4.0 & above' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  sort,
  onSortChange,
  totalResults,
  showSidebarToggle = false,
  sidebarOpen = true,
  onToggleSidebar,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);

  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(target)) {
        setPriceDropdownOpen(false);
      }
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(target)) {
        setRatingDropdownOpen(false);
      }
    };
    if (priceDropdownOpen || ratingDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [priceDropdownOpen, ratingDropdownOpen]);

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleCategorySelect = (category: ProductCategory | 'All') => {
    onFilterChange({ ...filters, category });
  };

  const handleRatingSelect = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating === 0 ? undefined : rating });
    setRatingDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, searchQuery: '' });
  };

  const resetAllFilters = () => {
    onFilterChange({
      category: 'All',
      brand: undefined,
      minPrice: 0,
      maxPrice: 500000,
      inStockOnly: false,
      minRating: undefined,
      searchQuery: '',
    });
    onSortChange('featured');
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    Boolean(filters.brand) ||
    filters.minPrice > 0 ||
    filters.maxPrice < 350000 ||
    filters.inStockOnly ||
    (filters.minRating !== undefined && filters.minRating > 0) ||
    filters.searchQuery.trim().length > 0;

  return (
    <div className="space-y-3 mb-6">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666B67] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search iPhone, MacBook, Sony, OLED, RTX, Galaxy..."
            className="w-full bg-[#FFFFFF] border border-[#E4E1DA] focus:border-[#123C35] rounded-lg pl-10 pr-9 py-2.5 text-sm text-[#171A19] placeholder:text-[#666B67]/70 transition-colors"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666B67] hover:text-[#171A19] p-0.5 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side: Sidebar toggle, Results count, Sort selector, Mobile filter trigger */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Desktop Sidebar Toggle Button */}
          {showSidebarToggle && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer select-none ${
                sidebarOpen
                  ? 'bg-[#EDE4D2] border-[#123C35] text-[#123C35]'
                  : 'bg-[#FFFFFF] border-[#E4E1DA] text-[#171A19] hover:bg-[#F7F5F0]'
              }`}
              title={sidebarOpen ? 'Collapse sidebar filter' : 'Expand sidebar filter'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#123C35]" />
              <span>{sidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          )}

          <span className="text-xs text-[#666B67] tabular-nums whitespace-nowrap">
            Showing <strong className="font-semibold text-[#171A19]">{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
          </span>

          <div className="h-4 w-[1px] bg-[#E4E1DA] hidden md:block" />

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-[#666B67] hidden sm:inline whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-xs font-medium text-[#171A19] focus:border-[#123C35] transition-colors cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg text-xs font-medium text-[#171A19] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#123C35]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#123C35]" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Filter Toolbar Row */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E4E1DA]/80">
        {/* Category Tabs (Segmented Buttons) */}
        <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E4E1DA] p-1 rounded-lg overflow-x-auto">
          {CATEGORIES.map(cat => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#123C35] text-[#FFFFFF]'
                    : 'text-[#666B67] hover:text-[#171A19]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters & Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Price Range Slider Dropdown */}
          <div className="relative" ref={priceDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setPriceDropdownOpen(prev => !prev);
                setRatingDropdownOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer select-none ${
                filters.minPrice > 0 || filters.maxPrice < 350000
                  ? 'bg-[#EDE4D2] border-[#123C35] text-[#123C35] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E4E1DA] text-[#171A19] hover:border-[#171A19]/40'
              }`}
              aria-expanded={priceDropdownOpen}
              aria-haspopup="true"
            >
              <span>
                {filters.minPrice > 0 || filters.maxPrice < 350000
                  ? `Price: ${formatPrice(filters.minPrice)} – ${filters.maxPrice >= 350000 ? '₹350k+' : formatPrice(filters.maxPrice)}`
                  : 'Price'}
              </span>
              {priceDropdownOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#123C35]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#666B67]" />
              )}
            </button>

            {/* Popover Card */}
            {priceDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl shadow-xl p-4 z-30 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onChange={handlePriceChange}
                />
              </div>
            )}
          </div>

          {/* Rating Dropdown Filter */}
          <div className="relative" ref={ratingDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setRatingDropdownOpen(prev => !prev);
                setPriceDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer select-none ${
                filters.minRating && filters.minRating > 0
                  ? 'bg-[#EDE4D2] border-[#123C35] text-[#123C35] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E4E1DA] text-[#171A19] hover:border-[#171A19]/40'
              }`}
              aria-expanded={ratingDropdownOpen}
              aria-haspopup="true"
            >
              <Star className={`w-3.5 h-3.5 ${filters.minRating && filters.minRating > 0 ? 'text-[#B89B5E] fill-[#B89B5E]' : 'text-[#666B67]'}`} />
              <span>
                {filters.minRating && filters.minRating > 0
                  ? `${filters.minRating}★+`
                  : 'Rating'}
              </span>
              {ratingDropdownOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#123C35]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#666B67]" />
              )}
            </button>

            {/* Rating Dropdown Menu */}
            {ratingDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl shadow-xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#666B67]">
                  Customer Rating
                </div>
                {RATING_OPTIONS.map(opt => {
                  const isSelected = opt.value === 0
                    ? !filters.minRating || filters.minRating === 0
                    : filters.minRating === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleRatingSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#EDE4D2] text-[#123C35] font-semibold'
                          : 'text-[#171A19] hover:bg-[#F7F5F0]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {opt.value > 0 && (
                          <Star className="w-3 h-3 text-[#B89B5E] fill-current" />
                        )}
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Availability Toggle */}
          <label className={`flex items-center gap-2 text-xs cursor-pointer border px-3 py-1.5 rounded-lg select-none transition-colors ${
            filters.inStockOnly
              ? 'bg-[#EDE4D2] border-[#123C35] text-[#123C35] font-semibold'
              : 'bg-[#FFFFFF] border-[#E4E1DA] text-[#171A19] hover:border-[#171A19]/40'
          }`}>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="accent-[#123C35] w-3.5 h-3.5 rounded cursor-pointer"
            />
            <span>In stock only</span>
          </label>

          {/* Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-[#666B67] hover:text-[#171A19] px-2 py-1 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Strip */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-[11px] font-medium text-[#666B67] uppercase tracking-wider">
            Active:
          </span>

          {/* Category Chip */}
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E1DA] px-2.5 py-1 rounded-full text-xs font-medium text-[#171A19]">
              <span>Category: {filters.category}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, category: 'All' })}
                className="text-[#666B67] hover:text-[#171A19] cursor-pointer"
                aria-label={`Remove category filter ${filters.category}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Price Range Chip */}
          {(filters.minPrice > 0 || filters.maxPrice < 100000) && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E1DA] px-2.5 py-1 rounded-full text-xs font-medium text-[#171A19]">
              <span>Price: {formatPrice(filters.minPrice)} – {filters.maxPrice >= 30000 ? '₹30k+' : formatPrice(filters.maxPrice)}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, minPrice: 0, maxPrice: 100000 })}
                className="text-[#666B67] hover:text-[#171A19] cursor-pointer"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Rating Chip */}
          {filters.minRating !== undefined && filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E1DA] px-2.5 py-1 rounded-full text-xs font-medium text-[#171A19]">
              <span>Rating: ≥ {filters.minRating}★</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, minRating: undefined })}
                className="text-[#666B67] hover:text-[#171A19] cursor-pointer"
                aria-label="Remove rating filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* In-Stock Only Chip */}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E1DA] px-2.5 py-1 rounded-full text-xs font-medium text-[#171A19]">
              <span>In stock only</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, inStockOnly: false })}
                className="text-[#666B67] hover:text-[#171A19] cursor-pointer"
                aria-label="Remove in-stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Search Query Chip */}
          {filters.searchQuery.trim().length > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E1DA] px-2.5 py-1 rounded-full text-xs font-medium text-[#171A19]">
              <span>Query: "{filters.searchQuery}"</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="text-[#666B67] hover:text-[#171A19] cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Clear All Chip Button */}
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs font-medium text-[#123C35] hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Mobile Filters Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-[#171A19]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FFFFFF] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E1DA] mb-6">
                <h3 className="text-base font-semibold text-[#171A19]">Filters & Refinements</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#666B67] hover:text-[#171A19] cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-3">
                  Category
                </h4>
                <div className="flex flex-col gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        filters.category === cat
                          ? 'bg-[#123C35] text-[#FFFFFF] font-medium'
                          : 'text-[#171A19] hover:bg-[#F7F5F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="mb-6">
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onChange={handlePriceChange}
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-3">
                  Customer Rating
                </h4>
                <div className="flex flex-col gap-1.5">
                  {RATING_OPTIONS.map(opt => {
                    const isSelected = opt.value === 0
                      ? !filters.minRating || filters.minRating === 0
                      : filters.minRating === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleRatingSelect(opt.value)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#EDE4D2] text-[#123C35] font-semibold'
                            : 'text-[#171A19] hover:bg-[#F7F5F0]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {opt.value > 0 && (
                            <Star className="w-3.5 h-3.5 text-[#B89B5E] fill-current" />
                          )}
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 text-sm text-[#171A19] cursor-pointer p-2.5 bg-[#F7F5F0] rounded-lg">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
                    className="accent-[#123C35] w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Show in-stock items only</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E4E1DA] space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Apply Filters ({totalResults} items)
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full py-2 bg-transparent text-[#666B67] hover:text-[#171A19] text-xs font-medium cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
