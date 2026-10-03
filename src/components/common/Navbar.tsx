import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ProductCategory } from '../../types';
import { MobileDrawer } from './MobileDrawer';
import { MegaMenu } from './MegaMenu';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  ChevronDown,
  X,
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (
    route: string,
    category?: ProductCategory,
    options?: { brand?: string; search?: string; dealsOnly?: boolean; newOnly?: boolean }
  ) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const { openCart, totalItemCount } = useCart();
  const { user, isAuthenticated, wishlist } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMegaMenuOpen(false);
    onNavigate('home');
  };

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!supportModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSupportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [supportModalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      onNavigate('shop', undefined, { search: query });
      setIsMobileSearchOpen(false);
      setMegaMenuOpen(false);
    } else {
      onNavigate('shop');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E4E1DA] transition-all select-none">
        {/* Top utility alert bar */}
        <div className="bg-[#123C35] text-[#F7F5F0] text-[11px] font-medium py-1.5 px-4 text-center hidden sm:flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B89B5E]" />
              100% Genuine Electronics · Official Brand Warranty
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[#EDE4D2]/80">
              <Truck className="w-3.5 h-3.5 text-[#B89B5E]" />
              Free Insured Delivery on orders over ₹2,000
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#EDE4D2]/90">
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setSupportModalOpen(true)}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-[#B89B5E]" />
              Help & Support
            </button>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Button & Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#171A19] hover:text-[#123C35] hover:bg-[#F7F5F0] rounded-lg transition-colors cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="/"
              onClick={handleBrandClick}
              className="text-xl sm:text-2xl font-black tracking-[0.14em] text-[#171A19] hover:text-[#123C35] transition-colors"
            >
              NEXORA
            </a>
          </div>

          {/* Center-Left: Primary Commerce Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#4D524E]">
            {/* Shop (Opens Mega Menu) */}
            <div
              className="relative py-5"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setMegaMenuOpen(prev => !prev);
                }}
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:text-[#123C35] ${
                  megaMenuOpen || currentRoute === 'shop' ? 'text-[#123C35] font-extrabold' : ''
                }`}
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    megaMenuOpen ? 'rotate-180 text-[#123C35]' : 'text-[#666B67]'
                  }`}
                />
              </button>
            </div>

            {/* Deals */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                onNavigate('shop', undefined, { dealsOnly: true });
              }}
              className="hover:text-[#123C35] transition-colors cursor-pointer flex items-center gap-1 text-[#2F6B57] font-extrabold"
            >
              <span>Deals</span>
              <span className="text-[9px] bg-[#EDE4D2] text-[#123C35] px-1.5 py-0.2 rounded font-bold">
                Up to 34%
              </span>
            </button>

            {/* New Arrivals */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                onNavigate('shop', undefined, { newOnly: true });
              }}
              className="hover:text-[#123C35] transition-colors cursor-pointer"
            >
              New Arrivals
            </button>

            {/* Brands */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                onNavigate('shop');
              }}
              className="hover:text-[#123C35] transition-colors cursor-pointer"
            >
              Brands
            </button>

            {/* Gaming */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                onNavigate('shop', 'Gaming');
              }}
              className="hover:text-[#123C35] transition-colors cursor-pointer"
            >
              Gaming
            </button>

            {/* Support */}
            <button
              type="button"
              onClick={() => setSupportModalOpen(true)}
              className="hover:text-[#123C35] transition-colors cursor-pointer text-[#666B67]"
            >
              Support
            </button>
          </nav>

          {/* Center-Right: Prominent Retail Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, laptops, headphones, OLED, RTX..."
                className="w-full bg-[#F7F5F0] hover:bg-[#F2EEE6] focus:bg-[#FFFFFF] text-[#171A19] placeholder-[#5A625C] text-xs font-medium pl-10 pr-10 py-2.5 rounded-lg border border-[#E4E1DA] focus:border-[#123C35] focus:outline-none transition-all shadow-xs"
                aria-label="Search electronics products"
              />
              <Search className="w-4 h-4 text-[#5A625C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A625C] hover:text-[#171A19] p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right: Commerce Action Utilities */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(prev => !prev)}
              className="md:hidden p-2 text-[#4D524E] hover:text-[#171A19] hover:bg-[#F7F5F0] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                onNavigate('wishlist');
              }}
              className="relative p-2 text-[#4D524E] hover:text-[#171A19] hover:bg-[#F7F5F0] rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              aria-label={`View wishlist with ${wishlist.length} saved products`}
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#123C35] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Profile Action */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                onNavigate(isAuthenticated ? 'profile' : 'auth');
              }}
              className="p-1.5 text-[#4D524E] hover:text-[#171A19] hover:bg-[#F7F5F0] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label={isAuthenticated ? 'Account profile' : 'Sign in to account'}
              title={isAuthenticated ? 'My Account' : 'Sign In'}
            >
              {isAuthenticated && user ? (
                <div className="w-7 h-7 rounded-full bg-[#123C35] text-[#FFFFFF] font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 text-[#171A19] hover:text-[#123C35]">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </div>
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                openCart();
              }}
              className="relative py-1.5 px-3 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              aria-label={`Shopping cart with ${totalItemCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold tabular-nums">
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (Visible when toggled on mobile) */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#E4E1DA] bg-[#FFFFFF]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, laptops, audio..."
                className="w-full bg-[#F7F5F0] text-[#171A19] placeholder-[#5A625C] text-xs font-medium pl-9 pr-8 py-2.5 rounded-lg border border-[#E4E1DA] focus:border-[#123C35] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#5A625C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A625C]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Desktop Mega Menu Dropdown */}
        <div
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <MegaMenu
            isOpen={megaMenuOpen}
            onClose={() => setMegaMenuOpen(false)}
            onSelectCategory={(category) => {
              onNavigate('shop', category);
              setMegaMenuOpen(false);
            }}
            onSelectBrand={(brand) => {
              onNavigate('shop', undefined, { brand });
              setMegaMenuOpen(false);
            }}
            onNavigateDeals={() => {
              onNavigate('shop', undefined, { dealsOnly: true });
              setMegaMenuOpen(false);
            }}
          />
        </div>
      </header>

      {/* Customer Support Modal */}
      {supportModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#171A19]/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
        >
          <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSupportModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[#666B67] hover:text-[#171A19] hover:bg-[#F7F5F0] rounded-lg transition-colors cursor-pointer"
              aria-label="Close support dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-2.5 py-1 rounded-sm mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Nexora Customer Care</span>
              </div>
              <h2 id="support-modal-title" className="text-xl font-bold text-[#171A19]">
                Help & Shopping Assistance
              </h2>
              <p className="text-xs text-[#666B67] mt-1">
                We provide genuine electronics backed by official brand warranty and domestic technical support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#123C35]">
                  <Phone className="w-4 h-4 text-[#123C35]" />
                  <span>Toll-Free Helpline</span>
                </div>
                <p className="text-sm font-semibold text-[#171A19]">1800-120-NEXORA</p>
                <p className="text-[11px] text-[#666B67]">Mon–Sat: 9:00 AM – 8:00 PM IST</p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E4E1DA] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#123C35]">
                  <Mail className="w-4 h-4 text-[#123C35]" />
                  <span>Email Support</span>
                </div>
                <p className="text-sm font-semibold text-[#171A19]">support@nexora.design</p>
                <p className="text-[11px] text-[#666B67]">Guaranteed response within 4 hours</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#E4E1DA] text-xs text-[#4D524E]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#123C35] shrink-0 mt-0.5" />
                <span>
                  <strong>Official Warranty:</strong> All items include genuine manufacturer warranty serviceable across authorized service centers in India.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#123C35] shrink-0 mt-0.5" />
                <span>
                  <strong>7-Day Replacement:</strong> Instant replacement in case of dead-on-arrival or transit damage.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#123C35] shrink-0 mt-0.5" />
                <span>
                  <strong>Insured Express Transit:</strong> Every package is sealed in tamper-evident security bags and dispatched via air freight.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="w-full py-2.5 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer hover:bg-[#0D302A] transition-colors"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}

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

