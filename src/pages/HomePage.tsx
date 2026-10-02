import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import {
  ArrowRight,
  Compass,
  Headphones,
  Laptop,
  Gamepad2,
  Smartphone,
  Tv,
  Cpu,
  Camera,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

interface HomePageProps {
  onNavigate: (route: string, category?: ProductCategory) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [spotlightProduct, setSpotlightProduct] = useState<Product | null>(null);
  const [totalProducts, setTotalProducts] = useState(108);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getFeaturedProducts(),
      productService.getNewArrivals(),
      productService.getAllProducts(),
    ]).then(([featured, arrivals, all]) => {
      setFeaturedProducts(featured.slice(0, 4));
      setNewArrivals(arrivals.slice(0, 4));
      setTotalProducts(all.length);
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
    { name: 'Headphones & Audio', icon: Headphones, desc: 'Sony WH-series, AirPods Max & audiophile monitors', count: '12+ models' },
    { name: 'TVs & Monitors', icon: Tv, desc: 'LG OLED evo, Samsung Neo QLED & ROG gaming displays', count: '10+ models' },
    { name: 'Gaming', icon: Gamepad2, desc: 'PlayStation 5, Xbox Series X, Nintendo & Razer peripherals', count: '10+ models' },
    { name: 'PC Components', icon: Cpu, desc: 'NVIDIA RTX 40-series, AMD Ryzen 7800X3D & Samsung SSDs', count: '10+ models' },
    { name: 'Cameras', icon: Camera, desc: 'Sony Alpha, Canon EOS R, Nikon Z & DJI Osmo Pocket 3', count: '8+ models' },
    { name: 'Networking & Smart Home', icon: Home, desc: 'Wi-Fi 7 mesh routers, Google Nest & Philips Hue systems', count: '8+ models' },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-[#E4E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#123C35] bg-[#EDE4D2] px-3 py-1 rounded-sm">
                <span>The 2026 Electronics Collection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#171A19] leading-[1.08] text-balance">
                Engineered for the way you live.
              </h1>

              <p className="text-base sm:text-lg text-[#666B67] leading-relaxed max-w-xl font-normal">
                Authentic flagship electronics from the world's finest engineering brands. Apple, Sony, Samsung, NVIDIA, Bose, and Dell — curated with transparent Indian retail pricing and official warranty.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="px-8 py-3.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:translate-y-[-1px] active:translate-y-0"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('categories-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#171A19] text-[#171A19] text-xs font-medium tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#666B67]" />
                  <span>Explore Categories</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#E4E1DA]/60 flex items-center gap-8 text-xs text-[#666B67]">
                <div>
                  <strong className="text-[#171A19] font-semibold block text-sm">₹2,000+</strong>
                  <span>Free insured shipping</span>
                </div>
                <div className="h-6 w-[1px] bg-[#E4E1DA]" />
                <div>
                  <strong className="text-[#171A19] font-semibold block text-sm">Official</strong>
                  <span>Brand India warranty</span>
                </div>
                <div className="h-6 w-[1px] bg-[#E4E1DA] hidden sm:block" />
                <div className="hidden sm:block">
                  <strong className="text-[#171A19] font-semibold block text-sm">100%</strong>
                  <span>Authentic products</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-6 sm:p-10 shadow-sm overflow-hidden">
                {/* Visual Label */}
                <div className="flex items-center justify-between pb-6 border-b border-[#E4E1DA]">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#123C35]">
                    Spotlight Product
                  </span>
                  <span className="text-xs font-medium text-[#666B67]">
                    {spotlightProduct?.brand || 'Sony'} Flagship
                  </span>
                </div>

                {/* Hero Showcase Product */}
                <div className="py-6 flex items-center justify-center">
                  <div
                    onClick={() => {
                      if (spotlightProduct) onSelectProduct(spotlightProduct.id);
                    }}
                    className="group/hero cursor-pointer relative w-full max-w-sm aspect-square bg-[#F7F5F0] rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-[#123C35]"
                  >
                    <img
                      src={
                        spotlightProduct?.image ||
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={spotlightProduct?.name || 'Flagship Electronics'}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover/hero:scale-105"
                      loading="eager"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-[#FFFFFF]/95 backdrop-blur-xs p-3 rounded-lg border border-[#E4E1DA] flex items-center justify-between shadow-xs">
                      <div className="truncate mr-2">
                        <p className="text-xs font-semibold text-[#171A19] truncate">
                          {spotlightProduct?.name || 'Sony WH-1000XM5 Wireless Headphones'}
                        </p>
                        <span className="text-xs text-[#123C35] font-bold tabular-nums">
                          {spotlightProduct ? formatPrice(spotlightProduct.price) : '₹27,990'}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#123C35] uppercase tracking-wide group-hover/hero:underline flex items-center gap-1 shrink-0">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtle Editorial Accent Note */}
                <div className="pt-4 border-t border-[#E4E1DA] flex items-center justify-between text-xs text-[#666B67]">
                  <span className="truncate max-w-[60%]">
                    {spotlightProduct?.tagline || 'Industry-leading noise cancellation'}
                  </span>
                  <span className="text-[#123C35] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In stock · Express dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CATEGORY NAVIGATION */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#171A19] tracking-tight">
              Featured Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1">
              Browse genuine consumer electronics engineered by industry leaders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
          >
            <span>View all {totalProducts} products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ name, icon: Icon, desc, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => onNavigate('shop', name)}
              className="group text-left bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] p-6 rounded-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F7F5F0] group-hover:bg-[#EDE4D2] text-[#123C35] flex items-center justify-center transition-colors mb-4">
                  <Icon className="w-5 h-5 stroke-[1.6]" />
                </div>
                <h3 className="text-base font-semibold text-[#171A19] group-hover:text-[#123C35] transition-colors">
                  {name}
                </h3>
                <p className="text-xs text-[#666B67] mt-1 line-clamp-2 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#666B67] pt-2 border-t border-[#E4E1DA]/50">
                <span>{count}</span>
                <span className="font-semibold text-[#123C35] opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3 — FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#123C35] mb-1">
              Handpicked Essentials
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#171A19] tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1">
              Everyday essentials, carefully selected for durability and craftsmanship.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
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

      {/* SECTION 4 — EDITORIAL BRAND STORY */}
      <section className="bg-[#FFFFFF] border-y border-[#E4E1DA] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6E2E]">
            The Nexora Philosophy
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171A19] tracking-tight text-balance leading-tight">
            Better products. Less noise.
          </h2>

          <p className="text-base sm:text-lg text-[#666B67] leading-relaxed max-w-2xl mx-auto font-normal">
            We reject the endless cycle of fragile disposable electronics and visual clutter.
            Every instrument we craft or curate is designed around tactile honesty: cold aluminum,
            full-grain leather, tactile switches, and repairable acoustic assemblies.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-[#171A19]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
              <span>Zero unnecessary plastics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
              <span>Calm, distraction-free interfaces</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
              <span>Lifetime design philosophy</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#123C35] mb-1">
              Fresh From The Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#171A19] tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#666B67] mt-1">
              The latest additions to our focused workplace ecosystem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
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
