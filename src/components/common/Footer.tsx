import React from 'react';
import { ProductCategory } from '../../types';
import { ShieldCheck, Truck, RotateCcw, Award, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (
    route: string,
    category?: ProductCategory,
    options?: { brand?: string; search?: string; dealsOnly?: boolean; newOnly?: boolean }
  ) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#171A19] text-[#F7F5F0] pt-14 pb-12 border-t border-[#2A2F2D] select-none">
      {/* Restrained Service Promise Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#2A2F2D]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7F5F0]">Express Courier</h5>
              <p className="text-xs text-[#A8AEA9] mt-1 leading-relaxed">Insured air dispatch within 24 hours across India.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7F5F0]">Secure Payments</h5>
              <p className="text-xs text-[#A8AEA9] mt-1 leading-relaxed">UPI, Cards, Net Banking & Cash on Delivery.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7F5F0]">7-Day Replacement</h5>
              <p className="text-xs text-[#A8AEA9] mt-1 leading-relaxed">Immediate replacement for transit or hardware defects.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#B89B5E] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7F5F0]">Official Warranty</h5>
              <p className="text-xs text-[#A8AEA9] mt-1 leading-relaxed">Authorized brand warranty on all electronics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-[0.16em] text-[#FFFFFF] block">
              NEXORA
            </span>
            <p className="text-xs text-[#EDE4D2]/80 leading-relaxed max-w-sm">
              Authentic electronics and consumer technology from the world's leading engineering brands. Apple, Samsung, Sony, Dell, ASUS, NVIDIA, and Bose.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-[#A8AEA9]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B89B5E]" />
                <span>1800-120-NEXORA (Toll-Free, 9 AM – 8 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B89B5E]" />
                <span>support@nexora.design</span>
              </div>
            </div>
          </div>

          {/* Shop Departments */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#B89B5E]">Shop Catalog</h5>
            <ul className="space-y-2 text-xs text-[#A8AEA9]">
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
                  Laptops & Ultrabooks
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
                  Gaming Gear
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
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', undefined, { dealsOnly: true })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-[#EDE4D2] font-semibold"
                >
                  Special Deals (Up to 34%)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Orders */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#B89B5E]">Customer Care</h5>
            <ul className="space-y-2 text-xs text-[#A8AEA9]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('orders')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Saved Wishlist
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

          {/* Payment & Security Trust */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#B89B5E]">Accepted Payments</h5>
            <div className="space-y-2 text-xs text-[#A8AEA9] leading-relaxed">
              <p>Supported payment options at checkout:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['UPI / QR', 'Google Pay', 'PhonePe', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'COD'].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-0.5 bg-[#252A28] border border-[#3A403D] rounded text-[11px] text-[#EDE4D2]"
                  >
                    {method}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#8C928D] pt-2">
                256-bit encrypted checkout with verified Indian banking gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Localization */}
        <div className="mt-12 pt-8 border-t border-[#2A2F2D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666B67]">
          <p>© 2026 NEXORA Electronics Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>GST Registered</span>
            <span>·</span>
            <span>Indian Retail Compliant</span>
            <span>·</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

