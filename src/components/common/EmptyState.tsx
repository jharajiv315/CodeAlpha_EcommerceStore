import React from 'react';
import { LucideIcon, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-[#EDE4D2]/60 flex items-center justify-center text-[#123C35] mb-5">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-semibold text-[#171A19] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#666B67] leading-relaxed mb-6">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold tracking-wide uppercase rounded-lg transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        )}
        {secondaryLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-[#E4E1DA] hover:border-[#171A19] text-[#171A19] text-xs font-medium tracking-wide rounded-lg transition-colors cursor-pointer"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
};
