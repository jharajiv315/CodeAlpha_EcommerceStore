import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProductCategory } from '../../types';
import { DEPARTMENTS, TOP_BRANDS } from '../../config/navigation';
import {
  X,
  ShoppingBag,
  Heart,
  Package,
  LogOut,
  LogIn,
  ChevronRight,
  ChevronDown,
  Tag,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (
    route: string,
    category?: ProductCategory,
    options?: { brand?: string; search?: string; dealsOnly?: boolean; newOnly?: boolean }
  ) => void;
  currentRoute: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentRoute,
}) => {
  const { user, isAuthenticated, logout, wishlist } = useAuth();
  const [expandedDept, setExpandedDept] = useState<string | null>(DEPARTMENTS[0].name);

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

  const handleNav = (
    route: string,
    category?: ProductCategory,
    options?: { brand?: string; search?: string; dealsOnly?: boolean; newOnly?: boolean }
  ) => {
    onNavigate(route, category, options);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171A19]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm bg-[#FFFFFF] shadow-2xl flex flex-col justify-between">
          {/* Top Brand Header */}
          <div className="p-5 border-b border-[#E4E1DA] flex items-center justify-between">
            <span className="text-xl font-black tracking-tight text-[#171A19]">
              NEXORA
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#666B67] hover:text-[#171A19] rounded-lg transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Primary Action Links */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNav('shop', undefined, { dealsOnly: true })}
                className="w-full flex items-center justify-between py-2 px-3 bg-[#EDE4D2]/60 hover:bg-[#EDE4D2] text-[#123C35] font-bold text-sm rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#123C35]" />
                  <span>Today's Electronics Deals</span>
                </div>
                <span className="text-[10px] font-bold bg-[#123C35] text-[#FFFFFF] px-2 py-0.5 rounded-full">
                  Up to 34% Off
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('shop', undefined, { newOnly: true })}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#F7F5F0] text-[#171A19] font-semibold text-sm rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#B89B5E]" />
                  <span>New Arrivals 2026</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('shop')}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors cursor-pointer ${
                  currentRoute === 'shop'
                    ? 'bg-[#123C35] text-[#FFFFFF] font-bold'
                    : 'text-[#171A19] hover:bg-[#F7F5F0] font-semibold'
                }`}
              >
                <span>View All 108 Products</span>
                <ChevronRight className={`w-4 h-4 ${currentRoute === 'shop' ? 'text-[#FFFFFF]' : 'text-[#666B67]/50'}`} />
              </button>
            </div>

            {/* Department Accordions */}
            <div className="pt-2 border-t border-[#E4E1DA]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#666B67] mb-3 px-1">
                Shop By Department
              </p>

              <div className="space-y-2">
                {DEPARTMENTS.map((dept) => {
                  const isExpanded = expandedDept === dept.name;
                  return (
                    <div key={dept.name} className="border border-[#E4E1DA] rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedDept(isExpanded ? null : dept.name)}
                        className="w-full flex items-center justify-between p-3 bg-[#F7F5F0] hover:bg-[#F2EEE6] text-left text-xs font-bold text-[#171A19] cursor-pointer"
                      >
                        <span>{dept.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#666B67] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#123C35]' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-3 bg-[#FFFFFF] space-y-1 divide-y divide-[#E4E1DA]/40">
                          {dept.categories.map((cat) => (
                            <button
                              key={cat.label}
                              type="button"
                              onClick={() => handleNav('shop', cat.category)}
                              className="w-full text-left py-2 px-2 text-xs font-medium text-[#4D524E] hover:text-[#123C35] hover:bg-[#F7F5F0] rounded transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <span>{cat.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#5A625C]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Brands Shortcuts */}
            <div className="pt-2 border-t border-[#E4E1DA]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#666B67] mb-2 px-1">
                Popular Brands
              </p>
              <div className="flex flex-wrap gap-1.5 px-1">
                {TOP_BRANDS.slice(0, 7).map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleNav('shop', undefined, { brand: b.name })}
                    className="text-xs font-medium px-2.5 py-1 bg-[#F7F5F0] hover:bg-[#EDE4D2] hover:text-[#123C35] text-[#171A19] rounded-md border border-[#E4E1DA] transition-colors cursor-pointer"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Commerce Shortcuts */}
            <div className="pt-2 border-t border-[#E4E1DA] space-y-1">
              <button
                type="button"
                onClick={() => handleNav('wishlist')}
                className="w-full flex items-center justify-between py-2 px-2 text-sm font-medium text-[#171A19] hover:bg-[#F7F5F0] rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#666B67]" />
                  <span>My Wishlist</span>
                </div>
                {wishlist.length > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-[#123C35] text-[#FFFFFF] rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNav('orders')}
                className="w-full flex items-center justify-between py-2 px-2 text-sm font-medium text-[#171A19] hover:bg-[#F7F5F0] rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#666B67]" />
                  <span>Order Tracking & History</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('cart')}
                className="w-full flex items-center justify-between py-2 px-2 text-sm font-medium text-[#171A19] hover:bg-[#F7F5F0] rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#666B67]" />
                  <span>Shopping Cart</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666B67]/50" />
              </button>
            </div>

            {/* Trust note */}
            <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E4E1DA] text-[11px] text-[#666B67] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#123C35] shrink-0" />
              <span>Official Indian Retail Warranty & 7-Day Replacement Policy</span>
            </div>
          </div>

          {/* User Account Section at Bottom */}
          <div className="p-5 border-t border-[#E4E1DA] bg-[#F7F5F0]">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#123C35] text-[#FFFFFF] flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#171A19] truncate">{user.name}</p>
                    <p className="text-xs text-[#666B67] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNav('profile')}
                    className="flex-1 py-2 px-3 bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg text-xs font-semibold text-[#171A19] text-center cursor-pointer hover:bg-[#F2EEE6]"
                  >
                    View Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="p-2 text-[#666B67] hover:text-[#A94747] hover:bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg cursor-pointer"
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
                  className="w-full py-2.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

