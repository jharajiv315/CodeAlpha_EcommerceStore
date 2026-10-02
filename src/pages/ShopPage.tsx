import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product, ProductCategory, ProductFilterState, SortOption } from '../types';
import { FilterBar } from '../components/shop/FilterBar';
import { ShopSidebarFilter } from '../components/shop/ShopSidebarFilter';
import { ShopSidebarSkeleton } from '../components/common/SkeletonLoader';
import { ProductGrid } from '../components/shop/ProductGrid';
import { RecentlyViewedSection } from '../components/shop/RecentlyViewedSection';
import { recordRecentlyViewed } from '../utils/recentlyViewed';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface ShopPageProps {
  initialCategory?: ProductCategory;
  onNavigateHome: () => void;
  onSelectProduct: (productId: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  onNavigateHome,
  onSelectProduct,
}) => {
  const [filters, setFilters] = useState<ProductFilterState>({
    category: initialCategory || 'All',
    minPrice: 0,
    maxPrice: 100000,
    inStockOnly: false,
    minRating: undefined,
    searchQuery: '',
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

  // Sync category if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  // Query products on filter/sort changes
  useEffect(() => {
    setIsLoading(true);
    productService.queryProducts(filters, sort).then(results => {
      setProducts(results);
      setIsLoading(false);
    });
  }, [filters, sort]);

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      minPrice: 0,
      maxPrice: 100000,
      inStockOnly: false,
      minRating: undefined,
      searchQuery: '',
    });
    setSort('featured');
  };

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    {
      label: 'Shop',
      onClick: filters.category !== 'All' || filters.searchQuery ? handleResetFilters : undefined,
    },
    ...(filters.category !== 'All'
      ? [
          {
            label: filters.category,
            onClick: filters.searchQuery ? () => setFilters(f => ({ ...f, searchQuery: '' })) : undefined,
            active: !filters.searchQuery,
          },
        ]
      : []),
    ...(filters.searchQuery ? [{ label: `Search "${filters.searchQuery}"`, active: true }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbs} />

      {/* Catalog Header */}
      <div className="pb-4 border-b border-[#E4E1DA]">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#171A19] tracking-tight">
          {filters.category === 'All' ? 'The Collection' : `${filters.category}`}
        </h1>
        <p className="text-sm text-[#666B67] mt-1.5 max-w-2xl leading-relaxed">
          {filters.category === 'All'
            ? 'Explore precision acoustic monitors, mechanical typing instruments, architectural lighting, and bespoke everyday carries.'
            : `Discover all handcrafted ${filters.category.toLowerCase()} engineered with architectural precision and durable materials.`}
        </p>
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
