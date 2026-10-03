import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import { Product, ProductCategory, ProductFilterState, SortOption } from '../types';
import { FilterBar } from '../components/shop/FilterBar';
import { ShopSidebarFilter } from '../components/shop/ShopSidebarFilter';
import { ShopSidebarSkeleton } from '../components/common/SkeletonLoader';
import { ProductGrid } from '../components/shop/ProductGrid';
import { RecentlyViewedSection } from '../components/shop/RecentlyViewedSection';
import { recordRecentlyViewed } from '../utils/recentlyViewed';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Check, Tag } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: ProductCategory;
  initialBrand?: string;
  initialSearch?: string;
  initialDealsOnly?: boolean;
  initialNewOnly?: boolean;
  onNavigateHome: () => void;
  onSelectProduct: (productId: string) => void;
}

const CATEGORY_METADATA: Record<
  string,
  {
    title: string;
    description: string;
    suggestedBrands: string[];
    highlightTag?: string;
  }
> = {
  Smartphones: {
    title: 'Smartphones & Flagship Mobile',
    description: 'High-speed 5G performance, pro-grade camera systems, and vibrant OLED displays from Apple, Samsung, Google, and OnePlus.',
    suggestedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing', 'Motorola'],
    highlightTag: '5G Ready',
  },
  Laptops: {
    title: 'Laptops & Mobile Workstations',
    description: 'Apple Silicon M3 MacBooks, Intel & AMD gaming powerhouses, and ultra-light executive ultrabooks for work, code, and play.',
    suggestedBrands: ['Apple', 'Dell', 'ASUS', 'HP', 'Lenovo', 'Acer'],
    highlightTag: 'High Performance',
  },
  'Headphones & Audio': {
    title: 'Headphones & High-Fidelity Audio',
    description: 'Industry-leading active noise cancelling cans, spatial audio earbuds, and studio reference monitors from Sony, Bose, and Sennheiser.',
    suggestedBrands: ['Sony', 'Apple', 'Bose', 'Sennheiser', 'JBL', 'Marshall', 'boAt'],
    highlightTag: 'Active ANC',
  },
  'TVs & Monitors': {
    title: 'Televisions & Gaming Monitors',
    description: 'Infinite-contrast OLED TVs, quantum-dot displays, and high-refresh competitive esports panels from LG, Samsung, Sony, and ASUS.',
    suggestedBrands: ['LG', 'Samsung', 'Sony', 'ASUS', 'BenQ'],
    highlightTag: '4K OLED & High Refresh',
  },
  Gaming: {
    title: 'Gaming Consoles & Peripherals',
    description: 'PlayStation 5, Xbox Series X, Nintendo consoles, rapid-trigger mechanical keyboards, and ultra-light wireless mice.',
    suggestedBrands: ['PlayStation', 'Xbox', 'Nintendo', 'Razer', 'Logitech', 'SteelSeries', 'ASUS'],
    highlightTag: 'Console & PC Esports',
  },
  'PC Components': {
    title: 'PC Hardware & Components',
    description: 'NVIDIA RTX graphics, AMD Ryzen & Intel Core desktop processors, PCIe 4.0 NVMe storage, and high-frequency DDR5 memory.',
    suggestedBrands: ['NVIDIA', 'AMD', 'Intel', 'Corsair', 'Western Digital', 'NZXT'],
    highlightTag: 'DIY & Upgrade',
  },
  Cameras: {
    title: 'Cameras & Creator Imaging',
    description: 'Full-frame mirrorless camera bodies, 4K gimbal cameras, and pro stabilization accessories from Sony, Canon, Nikon, and DJI.',
    suggestedBrands: ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'GoPro', 'DJI'],
    highlightTag: 'Pro Mirrorless',
  },
  Tablets: {
    title: 'Tablets & Creative Slates',
    description: 'M4 iPad Pro, Samsung Galaxy Tab S10, and high-refresh digital canvases designed for drawing, reading, and productivity.',
    suggestedBrands: ['Apple', 'Samsung', 'OnePlus', 'Lenovo', 'Xiaomi'],
    highlightTag: 'Stylus & Work',
  },
  'Smartwatches & Wearables': {
    title: 'Smartwatches & Fitness Trackers',
    description: 'Advanced ECG sensors, multi-day GPS sport tracking, and AMOLED wrist wearables from Apple, Samsung, and Garmin.',
    suggestedBrands: ['Apple', 'Samsung', 'Garmin', 'Google', 'OnePlus', 'Amazfit'],
    highlightTag: 'Health & GPS',
  },
  'Networking & Smart Home': {
    title: 'Smart Home & Wi-Fi 7 Networking',
    description: 'Whole-home multi-gigabit mesh Wi-Fi systems, Google Nest displays, and Philips Hue ambient lighting ecosystems.',
    suggestedBrands: ['TP-Link', 'Netgear', 'Google', 'Amazon', 'Philips Hue'],
    highlightTag: 'Mesh & IoT',
  },
  Accessories: {
    title: 'Cables, Fast Chargers & Power',
    description: 'High-wattage GaN fast chargers, certified braided Thunderbolt cables, and MagSafe wireless power banks.',
    suggestedBrands: ['Anker', 'Apple', 'Belkin', 'Spigen', 'Satechi', 'UGREEN'],
    highlightTag: 'GaN & MagSafe',
  },
};

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialBrand,
  initialSearch,
  initialDealsOnly,
  initialNewOnly,
  onNavigateHome,
  onSelectProduct,
}) => {
  const [filters, setFilters] = useState<ProductFilterState>({
    category: initialCategory || 'All',
    brand: initialBrand || undefined,
    minPrice: 0,
    maxPrice: 350000,
    inStockOnly: false,
    minRating: undefined,
    searchQuery: initialSearch || '',
  });

  const [sort, setSort] = useState<SortOption>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load all products once for sidebar counts and aggregate metadata
  useEffect(() => {
    productService.getAllProducts().then(all => {
      setAllProducts(all);
    });
  }, []);

  // Sync category, brand, search if props change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: initialCategory || 'All',
      brand: initialBrand !== undefined ? initialBrand : prev.brand,
      searchQuery: initialSearch !== undefined ? initialSearch : prev.searchQuery,
    }));
  }, [initialCategory, initialBrand, initialSearch]);

  // Query products on filter/sort changes
  useEffect(() => {
    setIsLoading(true);
    productService.queryProducts(filters, sort).then(results => {
      let filtered = results;
      if (initialDealsOnly) {
        filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
      }
      setProducts(filtered);
      setIsLoading(false);
    });
  }, [filters, sort, initialDealsOnly]);

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      brand: undefined,
      minPrice: 0,
      maxPrice: 350000,
      inStockOnly: false,
      minRating: undefined,
      searchQuery: '',
    });
    setSort('featured');
  };

  const currentCategoryMeta = useMemo(() => {
    if (filters.category !== 'All' && CATEGORY_METADATA[filters.category]) {
      return CATEGORY_METADATA[filters.category];
    }
    return {
      title: 'Electronics & Computing Catalog',
      description: 'Explore authentic flagship smartphones, high-performance laptops, studio audio, and pro displays with transparent Indian pricing and official warranty.',
      suggestedBrands: ['Apple', 'Samsung', 'Sony', 'Dell', 'ASUS', 'NVIDIA', 'Bose', 'HP', 'Lenovo'],
    };
  }, [filters.category]);

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    {
      label: 'Shop',
      onClick: filters.category !== 'All' || filters.brand || filters.searchQuery ? handleResetFilters : undefined,
    },
    ...(filters.category !== 'All'
      ? [
          {
            label: filters.category,
            onClick: filters.brand || filters.searchQuery ? () => setFilters(f => ({ ...f, brand: undefined, searchQuery: '' })) : undefined,
            active: !filters.brand && !filters.searchQuery,
          },
        ]
      : []),
    ...(filters.brand ? [{ label: filters.brand, active: !filters.searchQuery }] : []),
    ...(filters.searchQuery ? [{ label: `Search "${filters.searchQuery}"`, active: true }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbs} />

      {/* Category Entry Experience Header */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-2.5 py-0.5 rounded-sm">
                {filters.category === 'All' ? 'Complete Catalog' : 'Official Category'}
              </span>
              {initialDealsOnly && (
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] bg-[#2F6B57] px-2.5 py-0.5 rounded-sm">
                  <Tag className="w-3 h-3" />
                  Special Deals
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A19] tracking-tight">
              {filters.searchQuery
                ? `Search Results for "${filters.searchQuery}"`
                : filters.brand
                ? `${filters.brand} ${filters.category !== 'All' ? filters.category : 'Collection'}`
                : currentCategoryMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1 max-w-3xl leading-relaxed">
              {currentCategoryMeta.description}
            </p>
          </div>

          <div className="text-xs text-[#666B67] shrink-0 bg-[#F7F5F0] px-4 py-2.5 rounded-xl border border-[#E4E1DA] text-right sm:text-left">
            <span className="block font-bold text-[#171A19] text-sm tabular-nums">
              {products.length} Products
            </span>
            <span>in current selection</span>
          </div>
        </div>

        {/* Quick Brand Navigation Pills for this Category */}
        <div className="pt-3 border-t border-[#E4E1DA] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#666B67] mr-1">
            Filter by Brand:
          </span>
          <button
            type="button"
            onClick={() => setFilters(f => ({ ...f, brand: undefined }))}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              !filters.brand
                ? 'bg-[#123C35] text-[#FFFFFF] border-[#123C35]'
                : 'bg-[#F7F5F0] text-[#171A19] border-[#E4E1DA] hover:border-[#171A19]'
            }`}
          >
            All Brands
          </button>
          {currentCategoryMeta.suggestedBrands.map(brandName => {
            const isSelected = filters.brand?.toLowerCase() === brandName.toLowerCase();
            return (
              <button
                key={brandName}
                type="button"
                onClick={() => setFilters(f => ({ ...f, brand: isSelected ? undefined : brandName }))}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#123C35] text-[#FFFFFF] border-[#123C35]'
                    : 'bg-[#FFFFFF] text-[#171A19] border-[#E4E1DA] hover:border-[#123C35]'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                <span>{brandName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Filter Toolbar & Dropdowns */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        totalResults={products.length}
        showSidebarToggle={true}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />

      {/* Main Body: Desktop Sidebar + Product Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Collapsible Desktop Sidebar Filter */}
        {sidebarOpen && (
          <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-20">
            {allProducts.length === 0 ? (
              <ShopSidebarSkeleton />
            ) : (
              <ShopSidebarFilter
                filters={filters}
                onFilterChange={setFilters}
                allProducts={allProducts}
                totalResults={products.length}
              />
            )}
          </div>
        )}

        {/* Product Grid Area */}
        <div className="flex-1 w-full min-w-0">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onSelectProduct={(id) => {
              recordRecentlyViewed(id);
              onSelectProduct(id);
            }}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Recently Viewed Products Section */}
      <RecentlyViewedSection
        onSelectProduct={(id) => {
          recordRecentlyViewed(id);
          onSelectProduct(id);
        }}
      />
    </div>
  );
};

