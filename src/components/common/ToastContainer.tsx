import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'text-[#123C35]';
        let borderColor = 'border-[#E4E1DA]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-[#A94747]';
          borderColor = 'border-[#F1D0D0]';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-[#B89B5E]';
          borderColor = 'border-[#E4E1DA]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#FFFFFF] ${borderColor} border shadow-lg rounded-xl p-4 flex items-start gap-3 transition-all duration-200 transform translate-y-0`}
            role="status"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#171A19] leading-tight truncate">
                {toast.message}
              </p>
              {toast.subtext && (
                <p className="text-xs text-[#666B67] mt-0.5 line-clamp-2">
                  {toast.subtext}
                </p>
              )}
              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-xs font-semibold text-[#123C35] hover:text-[#0D302A] underline cursor-pointer"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#666B67] hover:text-[#171A19] p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
