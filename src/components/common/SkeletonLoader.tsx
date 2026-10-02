import React from 'react';

/**
 * Single Product Card Skeleton Loader
 * Mirrored after the luxury ProductCard component
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl overflow-hidden flex flex-col shadow-xs animate-pulse"
      aria-hidden="true"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-[#EFECE6] flex items-center justify-center p-4">
        {/* Subtle Tag Placeholder */}
        <div className="absolute top-3 left-3 w-16 h-4 bg-[#E4E1DA] rounded-sm" />
        {/* Compare / Wishlist Button Placeholders */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-[#E4E1DA]" />
          <div className="w-8 h-8 rounded-full bg-[#E4E1DA]" />
        </div>
        {/* Central silhouette shimmer */}
        <div className="w-28 h-28 rounded-xl bg-[#E4E1DA]/50" />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-3 bg-[#E4E1DA] rounded" />
            <div className="w-2 h-2 rounded-full bg-[#E4E1DA]" />
            <div className="w-12 h-3 bg-[#E4E1DA] rounded" />
          </div>

          {/* Product Title */}
          <div className="w-4/5 h-4.5 bg-[#E4E1DA] rounded mt-1" />

          {/* Tagline */}
          <div className="w-3/5 h-3 bg-[#E4E1DA]/70 rounded" />
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E4E1DA]/60 flex items-center justify-between">
          <div className="w-20 h-5 bg-[#E4E1DA] rounded" />
          <div className="w-8 h-8 rounded-lg bg-[#E4E1DA]" />
        </div>
      </div>
    </div>
  );
};

/**
 * Product Grid Skeleton
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Shop Sidebar Filter Skeleton
 */
export const ShopSidebarSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden divide-y divide-[#E4E1DA]/80 animate-pulse" aria-hidden="true">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-[#FDFCFB]">
        <div className="w-28 h-4 bg-[#E4E1DA] rounded" />
        <div className="w-12 h-3 bg-[#E4E1DA] rounded" />
      </div>

      {/* Categories */}
      <div className="p-4 space-y-2.5">
        <div className="w-20 h-3.5 bg-[#E4E1DA] rounded mb-3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="w-24 h-3 bg-[#E4E1DA] rounded" />
            <div className="w-6 h-3 bg-[#E4E1DA] rounded" />
          </div>
        ))}
      </div>

      {/* Price Slider */}
      <div className="p-4 space-y-3">
        <div className="w-24 h-3.5 bg-[#E4E1DA] rounded" />
        <div className="w-full h-2 bg-[#E4E1DA] rounded-full my-4" />
        <div className="flex justify-between">
          <div className="w-14 h-3 bg-[#E4E1DA] rounded" />
          <div className="w-14 h-3 bg-[#E4E1DA] rounded" />
        </div>
      </div>

      {/* Ratings */}
      <div className="p-4 space-y-2.5">
        <div className="w-28 h-3.5 bg-[#E4E1DA] rounded mb-3" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="w-28 h-3 bg-[#E4E1DA] rounded" />
            <div className="w-4 h-3 bg-[#E4E1DA] rounded" />
          </div>
        ))}
      </div>

      {/* Availability */}
      <div className="p-4 space-y-2">
        <div className="w-24 h-3.5 bg-[#E4E1DA] rounded mb-2" />
        <div className="w-full h-8 bg-[#EFECE6] rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Complete Product Detail Page Skeleton Loader
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse" aria-hidden="true">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-12 h-3 bg-[#E4E1DA] rounded" />
        <div className="w-3 h-3 bg-[#E4E1DA] rounded" />
        <div className="w-16 h-3 bg-[#E4E1DA] rounded" />
        <div className="w-3 h-3 bg-[#E4E1DA] rounded" />
        <div className="w-32 h-3 bg-[#E4E1DA] rounded" />
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image Frame */}
          <div className="aspect-[4/3] bg-[#EFECE6] rounded-2xl border border-[#E4E1DA] p-6 flex items-center justify-center">
            <div className="w-64 h-64 rounded-2xl bg-[#E4E1DA]/50" />
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-xl bg-[#EFECE6] border border-[#E4E1DA] p-2"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div className="space-y-3 pb-6 border-b border-[#E4E1DA]">
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-[#E4E1DA] rounded" />
              <div className="w-32 h-4 bg-[#E4E1DA] rounded" />
            </div>

            <div className="w-4/5 h-8 bg-[#E4E1DA] rounded" />
            <div className="w-3/5 h-4 bg-[#E4E1DA] rounded" />

            <div className="pt-2 flex items-baseline gap-3">
              <div className="w-28 h-8 bg-[#E4E1DA] rounded" />
              <div className="w-16 h-5 bg-[#E4E1DA] rounded" />
            </div>

            <div className="w-full h-3 bg-[#E4E1DA]/70 rounded" />
          </div>

          {/* Stock Indicator */}
          <div className="w-36 h-4 bg-[#E4E1DA] rounded" />

          {/* Quantity Stepper & Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-28 h-11 bg-[#EFECE6] border border-[#E4E1DA] rounded-lg" />
              <div className="flex-1 h-11 bg-[#E4E1DA] rounded-lg" />
              <div className="w-11 h-11 bg-[#E4E1DA] rounded-lg" />
            </div>

            <div className="w-full h-11 bg-[#EFECE6] border border-[#E4E1DA] rounded-lg" />
            <div className="w-full h-9 bg-[#EFECE6] border border-[#E4E1DA] rounded-lg" />
          </div>

          {/* Trust Badges */}
          <div className="pt-4 border-t border-[#E4E1DA] grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg p-2 flex flex-col items-center justify-center gap-1.5">
                <div className="w-5 h-5 bg-[#E4E1DA] rounded-full" />
                <div className="w-12 h-2.5 bg-[#E4E1DA] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications & Details Tabs Skeleton */}
      <div className="pt-8 border-t border-[#E4E1DA] space-y-6">
        <div className="flex items-center gap-6 border-b border-[#E4E1DA] pb-2">
          <div className="w-32 h-6 bg-[#E4E1DA] rounded" />
          <div className="w-28 h-6 bg-[#E4E1DA] rounded" />
          <div className="w-28 h-6 bg-[#E4E1DA] rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl flex justify-between">
              <div className="w-28 h-4 bg-[#E4E1DA] rounded" />
              <div className="w-36 h-4 bg-[#E4E1DA] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="pt-10 border-t border-[#E4E1DA] space-y-6">
        <div className="w-48 h-6 bg-[#E4E1DA] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
