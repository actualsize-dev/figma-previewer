'use client';

import { useState } from 'react';

interface EditableClientLabelProps {
  projectId: string;
  currentLabel: string;
  onLabelUpdate: (newLabel: string) => void;
}

export default function EditableClientLabel({ 
  projectId, 
  currentLabel, 
  onLabelUpdate 
}: EditableClientLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentLabel);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (editValue.trim() === currentLabel) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/label`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientLabel: editValue.trim() || 'Uncategorized' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update label');
      }

      const updatedLabel = editValue.trim() || 'Uncategorized';
      onLabelUpdate(updatedLabel);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating label:', error);
      alert('Failed to update label. Please try again.');
      setEditValue(currentLabel); // Reset on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditValue(currentLabel);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          className="text-xs px-2 py-1 border border-blue-300 rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Client name..."
          disabled={isUpdating}
          autoFocus
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
      title="Click to edit client label"
    >
      {currentLabel}
    </button>
  );
}