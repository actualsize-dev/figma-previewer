'use client';

import { useState } from 'react';

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
  onDelete: (id: string) => void;
  className?: string;
  compact?: boolean;
}

export default function DeleteProjectButton({
  projectId,
  projectName,
  onDelete,
  className = '',
  compact = false
}: DeleteProjectButtonProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (clickCount === 0) {
      setClickCount(1);
      // Reset after 3 seconds if no second click
      setTimeout(() => setClickCount(0), 3000);
    } else if (clickCount === 1) {
      setIsDeleting(true);

      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        onDelete(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
        setIsDeleting(false);
        setClickCount(0);
      }
    }
  };

  const getButtonText = (compact = false) => {
    if (isDeleting) return 'Deleting...';
    if (clickCount === 1) return compact ? 'Confirm' : 'Confirm Delete';
    return compact ? 'Delete' : 'Delete Project';
  };

  const getButtonClass = () => {
    const base = `btn ${className || 'w-full text-sm'}`;
    if (isDeleting) return `${base} opacity-60 cursor-not-allowed`;
    if (clickCount === 1) return `${base} bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700`;
    return `${base} btn-destructive`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className={getButtonClass()}
    >
      {getButtonText(compact)}
    </button>
  );
}