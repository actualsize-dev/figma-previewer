'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  projectId: string;
  projectSlug: string;
}

export default function ViewTracker({ projectId, projectSlug }: ViewTrackerProps) {
  useEffect(() => {
    // Track the view
    const trackView = async () => {
      try {
        await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId,
            projectSlug,
          }),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [projectId, projectSlug]);

  // This component doesn't render anything
  return null;
}
