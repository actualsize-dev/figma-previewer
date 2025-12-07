'use client';

import { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface NewClientCardProps {
  onProjectAdded: () => void;
}

export default function NewClientCard({ onProjectAdded }: NewClientCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [clientLabel, setClientLabel] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateClient = () => {
    setIsCreating(true);
  };

  const handleClientNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientLabel.trim()) {
      setIsCreating(false);
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setClientLabel('');
  };

  const handleProjectAdded = () => {
    setClientLabel('');
    onProjectAdded();
  };

  if (isCreating) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 transition-all">
        <form onSubmit={handleClientNameSubmit} className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-foreground mb-2">
              New Client Name
            </label>
            <input
              type="text"
              id="clientName"
              value={clientLabel}
              onChange={(e) => setClientLabel(e.target.value)}
              placeholder="e.g., Acme Corporation"
              autoFocus
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 btn btn-outline text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary text-sm"
            >
              Next: Add Project
            </button>
          </div>
        </form>

        <AddProjectModal
          clientLabel={clientLabel}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setClientLabel('');
          }}
          onProjectAdded={handleProjectAdded}
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleCreateClient}
      className="bg-card border border-dashed border-border hover:border-foreground/20 rounded-lg p-6 transition-all hover:shadow-sm flex flex-col items-center justify-center min-h-[200px] group"
    >
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3 group-hover:bg-muted/80 transition-colors">
        <FolderPlus className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">New Client</h3>
      <p className="text-sm text-muted-foreground">Create a new client and add projects</p>
    </button>
  );
}
