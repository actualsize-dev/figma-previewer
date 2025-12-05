'use client';

import { useState, useEffect } from 'react';
import { extractFigmaFileId } from '@/lib/figma';

interface FigmaThumbnailProps {
  figmaUrl: string;
  alt?: string;
  className?: string;
}

export default function FigmaThumbnail({ 
  figmaUrl, 
  alt = 'Figma design preview', 
  className = '' 
}: FigmaThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        setLoading(true);
        setError(false);

        // Validate URL format first
        const fileId = extractFigmaFileId(figmaUrl);
        if (!fileId) {
          setError(true);
          setLoading(false);
          return;
        }

        const response = await fetch('/api/figma/thumbnail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ figmaUrl }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.thumbnail?.url) {
            setThumbnailUrl(data.thumbnail.url);
          } else {
            setError(true);
          }
        } else {
          const errorData = await response.text();
          console.warn('Thumbnail generation failed:', response.status, errorData);
          setError(true);
        }
      } catch (err) {
        console.error('Error generating thumbnail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (figmaUrl) {
      generateThumbnail();
    }
  }, [figmaUrl]);

  if (loading) {
    return (
      <div className={`bg-muted rounded animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground text-sm">
          <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !thumbnailUrl) {
    return (
      <div className={`bg-muted rounded flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground p-4">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="text-xs">
            Figma Preview
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded bg-muted overflow-hidden ${className}`}>
      <img
        src={thumbnailUrl}
        alt={alt}
        className="w-full h-auto"
        loading="lazy"
        onError={() => setError(true)}
        style={{ 
          minHeight: '100%',
          objectFit: 'cover',
          objectPosition: 'top center'
        }}
      />
    </div>
  );
}