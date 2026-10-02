import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHomeIcon = true,
  className = '',
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-[#666B67] py-2 overflow-x-auto whitespace-nowrap scrollbar-none ${className}`}
    >
      <ol
        className="flex items-center gap-1.5 sm:gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isHome = isFirst && (item.label.toLowerCase() === 'home' || item.label.toLowerCase() === 'store');

          return (
            <li
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 shrink-0"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(index + 1)} />

              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  itemProp="item"
                  title={`Navigate to ${item.label}`}
                  className="flex items-center gap-1 text-[#666B67] hover:text-[#123C35] font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#123C35] rounded-xs cursor-pointer py-0.5"
                >
                  {isHome && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 text-[#123C35] shrink-0" aria-hidden="true" />
                  )}
                  <span itemProp="name">{item.label}</span>
                </button>
              ) : (
                <span
                  itemProp="name"
                  aria-current={isLast ? 'page' : undefined}
                  title={item.label}
                  className={`max-w-[180px] sm:max-w-[320px] md:max-w-none truncate py-0.5 ${
                    isLast
                      ? 'font-semibold text-[#171A19]'
                      : 'text-[#666B67]'
                  }`}
                >
                  {isHome && showHomeIcon && (
                    <Home className="inline w-3.5 h-3.5 mr-1 text-[#123C35] align-sub" aria-hidden="true" />
                  )}
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-[#E4E1DA] shrink-0 select-none"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
