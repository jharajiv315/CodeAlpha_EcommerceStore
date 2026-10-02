import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useComparison } from '../../context/ComparisonContext';
import { ProductCategory } from '../../types';
import { MobileDrawer } from './MobileDrawer';
import { ShoppingBag, Heart, User, Search, Menu, Scale } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, category?: ProductCategory) => void;
  onOpenSearch?: () => void;
}

const NAV_LINKS: { label: string; category?: ProductCategory }[] = [
  { label: 'All Products' },
  { label: 'Smartphones', category: 'Smartphones' },
  { label: 'Laptops', category: 'Laptops' },
  { label: 'Audio', category: 'Headphones & Audio' },
  { label: 'TVs & Monitors', category: 'TVs & Monitors' },
  { label: 'Gaming', category: 'Gaming' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
}) => {
  const { openCart, totalItemCount } = useCart();
  const { user, isAuthenticated, wishlist } = useAuth();
  const { compareProducts, openCompare } = useComparison();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  const handleCategoryClick = (category?: ProductCategory) => {
    onNavigate('shop', category);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E4E1DA] transition-all">
        {/* Strict 3-Zone Contract */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#171A19] hover:text-[#123C35] rounded-md transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="/"
              onClick={handleBrandClick}
              className="text-lg sm:text-xl font-bold tracking-[0.18em] text-[#171A19] hover:text-[#123C35] transition-colors select-none"
            >
              NEXORA
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#666B67]">
            {NAV_LINKS.map(link => {
              const isActive = currentRoute === 'shop' && link.category ? false : false; // Managed in ShopPage
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleCategoryClick(link.category)}
                  className="hover:text-[#171A19] hover:underline underline-offset-8 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else onNavigate('shop');
              }}
              className="p-2 text-[#666B67] hover:text-[#171A19] rounded-lg transition-colors cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <button
              type="button"
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-[#666B67] hover:text-[#171A19] rounded-lg transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="View saved wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#123C35] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Product Comparison Trigger */}
            <button
              type="button"
              onClick={openCompare}
              className={`relative p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                compareProducts.length > 0
                  ? 'text-[#123C35] bg-[#EDE4D2]/60 hover:bg-[#EDE4D2]'
                  : 'text-[#666B67] hover:text-[#171A19]'
              }`}
              aria-label={`Compare products (${compareProducts.length} selected)`}
              title={`Compare products (${compareProducts.length}/3 selected)`}
            >
              <Scale className="w-4 h-4" />
              {compareProducts.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#123C35] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {compareProducts.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-[#666B67] hover:text-[#171A19] rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              aria-label={`Shopping bag with ${totalItemCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-[#123C35] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Account / Profile Action */}
            <button
              type="button"
              onClick={() => onNavigate(isAuthenticated ? 'profile' : 'auth')}
              className="p-1.5 text-[#666B67] hover:text-[#171A19] rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              aria-label={isAuthenticated ? 'Account profile' : 'Sign in'}
            >
              {isAuthenticated && user ? (
                <div className="w-7 h-7 rounded-full bg-[#EDE4D2] text-[#123C35] font-semibold text-xs flex items-center justify-center border border-[#B89B5E]/30">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={onNavigate}
        currentRoute={currentRoute}
      />
    </>
  );
};
