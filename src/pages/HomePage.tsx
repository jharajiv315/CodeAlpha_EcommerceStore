import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { TOP_BRANDS } from '../config/navigation';
import {
  ArrowRight,
  Headphones,
  Laptop,
  Gamepad2,
  Smartphone,
  Tv,
  Cpu,
  Camera,
  Home,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Tag,
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

interface HomePageProps {
  onNavigate: (
    route: string,
    category?: ProductCategory,
    options?: { brand?: string; search?: string; dealsOnly?: boolean; newOnly?: boolean }
  ) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [spotlightProduct, setSpotlightProduct] = useState<Product | null>(null);
  const [totalProducts, setTotalProducts] = useState(108);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService.getAllProducts().then((all) => {
      const featured = all.filter(p => p.featured);
      const arrivals = all.filter(p => p.newArrival);
      setFeaturedProducts(featured.slice(0, 4));
      setNewArrivals(arrivals.slice(0, 4));
      setTotalProducts(all.length);

      // Find top discounted products for the Deals landmark
      const deals = all
        .filter(p => p.originalPrice && p.originalPrice > p.price)
        .sort((a, b) => {
          const discA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
          const discB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
          return discB - discA;
        })
        .slice(0, 4);
      setDealProducts(deals);

      // Pick a flagship spotlight product
      const spotlight =
        featured.find(p => p.id === 'sony-wh-1000xm5') ||
        featured.find(p => p.id === 'apple-iphone-16-pro-max') ||
        featured[0] ||
        all[0] ||
        null;
      setSpotlightProduct(spotlight);
      setIsLoading(false);
    });
  }, []);

  const categories: { name: ProductCategory; icon: any; desc: string; count: string }[] = [
    { name: 'Smartphones', icon: Smartphone, desc: 'Flagship 5G devices from Apple, Samsung, Google & OnePlus', count: '12+ models' },
    { name: 'Laptops', icon: Laptop, desc: 'M3 MacBooks, Dell XPS workstations & ROG gaming rigs', count: '12+ models' },
    { name: 'Headphones & Audio', icon: Headphones, desc: 'Sony WH-series, AirPods Pro & audiophile monitors', count: '12+ models' },
    { name: 'TVs & Monitors', icon: Tv, desc: 'LG OLED evo, Samsung Neo QLED & ROG gaming displays', count: '10+ models' },
    { name: 'Gaming', icon: Gamepad2, desc: 'PlayStation 5, Xbox Series X, Nintendo & pro peripherals', count: '10+ models' },
    { name: 'PC Components', icon: Cpu, desc: 'NVIDIA RTX 40-series, Intel Core i9 & AMD Ryzen processors', count: '10+ models' },
    { name: 'Cameras', icon: Camera, desc: 'Sony Alpha, Canon EOS R, Nikon Z & DJI creator gear', count: '8+ models' },
    { name: 'Networking & Smart Home', icon: Home, desc: 'Wi-Fi 7 mesh routers, Google Nest & Philips Hue systems', count: '8+ models' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* SECTION 1 — COMMERCIAL HERO */}
      <section className="relative bg-[#FFFFFF] border-b border-[#E4E1DA] pt-8 sm:pt-14 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-3 py-1 rounded-sm">
                <span>The 2026 Electronics Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#171A19] leading-[1.1] text-balance">
                Official electronics. Direct from top brands.
              </h1>

              <p className="text-base sm:text-lg text-[#666B67] leading-relaxed max-w-xl font-normal">
                Discover authentic smartphones, high-performance laptops, studio headphones, and gaming gear. 100% genuine inventory with official Indian warranty and insured express dispatch.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="px-7 py-3.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Browse All Products ({totalProducts})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('shop', undefined, { dealsOnly: true })}
                  className="px-7 py-3.5 bg-[#FFFFFF] border border-[#123C35] text-[#123C35] hover:bg-[#EDE4D2]/40 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-[#123C35]" />
                  <span>Today's Deals (Up to 34% Off)</span>
                </button>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-6 border-t border-[#E4E1DA] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#666B67]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#123C35] shrink-0" />
                  <span>Official Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#123C35] shrink-0" />
                  <span>Free Over ₹2,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#123C35] shrink-0" />
                  <span>7-Day Replacement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#123C35] shrink-0" />
                  <span>UPI, Cards & COD</span>
                </div>
              </div>
            </div>

            {/* Right Hero Commercial Product Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-[#F7F5F0] border border-[#E4E1DA] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E1DA]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#123C35]">
                    Flagship Spotlight
                  </span>
                  <span className="text-xs font-semibold text-[#171A19]">
                    {spotlightProduct?.brand || 'Sony'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (spotlightProduct) onSelectProduct(spotlightProduct.id);
                  }}
                  className="group/hero cursor-pointer py-4 flex flex-col items-center justify-center w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123C35] rounded-xl"
                  aria-label={`View flagship spotlight: ${spotlightProduct?.name || 'Sony WH-1000XM5 Wireless Headphones'}`}
                >
                  <div className="w-full aspect-square max-w-[280px] bg-[#FFFFFF] rounded-xl p-6 flex items-center justify-center border border-[#E4E1DA] group-hover/hero:border-[#123C35] transition-colors">
                    <img
                      src={
                        spotlightProduct?.image ||
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={spotlightProduct?.name || 'Flagship Electronics'}
                      width={280}
                      height={280}
                      className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/hero:scale-105 will-change-transform"
                      loading="eager"
                    />
                  </div>

                  <div className="w-full mt-4 bg-[#FFFFFF] p-3 rounded-xl border border-[#E4E1DA] flex items-center justify-between shadow-2xs">
                    <div className="truncate mr-2">
                      <p className="text-xs font-bold text-[#171A19] truncate">
                        {spotlightProduct?.name || 'Sony WH-1000XM5 Wireless Headphones'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#123C35] font-extrabold tabular-nums">
                          {spotlightProduct ? formatPrice(spotlightProduct.price) : '₹27,990'}
                        </span>
                        {spotlightProduct?.originalPrice && (
                          <span className="text-[10px] text-[#5A625C] line-through tabular-nums">
                            {formatPrice(spotlightProduct.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#123C35] bg-[#EDE4D2] px-2.5 py-1 rounded shrink-0 group-hover/hero:bg-[#123C35] group-hover/hero:text-[#FFFFFF] transition-colors">
                      View →
                    </span>
                  </div>
                </button>

                <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-between text-[11px] text-[#666B67]">
                  <span>Ready for immediate dispatch</span>
                  <span className="font-semibold text-[#2F6B57]">In stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171A19] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1">
              Browse genuine consumer technology across major product categories.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1 cursor-pointer underline underline-offset-4"
          >
            <span>All {totalProducts} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(({ name, icon: Icon, desc, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => onNavigate('shop', name)}
              className="group text-left bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] p-5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between h-44 shadow-2xs"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#F7F5F0] group-hover:bg-[#EDE4D2] text-[#123C35] flex items-center justify-center transition-colors duration-200 mb-3 group-hover:scale-105">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-[#171A19] group-hover:text-[#123C35] transition-colors leading-snug">
                  {name}
                </h3>
                <p className="text-[11px] text-[#666B67] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                  {desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#5A625C] pt-2 border-t border-[#E4E1DA]/60">
                <span>{count}</span>
                <span className="font-bold text-[#123C35] opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0">
                  Browse →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3 — TOP ELECTRONICS DEALS */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F6B57] mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Special Offers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#171A19] tracking-tight">
                Top Electronics Deals
              </h2>
              <p className="text-xs sm:text-sm text-[#666B67] mt-1">
                Authentic retail markdowns on premium laptops, audio gear, and flagship displays.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('shop', undefined, { dealsOnly: true })}
              className="text-xs font-bold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1 cursor-pointer underline underline-offset-4"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4 — FEATURED BRANDS */}
      <section className="bg-[#FFFFFF] border-y border-[#E4E1DA] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123C35]">
              Authorized Retail Partnerships
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171A19] tracking-tight">
              Shop by Leading Brand
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67]">
              Every device is sourced directly through official distribution with complete warranty.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TOP_BRANDS.map(brand => (
              <button
                key={brand.name}
                type="button"
                onClick={() => onNavigate('shop', undefined, { brand: brand.name })}
                className="group p-4 bg-[#F7F5F0] hover:bg-[#EDE4D2] border border-[#E4E1DA] hover:border-[#123C35] rounded-xl text-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs cursor-pointer"
              >
                <span className="block text-sm font-bold text-[#171A19] group-hover:text-[#123C35]">
                  {brand.name}
                </span>
                <span className="block text-[11px] text-[#666B67] mt-0.5">
                  {brand.count} items
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#123C35] mb-1">
              Top Customer Rated
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171A19] tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1">
              Proven everyday electronics favored by creators, professionals, and gamers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1 cursor-pointer underline underline-offset-4"
          >
            <span>See entire collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 6 — RETAIL TRUST & VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123C35]">
              The Nexora Retail Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#171A19]">
              Why Buy Consumer Technology at NEXORA
            </h3>
            <p className="text-xs sm:text-sm text-[#666B67]">
              We eliminate counterfeit risks, hidden marketplace surcharges, and warranty ambiguity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#123C35] flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#171A19]">Official India Warranty</h4>
              <p className="text-xs text-[#666B67] leading-relaxed">
                Direct warranty serviced at authorized Apple, Samsung, Sony, and Dell service centers nationwide.
              </p>
            </div>

            <div className="p-5 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#123C35] flex items-center justify-center shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#171A19]">Insured Express Delivery</h4>
              <p className="text-xs text-[#666B67] leading-relaxed">
                Tamper-evident packaging with air courier transit. Every high-value parcel is 100% insured.
              </p>
            </div>

            <div className="p-5 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#123C35] flex items-center justify-center shadow-2xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#171A19]">7-Day Replacement</h4>
              <p className="text-xs text-[#666B67] leading-relaxed">
                Guaranteed replacement if your package experiences transit distress or out-of-the-box hardware issues.
              </p>
            </div>

            <div className="p-5 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#123C35] flex items-center justify-center shadow-2xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#171A19]">Transparent Pricing</h4>
              <p className="text-xs text-[#666B67] leading-relaxed">
                All listed prices in INR include 18% GST with zero surprise checkout fees or convenience surcharges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#123C35] mb-1">
              <span>Latest Releases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171A19] tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1">
              The newest additions to our consumer technology catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', undefined, { newOnly: true })}
            className="text-xs font-bold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1 cursor-pointer underline underline-offset-4"
          >
            <span>Explore all new releases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

