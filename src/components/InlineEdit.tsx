'use client';

import { useState, useRef, useEffect } from 'react';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  multiline?: boolean;
}

export default function InlineEdit({
  value,
  onSave,
  className = "",
  inputClassName = "",
  placeholder = "Enter value...",
  multiline = false
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = async () => {
    const trimmedValue = editValue.trim();

    // Allow empty values for multiline (descriptions can be removed)
    if (trimmedValue === value) {
      setIsEditing(false);
      return;
    }

    // For single-line inputs, don't save if empty
    if (!multiline && !trimmedValue) {
      setIsEditing(false);
      setEditValue(value);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(trimmedValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value); // Reset on error
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-start space-x-2">
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            disabled={isLoading}
            rows={3}
            className={`border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full resize-y ${inputClassName}`}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            disabled={isLoading}
            className={`border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
          />
        )}
        {isLoading && (
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mt-1"></div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`text-left hover:bg-gray-100 rounded px-1 py-1 transition-colors group block ${className}`}
      title="Click to edit"
    >
      {value ? (
        <span className="group-hover:text-blue-600">
          {value}
          <svg className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </span>
      ) : (
        <span className="text-muted-foreground italic group-hover:text-blue-600">{placeholder}</span>
      )}
    </button>
  );
}