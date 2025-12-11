'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Toast from '@/components/Toast';

interface ToastOptions {
  message: string;
  linkText?: string;
  linkHref?: string;
  duration?: number;
  variant?: 'delete' | 'restore';
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const pathname = usePathname();

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Hide toast when navigating to a new page
  useEffect(() => {
    hideToast();
  }, [pathname, hideToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          linkText={toast.linkText}
          linkHref={toast.linkHref}
          onClose={hideToast}
          duration={toast.duration}
          variant={toast.variant}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
