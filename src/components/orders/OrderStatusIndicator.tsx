import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, Truck, PackageCheck, CheckCircle2 } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Processing':
        return {
          icon: Clock,
          label: 'Processing',
          containerClass: 'bg-[#EDE4D2] text-[#6B531B] border border-[#B89B5E]/40',
          dotClass: 'bg-[#B89B5E] animate-pulse',
        };
      case 'Confirmed':
        return {
          icon: CheckCircle2,
          label: 'Confirmed',
          containerClass: 'bg-[#EBF3F0] text-[#123C35] border border-[#123C35]/20',
          dotClass: 'bg-[#123C35]',
        };
      case 'Shipped':
        return {
          icon: Truck,
          label: 'Shipped',
          containerClass: 'bg-[#E5EFEA] text-[#123C35] border border-[#123C35]/35 font-semibold',
          dotClass: 'bg-[#123C35] animate-pulse',
        };
      case 'Delivered':
        return {
          icon: PackageCheck,
          label: 'Delivered',
          containerClass: 'bg-[#123C35] text-[#FFFFFF] border border-[#123C35] shadow-xs',
          dotClass: 'bg-[#FFFFFF]',
        };
      default:
        return {
          icon: Clock,
          label: status,
          containerClass: 'bg-[#F7F5F0] text-[#171A19] border border-[#E4E1DA]',
          dotClass: 'bg-[#666B67]',
        };
    }
  };

  const { icon: Icon, label, containerClass, dotClass } = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide transition-colors ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      } ${containerClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

interface OrderStatusProgressProps {
  status: OrderStatus;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'Confirmed', label: 'Confirmed' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
];

export const OrderStatusProgress: React.FC<OrderStatusProgressProps> = ({ status }) => {
  const getStepIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'Confirmed':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentIdx = getStepIndex(status);

  return (
    <div className="w-full pt-1 pb-1">
      <div className="relative flex items-center justify-between">
        {/* Progress Background Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#E4E1DA] z-0" />

        {/* Progress Active Line */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#123C35] transition-all duration-500 z-0"
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Milestones */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-[#123C35] text-[#FFFFFF]'
                    : isCurrent
                    ? 'bg-[#FFFFFF] border-2 border-[#123C35] text-[#123C35]'
                    : 'bg-[#FFFFFF] border border-[#E4E1DA] text-[#666B67]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#123C35] animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8D4CA]" />
                )}
              </div>
              <span
                className={`text-[11px] mt-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'font-semibold text-[#123C35]'
                    : isCompleted
                    ? 'font-medium text-[#171A19]'
                    : 'text-[#666B67]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
