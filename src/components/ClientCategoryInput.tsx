'use client';

import { useState, useEffect } from 'react';

interface ClientCategoryInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ClientCategoryInput({ value, onChange }: ClientCategoryInputProps) {
  const [existingClients, setExistingClients] = useState<string[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [customValue, setCustomValue] = useState('');

  useEffect(() => {
    // Fetch existing client labels
    fetch('/api/projects/clients')
      .then(res => res.json())
      .then(data => {
        setExistingClients(data.clients || []);
      })
      .catch(err => console.error('Failed to fetch clients:', err));
  }, []);

  useEffect(() => {
    // Check if current value is a new one
    if (value && !existingClients.includes(value) && value !== 'create-new') {
      setIsCreatingNew(true);
      setCustomValue(value);
    }
  }, [value, existingClients]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'create-new') {
      setIsCreatingNew(true);
      setCustomValue('');
      onChange('');
    } else {
      setIsCreatingNew(false);
      setCustomValue('');
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (inputValue: string) => {
    setCustomValue(inputValue);
    onChange(inputValue);
  };

  if (existingClients.length === 0 || isCreatingNew) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={isCreatingNew ? customValue : value}
          onChange={(e) => isCreatingNew ? handleCustomInputChange(e.target.value) : onChange(e.target.value)}
          placeholder="e.g., Auto Innovators, Personal Project"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {existingClients.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setIsCreatingNew(false);
              setCustomValue('');
              onChange('');
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Use existing client
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={value || ''}
        onChange={(e) => handleSelectChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select existing client...</option>
        {existingClients.map(client => (
          <option key={client} value={client}>{client}</option>
        ))}
        <option value="create-new">+ Create new client</option>
      </select>
    </div>
  );
}