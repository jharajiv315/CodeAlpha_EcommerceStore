import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComparison } from '../../context/ComparisonContext';
import { ProductCategory } from '../../types';
import { X, ShoppingBag, Heart, Package, User, LogOut, LogIn, ChevronRight, Scale } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, category?: ProductCategory) => void;
  currentRoute: string;
}

const CATEGORIES: ProductCategory[] = [
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

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentRoute,
}) => {
  const { user, isAuthenticated, logout, wishlist } = useAuth();
  const { compareProducts, openCompare } = useComparison();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNav = (route: string, category?: ProductCategory) => {
    onNavigate(route, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171A19]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-12">
        <div className="w-screen max-w-xs bg-[#FFFFFF] shadow-2xl flex flex-col justify-between">
          {/* Top Brand Header */}
          <div className="p-6 border-b border-[#E4E1DA] flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight text-[#171A19]">
              NEXORA
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#666B67] hover:text-[#171A19] cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNav('home')}
                className={`w-full flex items-center justify-between py-2.5 text-sm font-medium rounded-lg text-left transition-colors cursor-pointer ${
                  currentRoute === 'home' ? 'text-[#123C35] font-semibold' : 'text-[#171A19]'
                }`}
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('shop')}
                className={`w-full flex items-center justify-between py-2.5 text-sm font-medium rounded-lg text-left transition-colors cursor-pointer ${
                  currentRoute === 'shop' ? 'text-[#123C35] font-semibold' : 'text-[#171A19]'
                }`}
              >
                <span>All Products</span>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>
            </div>

            {/* Curated Categories */}
            <div className="pt-2 border-t border-[#E4E1DA]/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-2">
                Categories
              </p>
              <div className="space-y-1 pl-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleNav('shop', cat)}
                    className="w-full text-left py-2 text-sm text-[#666B67] hover:text-[#171A19] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Commerce Shortcuts */}
            <div className="pt-2 border-t border-[#E4E1DA]/60 space-y-1">
              <button
                type="button"
                onClick={() => handleNav('wishlist')}
                className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#171A19] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#666B67]" />
                  <span>Wishlist</span>
                </div>
                {wishlist.length > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-[#EDE4D2] text-[#123C35] rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openCompare();
                }}
                className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#171A19] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-[#666B67]" />
                  <span>Compare Products</span>
                </div>
                <div className="flex items-center gap-2">
                  {compareProducts.length > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#EDE4D2] text-[#123C35] rounded-full">
                      {compareProducts.length}/3
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('orders')}
                className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#171A19] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#666B67]" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('cart')}
                className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#171A19] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#666B67]" />
                  <span>Shopping Bag</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>
            </div>
          </div>

          {/* User Account Section at Bottom */}
          <div className="p-6 border-t border-[#E4E1DA] bg-[#F7F5F0]">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#123C35] text-[#FFFFFF] flex items-center justify-center text-xs font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#171A19] truncate">{user.name}</p>
                    <p className="text-xs text-[#666B67] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNav('profile')}
                    className="flex-1 py-1.5 px-3 bg-[#FFFFFF] border border-[#E4E1DA] rounded text-xs font-medium text-[#171A19] text-center cursor-pointer"
                  >
                    View Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="p-1.5 text-[#666B67] hover:text-[#A94747] cursor-pointer"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleNav('auth')}
                  className="w-full py-2.5 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
