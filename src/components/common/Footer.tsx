import React from 'react';
import { ProductCategory } from '../../types';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string, category?: ProductCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#171A19] text-[#F7F5F0] pt-16 pb-12 border-t border-[#2A2F2D]">
      {/* Restrained Service Promise Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2A2F2D]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F7F5F0]">Express Courier</h5>
              <p className="text-xs text-[#A8AEA9] mt-1">Dispatched within 24 hours across India.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F7F5F0]">Secure Ordering</h5>
              <p className="text-xs text-[#A8AEA9] mt-1">Encrypted checkout with Cash on Delivery & UPI.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F7F5F0]">30-Day Returns</h5>
              <p className="text-xs text-[#A8AEA9] mt-1">Hassle-free doorstep pickup policy.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F7F5F0]">Authentic Gear</h5>
              <p className="text-xs text-[#A8AEA9] mt-1">2-year minimum hardware warranty on all devices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-xl font-bold tracking-[0.2em] text-[#FFFFFF] select-none">
              NEXORA
            </span>
            <p className="text-xs text-[#EDE4D2]/80 leading-relaxed max-w-sm">
              Modern products. Simple shopping. A luxury-minimalist catalog of everyday essentials, precision tools, and focused workstation gear.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#666B67]">
              <span>Currency:</span>
              <span className="text-[#F7F5F0] font-medium">INR (₹)</span>
              <span>·</span>
              <span>Prices inclusive of all taxes</span>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#B89B5E]">Collections</h5>
            <ul className="space-y-2 text-xs text-[#A8AEA9]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'Smartphones')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Smartphones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'Laptops')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Laptops
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'Headphones & Audio')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Headphones & Audio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'TVs & Monitors')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  TVs & Monitors
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'Gaming')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Gaming
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'PC Components')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  PC Components
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Orders */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#B89B5E]">Client Care</h5>
            <ul className="space-y-2 text-xs text-[#A8AEA9]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('orders')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Shopping Bag
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Saved Items
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Account Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Future Integration & Standards */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#B89B5E]">Architecture</h5>
            <div className="space-y-2 text-xs text-[#A8AEA9] leading-relaxed">
              <p>REST API Service layer ready for Express.js & PostgreSQL migration.</p>
              <p className="text-[11px] text-[#666B67]">
                Designed with zero-pill typographic discipline, WCAG AA accessibility, and deterministic commerce state.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-[#2A2F2D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666B67]">
          <p>© 2026 NEXORA Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
