import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastNotification } from '../types';

interface ToastContextType {
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'error', subtext?: string, actionLabel?: string, onAction?: () => void) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((
    message: string,
    type: 'success' | 'info' | 'error' = 'success',
    subtext?: string,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = {
      id,
      message,
      subtext,
      type,
      actionLabel,
      onAction,
    };

    setToasts(prev => [...prev.slice(-3), newToast]); // Limit to 4 visible toasts

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
