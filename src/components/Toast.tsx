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

export default function Toast({ message, linkText, linkHref, onClose, duration = 5000, variant = 'delete' }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = variant === 'restore'
    ? { bg: '#0A2818', text: '#10B981', border: '#165438' }
    : { bg: '#2D0A0A', text: '#EF4444', border: '#5A1414' };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 animate-in slide-in-from-top duration-300">
      <div
        className="px-6 py-4 shadow-lg flex items-center justify-center gap-4"
        style={{
          backgroundColor: colors.bg,
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <span className="text-sm font-medium" style={{ color: colors.text }}>{message}</span>
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
          className="text-white hover:opacity-80 transition-opacity ml-2"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
