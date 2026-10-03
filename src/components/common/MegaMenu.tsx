import React, { useRef, useEffect } from 'react';
import { DEPARTMENTS, TOP_BRANDS, QUICK_PROMOTIONS } from '../../config/navigation';
import { ProductCategory } from '../../types';
import { ArrowRight, ChevronRight, Tag, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category?: ProductCategory) => void;
  onSelectBrand?: (brand: string) => void;
  onNavigateDeals: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectBrand,
  onNavigateDeals,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="region"
      aria-label="Shop Departments Mega Menu"
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#E4E1DA] shadow-xl z-50 transition-opacity duration-150"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Department Columns: 4 Groups spanning 9 columns */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pr-4 border-r border-[#E4E1DA]/60">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="space-y-3">
                <div className="pb-2 border-b border-[#E4E1DA]/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171A19]">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-[#666B67] line-clamp-1 mt-0.5 font-normal">
                    {dept.description}
                  </p>
                </div>

                <ul className="space-y-1.5 pt-1">
                  {dept.categories.map((cat) => (
                    <li key={cat.label}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.category);
                          onClose();
                        }}
                        className="w-full text-left py-1 text-sm text-[#4D524E] hover:text-[#123C35] hover:translate-x-1 transition-all duration-150 flex items-center justify-between group cursor-pointer"
                      >
                        <span className="group-hover:font-medium">{cat.label}</span>
                        {cat.popular && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#123C35] bg-[#EDE4D2] px-1.5 py-0.2 rounded text-right">
                            Popular
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Bottom Bar within Department grid: Quick Brands */}
            <div className="sm:col-span-2 md:col-span-4 pt-4 mt-2 border-t border-[#E4E1DA]/60 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#666B67] text-[11px]">
                Top Brands:
              </span>
              {TOP_BRANDS.slice(0, 8).map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => {
                    if (onSelectBrand) onSelectBrand(b.name);
                    else onSelectCategory();
                    onClose();
                  }}
                  className="text-[#171A19] hover:text-[#123C35] hover:underline underline-offset-4 cursor-pointer font-medium"
                >
                  {b.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory();
                  onClose();
                }}
                className="text-xs font-semibold text-[#123C35] hover:underline underline-offset-4 flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>View All 108 Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Merchandising Column (3 columns) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 bg-[#F7F5F0] border border-[#E4E1DA] rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123C35]">
                <Tag className="w-3.5 h-3.5 text-[#123C35]" />
                <span>Special Promotion</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#171A19]">
                  {QUICK_PROMOTIONS[1].title}
                </h4>
                <p className="text-xs text-[#666B67] mt-1 leading-relaxed">
                  {QUICK_PROMOTIONS[1].subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigateDeals();
                  onClose();
                }}
                className="w-full py-2 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse Deals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#B89B5E]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026 Collection</span>
              </div>
              <p className="text-xs text-[#171A19] font-medium leading-snug">
                Official Indian Retail Warranty on all Apple, Sony, Samsung & ASUS hardware.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
