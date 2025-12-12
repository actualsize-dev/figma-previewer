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
  variant?: 'delete' | 'restore';
}

export default function Toast({ message, linkText, linkHref, onClose, duration, variant = 'delete' }: ToastProps) {
  useEffect(() => {
    // Only auto-dismiss if duration is specified
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const colors = variant === 'restore'
    ? { bg: '#0A2818', text: '#10B981', border: '#165438' }
    : { bg: '#2D0A0A', text: '#EF4444', border: '#5A1414' };

  return (
    <div className="fixed top-32 sm:top-16 left-0 right-0 z-40 animate-in slide-in-from-top duration-300">
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 shadow-lg"
        style={{
          backgroundColor: colors.bg,
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span className="text-sm font-medium text-center sm:text-left" style={{ color: colors.text }}>{message}</span>
          {linkText && linkHref && (
            <Link
              href={linkHref}
              className="text-white underline hover:opacity-80 transition-opacity text-sm font-medium whitespace-nowrap"
            >
              {linkText}
            </Link>
          )}
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
