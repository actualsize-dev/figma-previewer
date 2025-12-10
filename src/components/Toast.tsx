'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  linkText?: string;
  linkHref?: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, linkText, linkHref, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-900 border-l-4 border-red-500 px-6 py-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-white text-sm font-medium">{message}</span>
            {linkText && linkHref && (
              <Link
                href={linkHref}
                className="text-white underline hover:text-red-100 transition-colors text-sm font-medium whitespace-nowrap"
              >
                {linkText}
              </Link>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-100 transition-colors ml-4"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
