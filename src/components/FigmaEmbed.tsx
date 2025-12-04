'use client';

import { useState, useEffect } from 'react';

interface FigmaEmbedProps {
  url: string;
  title: string;
}

export default function FigmaEmbed({ url, title }: FigmaEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Convert Figma prototype URL to embed format
  const getEmbedUrl = (figmaUrl: string): string => {
    try {
      // Handle different Figma URL formats
      if (figmaUrl.includes('figma.com/proto/')) {
        // Already a prototype URL, add embed parameters
        const url = new URL(figmaUrl);
        url.searchParams.set('embed-host', 'actualsize.digital');
        url.searchParams.set('embed-origin', 'actualsize.digital');
        url.searchParams.set('hide-ui', '1');
        return url.toString();
      }
      
      if (figmaUrl.includes('figma.com/file/')) {
        // Convert file URL to proto URL
        const fileId = figmaUrl.split('/file/')[1].split('/')[0];
        return `https://www.figma.com/embed?embed_host=actualsize.digital&url=https://www.figma.com/file/${fileId}`;
      }
      
      // Fallback: try to use as-is
      return figmaUrl;
    } catch (error) {
      console.error('Error processing Figma URL:', error);
      return figmaUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  useEffect(() => {
    // Set a timeout to show error if iframe doesn't load
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Prototype
          </h1>
          <p className="text-gray-600 mb-6">
            The Figma prototype couldn't be loaded. This might be due to:
          </p>
          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>• The prototype isn't publicly accessible</li>
            <li>• The URL format isn't supported</li>
            <li>• Network connectivity issues</li>
          </ul>
          <div className="space-y-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Open in Figma
            </a>
            <a
              href="/"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Create New Project
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading {title}...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        className="border-0"
        title={title}
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}