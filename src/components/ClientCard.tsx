'use client';

import { useState } from 'react';
import Link from 'next/link';
import InlineEdit from './InlineEdit';
import ShareLinksManager from './ShareLinksManager';
import AddProjectModal from './AddProjectModal';
import { Folder, ExternalLink, Plus } from 'lucide-react';

type Client = {
  label: string;
  projectCount: number;
};

interface ClientCardProps {
  client: Client;
  onClientUpdated?: (oldLabel: string, newLabel: string) => void;
  onProjectAdded?: () => void;
  compact?: boolean;
}

export default function ClientCard({ client, onClientUpdated, onProjectAdded, compact = false }: ClientCardProps) {
  const [currentLabel, setCurrentLabel] = useState(client.label);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (clickCount === 0) {
      setClickCount(1);
      setTimeout(() => setClickCount(0), 3000);
    } else if (clickCount === 1) {
      setIsDeleting(true);

      try {
        const response = await fetch(`/api/clients/${encodeURIComponent(currentLabel)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete client');
        }

        // Refresh the page to show updated client list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client. Please try again.');
        setIsDeleting(false);
        setClickCount(0);
      }
    }
  };

  const handleLabelUpdate = async (newLabel: string) => {
    try {
      const response = await fetch('/api/projects/clients/rename', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldClientLabel: currentLabel,
          newClientLabel: newLabel,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rename client');
      }

      setCurrentLabel(newLabel);

      if (onClientUpdated) {
        onClientUpdated(currentLabel, newLabel);
      }
    } catch (error) {
      console.error('Error renaming client:', error);
      alert(error instanceof Error ? error.message : 'Failed to rename client');
      throw error;
    }
  };

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg px-4 py-3 transition-all hover:shadow-sm hover:border-foreground/20 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <InlineEdit
                value={currentLabel}
                onSave={handleLabelUpdate}
                className="text-sm font-semibold text-foreground truncate"
                inputClassName="text-sm font-semibold"
                placeholder="Client name..."
              />
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded whitespace-nowrap">
                {client.projectCount} {client.projectCount === 1 ? 'project' : 'projects'}
              </span>
            </div>
          </div>
          <div className="flex sm:items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto min-w-0">
            <button
              onClick={() => setIsAddProjectModalOpen(true)}
              className="btn btn-primary text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
            >
              Add Project
            </button>
            <Link
              href={`/projects?client=${encodeURIComponent(currentLabel)}`}
              className="btn btn-outline text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
            >
              View Projects
            </Link>
            <ShareLinksManager clientLabel={currentLabel} compact />
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`btn text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0 ${
                isDeleting
                  ? 'opacity-60 cursor-not-allowed'
                  : clickCount === 1
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700'
                  : 'btn-destructive'
              }`}
            >
              {isDeleting ? 'Deleting...' : clickCount === 1 ? 'Confirm' : 'Delete'}
            </button>
          </div>
        </div>
        <AddProjectModal
          clientLabel={currentLabel}
          isOpen={isAddProjectModalOpen}
          onClose={() => setIsAddProjectModalOpen(false)}
          onProjectAdded={() => {
            if (onProjectAdded) {
              onProjectAdded();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-muted-foreground" />
            </div>
            <InlineEdit
              value={currentLabel}
              onSave={handleLabelUpdate}
              className="text-lg font-semibold text-foreground"
              inputClassName="text-lg font-semibold"
              placeholder="Client name..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">Projects</span>
          <span className="text-sm font-medium text-foreground">{client.projectCount}</span>
        </div>

        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="btn btn-primary w-full text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>

        <Link
          href={`/projects?client=${encodeURIComponent(currentLabel)}`}
          className="btn btn-outline w-full text-sm flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Projects
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`btn w-full text-sm flex items-center justify-center gap-2 ${
            isDeleting
              ? 'opacity-60 cursor-not-allowed'
              : clickCount === 1
              ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700'
              : 'btn-destructive'
          }`}
        >
          {isDeleting ? 'Deleting Client...' : clickCount === 1 ? 'Confirm Delete Client' : 'Delete Client'}
        </button>

        <div className="pt-2 border-t border-border">
          <ShareLinksManager clientLabel={currentLabel} />
        </div>
      </div>

      <AddProjectModal
        clientLabel={currentLabel}
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onProjectAdded={() => {
          if (onProjectAdded) {
            onProjectAdded();
          }
        }}
      />
    </div>
  );
}
