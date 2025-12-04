'use client';

import { useState } from 'react';

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
  onDelete: (id: string) => void;
}

export default function DeleteProjectButton({ 
  projectId, 
  projectName, 
  onDelete 
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

  const getButtonText = () => {
    if (isDeleting) return 'Deleting...';
    if (clickCount === 1) return 'Confirm Delete';
    return 'Delete Project';
  };

  const getButtonClass = () => {
    if (isDeleting) return "block w-full text-center py-2 px-4 bg-red-200 text-red-800 rounded-md text-sm cursor-not-allowed";
    if (clickCount === 1) return "block w-full text-center py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm";
    return "block w-full text-center py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm";
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className={getButtonClass()}
    >
      {getButtonText()}
    </button>
  );
}