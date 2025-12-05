'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  slug: string;
}

export default function CopyLinkButton({ slug }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-outline w-full text-sm"
    >
      {copied ? '✓ Copied!' : 'Copy Share Link'}
    </button>
  );
}