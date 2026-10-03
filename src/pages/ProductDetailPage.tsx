import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { formatPrice, calculateDiscountPercent } from '../utils/currency';
import { recordRecentlyViewed } from '../utils/recentlyViewed';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductReviewsSection } from '../components/shop/ProductReviewsSection';
import { ProductDetailSkeleton } from '../components/common/SkeletonLoader';
import {
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Scale,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigateHome: () => void;
  onNavigateShop: (category?: any) => void;
  onSelectProduct: (productId: string) => void;
  onNavigateCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigateHome,
  onNavigateShop,
  onSelectProduct,
  onNavigateCheckout,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'shipping'>('specs');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();
  const { isInCompare, toggleCompare } = useComparison();
  const { addToast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    productService.getProductById(productId).then(prod => {
      if (prod) {
        setProduct(prod);
        setSelectedImage(prod.image);
        setQuantity(1);
        recordRecentlyViewed(prod.id);
        productService.getRelatedProducts(prod.id, 4).then(setRelated);
      }
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [productId]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-semibold text-[#171A19]">Product Not Found</h2>
        <p className="text-sm text-[#666B67] mt-2 mb-6">
          The requested item may have been moved or is no longer in our catalog.
        </p>
        <button
          type="button"
          onClick={() => onNavigateShop()}
          className="px-6 py-2.5 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 6;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    await addToCart(product, quantity, true);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product, quantity, false);
    onNavigateCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied', 'info', 'Product link copied to clipboard');
    }
  };

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Shop', onClick: () => onNavigateShop() },
    { label: product.category, onClick: () => onNavigateShop(product.category) },
    { label: product.name, active: true },
  ];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image, ...(product.gallery || [])],
    description: product.description || product.tagline,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || product.category,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    ...(product.reviewCount && product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl overflow-hidden p-6 sm:p-10 flex items-center justify-center">
            {product.tag && (
              <div className="absolute top-4 left-4 z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-2.5 py-1 rounded-sm">
                  {product.tag}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 text-[#666B67] hover:text-[#171A19] bg-[#F7F5F0] hover:bg-[#E4E1DA] rounded-lg transition-colors cursor-pointer"
              title="Share product"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <img
              key={selectedImage || product.image}
              src={selectedImage || product.image}
              alt={product.name}
              width={600}
              height={440}
              className="w-full h-full object-contain max-h-[440px] animate-fade-in transition-all duration-300"
            />
          </div>

          {/* Thumbnail Strip (if multi-angle gallery exists) */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 bg-[#FFFFFF] border rounded-xl p-2 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#123C35] ring-2 ring-[#123C35]/20 shadow-xs'
                      : 'border-[#E4E1DA] hover:border-[#171A19]/40 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-3 pb-6 border-b border-[#E4E1DA]">
            {/* Brand, Category, SKU and Rating */}
            <div className="flex items-center justify-between text-xs text-[#666B67]">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-2 py-0.5 rounded-xs">
                  {product.brand || product.category}
                </span>
                {product.sku && (
                  <span className="text-[11px] font-mono text-[#5A625C]">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('product-reviews');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 font-medium hover:text-[#123C35] transition-colors cursor-pointer group"
                title="Scroll to client reviews"
              >
                <span className="text-[#B89B5E]">★</span>
                <span className="text-[#171A19] font-bold group-hover:text-[#123C35]">{product.rating}</span>
                <span>·</span>
                <span className="underline underline-offset-2 decoration-[#E4E1DA] group-hover:decoration-[#123C35]">{product.reviewCount?.toLocaleString() || 0} reviews</span>
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A19] tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-[#666B67] leading-relaxed">
              {product.tagline}
            </p>

            {/* Price Row */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#171A19] tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-[#5A625C] line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-[#2F6B57] bg-[#EDE4D2] px-2 py-0.5 rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-[11px] text-[#666B67]">
              Inclusive of all taxes (18% GST included). Free courier shipping & transit insurance nationwide.
            </p>
          </div>

          {/* Delivery Estimate Box */}
          <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#171A19]">
              <Truck className="w-4 h-4 text-[#123C35]" />
              <span>Estimated Delivery: 2–4 Business Days</span>
            </div>
            <p className="text-[11px] text-[#666B67] pl-6">
              Dispatch from Mumbai / Bengaluru hub. Orders placed before 2 PM dispatched same-day.
            </p>
          </div>

          {/* Stock & Availability Status */}
          <div className="flex items-center gap-2 text-xs">
            {isOutOfStock ? (
              <span className="text-[#A94747] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A94747]" />
                Out of Stock — Check back soon
              </span>
            ) : isLowStock ? (
              <span className="text-[#A67C35] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A67C35] animate-pulse" />
                Only {product.stock} units remaining in stock
              </span>
            ) : (
              <span className="text-[#2F6B57] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2F6B57]" />
                In Stock ({product.stock} units) · Ready for immediate dispatch
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
                Quantity
              </span>
              <div className="flex items-center border border-[#E4E1DA] rounded-lg bg-[#FFFFFF]">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-[#666B67] hover:text-[#171A19] transition-colors rounded-l-lg cursor-pointer disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-[#171A19] tabular-nums select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-2 text-[#666B67] hover:text-[#171A19] transition-colors rounded-r-lg cursor-pointer disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1 py-3.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                className={`p-3.5 border rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-90 ${
                  isFavorited
                    ? 'border-[#123C35] bg-[#123C35] text-[#FFFFFF]'
                    : 'border-[#E4E1DA] hover:border-[#171A19] text-[#666B67] hover:text-[#171A19] bg-[#FFFFFF]'
                }`}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 bg-[#FFFFFF] border border-[#171A19] hover:bg-[#171A19] text-[#171A19] hover:text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now</span>
              </button>
            )}

            {/* Compare with Other Products */}
            <button
              type="button"
              onClick={() => toggleCompare(product)}
              className={`w-full py-2.5 border rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                isInCompare(product.id)
                  ? 'border-[#123C35] bg-[#EDE4D2] text-[#123C35]'
                  : 'border-[#E4E1DA] hover:border-[#171A19] text-[#666B67] hover:text-[#171A19] bg-[#FFFFFF]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isInCompare(product.id) ? 'Added to Comparison (Click to Remove)' : 'Compare with Other Products'}</span>
            </button>
          </div>

          {/* Micro trust icons */}
          <div className="pt-4 border-t border-[#E4E1DA] grid grid-cols-3 gap-2 text-center text-[11px] text-[#666B67]">
            <div className="p-2 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg flex flex-col items-center gap-1 shadow-2xs">
              <Truck className="w-4 h-4 text-[#123C35]" />
              <span className="font-semibold text-[#171A19]">Free Insured Delivery</span>
            </div>
            <div className="p-2 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg flex flex-col items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#123C35]" />
              <span className="font-semibold text-[#171A19]">{product.warranty?.split(' ')[0] || '1-Year'} Brand Warranty</span>
            </div>
            <div className="p-2 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg flex flex-col items-center gap-1 shadow-2xs">
              <RotateCcw className="w-4 h-4 text-[#123C35]" />
              <span className="font-semibold text-[#171A19]">7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Product Details Tabs */}
      <div className="pt-10 border-t border-[#E4E1DA]">
        <div className="flex items-center gap-8 border-b border-[#E4E1DA] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'text-[#123C35] border-b-2 border-[#123C35] pb-4 -mb-[18px]'
                : 'text-[#666B67] hover:text-[#171A19]'
            }`}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
              activeTab === 'features'
                ? 'text-[#123C35] border-b-2 border-[#123C35] pb-4 -mb-[18px]'
                : 'text-[#666B67] hover:text-[#171A19]'
            }`}
          >
            Engineering & Features
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
              activeTab === 'shipping'
                ? 'text-[#123C35] border-b-2 border-[#123C35] pb-4 -mb-[18px]'
                : 'text-[#666B67] hover:text-[#171A19]'
            }`}
          >
            Shipping & Warranty
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <div className="border border-[#E4E1DA] rounded-xl overflow-hidden divide-y divide-[#E4E1DA]">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div key={key} className={`grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-xs ${idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#F7F5F0]'}`}>
                    <dt className="font-semibold text-[#171A19]">{key}</dt>
                    <dd className="sm:col-span-2 text-[#666B67] tabular-nums">{val}</dd>
                  </div>
                ))}
                {product.dimensions && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-xs bg-[#FFFFFF]">
                    <dt className="font-semibold text-[#171A19]">Dimensions</dt>
                    <dd className="sm:col-span-2 text-[#666B67] tabular-nums">{product.dimensions}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-xs bg-[#F7F5F0]">
                    <dt className="font-semibold text-[#171A19]">Net Weight</dt>
                    <dd className="sm:col-span-2 text-[#666B67] tabular-nums">{product.weight}</dd>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-3xl space-y-6">
              <p className="text-sm text-[#171A19] leading-relaxed font-normal">
                {product.fullDescription}
              </p>
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#123C35]">
                  Key Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-[#123C35] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#171A19]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-[#FFFFFF] border border-[#E4E1DA] p-6 rounded-xl space-y-4 text-xs text-[#171A19]">
                <div>
                  <h4 className="font-semibold text-[#171A19] text-sm mb-1">Domestic Dispatch & Courier</h4>
                  <p className="text-[#666B67] leading-relaxed">
                    {product.shippingInfo || 'All packages are packed in tamper-evident security cartons and dispatched via air courier within 24 hours of confirmation.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E4E1DA]">
                  <h4 className="font-semibold text-[#171A19] text-sm mb-1">Official Brand Warranty</h4>
                  <p className="text-[#666B67] leading-relaxed">
                    {product.warranty || 'Backed by official manufacturer warranty serviceable across authorized service centers nationwide in India.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E4E1DA]">
                  <h4 className="font-semibold text-[#171A19] text-sm mb-1">7-Day Replacement Policy</h4>
                  <p className="text-[#666B67] leading-relaxed">
                    In the unlikely event of physical transit damage, defective hardware out of the box, or dead on arrival, claim an immediate replacement within 7 days of delivery.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verified Client Product Reviews Section */}
      <div id="product-reviews">
        <ProductReviewsSection productId={product.id} productName={product.name} />
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-[#E4E1DA] space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#123C35]">
                Complete Your Setup
              </span>
              <h3 className="text-2xl font-bold text-[#171A19] tracking-tight mt-1">
                Recommended in this Category
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateShop(product.category)}
              className="text-xs font-semibold uppercase tracking-wider text-[#123C35] hover:text-[#0D302A] cursor-pointer underline underline-offset-4"
            >
              More in {product.category} →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
