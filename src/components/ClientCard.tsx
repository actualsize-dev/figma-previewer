'use client';

import { useState } from 'react';
import Link from 'next/link';
import InlineEdit from './InlineEdit';
import ShareLinksManager from './ShareLinksManager';
import AddProjectModal from './AddProjectModal';
import { Folder, ExternalLink, Plus } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

type Client = {
  label: string;
  projectCount: number;
  description?: string | null;
};

interface ClientCardProps {
  client: Client;
  onClientUpdated?: (oldLabel: string, newLabel: string) => void;
  onProjectAdded?: () => void;
  onDescriptionUpdated?: (clientLabel: string, description: string | null) => void;
  compact?: boolean;
}

export default function ClientCard({ client, onClientUpdated, onProjectAdded, onDescriptionUpdated, compact = false }: ClientCardProps) {
  const [currentLabel, setCurrentLabel] = useState(client.label);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const { showToast } = useToast();

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

        showToast({
          message: `Client "${currentLabel}" and its ${client.projectCount} project${client.projectCount !== 1 ? 's have' : ' has'} been deleted.`,
          linkText: 'View deleted projects',
          linkHref: '/projects/deleted',
          duration: 6000
        });

        // Refresh the page to show updated client list
        setTimeout(() => {
          window.location.reload();
        }, 500);
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

  const handleDescriptionUpdate = async (newDescription: string) => {
    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(currentLabel)}/description`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newDescription || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update description');
      }

      if (onDescriptionUpdated) {
        onDescriptionUpdated(currentLabel, newDescription || null);
      }
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description. Please try again.');
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
            {showDescriptionInput ? (
              <div className="mt-2">
                <InlineEdit
                  value={client.description || ''}
                  onSave={async (newValue) => {
                    await handleDescriptionUpdate(newValue);
                    setShowDescriptionInput(false);
                  }}
                  className="text-xs text-muted-foreground"
                  inputClassName="text-xs"
                  placeholder="Add description..."
                  multiline
                />
              </div>
            ) : client.description ? (
              <div className="mt-2">
                <div className={`text-xs text-muted-foreground whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-1' : ''}`}>
                  {client.description}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-xs text-primary hover:underline"
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                  <button
                    onClick={() => setShowDescriptionInput(true)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDescriptionInput(true)}
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
              >
                + Add description
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsAddProjectModalOpen(true)}
              className="btn btn-primary text-xs px-2 sm:px-3 py-1 whitespace-nowrap text-center w-full sm:w-auto"
            >
              Add Project
            </button>
            <Link
              href={`/projects?client=${encodeURIComponent(currentLabel)}`}
              className="btn btn-outline text-xs px-2 sm:px-3 py-1 whitespace-nowrap text-center w-full sm:w-auto"
            >
              View Projects
            </Link>
            <ShareLinksManager clientLabel={currentLabel} compact />
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`btn text-xs px-2 sm:px-3 py-1 whitespace-nowrap text-center w-full sm:w-auto ${
                isDeleting
                  ? 'opacity-60 cursor-not-allowed'
                  : clickCount === 1
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700'
                  : 'btn-destructive'
              }`}
            >
              {isDeleting ? 'Deleting Client...' : clickCount === 1 ? 'Confirm Delete Client' : 'Delete Client'}
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
          <div className="mt-3 ml-13">
            {showDescriptionInput ? (
              <InlineEdit
                value={client.description || ''}
                onSave={async (newValue) => {
                  await handleDescriptionUpdate(newValue);
                  setShowDescriptionInput(false);
                }}
                className="text-sm text-muted-foreground"
                inputClassName="text-sm"
                placeholder="Add description..."
                multiline
              />
            ) : client.description ? (
              <div>
                <div className={`text-sm text-muted-foreground whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                  {client.description}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-sm text-primary hover:underline"
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                  <button
                    onClick={() => setShowDescriptionInput(true)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDescriptionInput(true)}
                className="text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded px-3 py-2 w-full text-left transition-colors hover:border-foreground/50"
              >
                + Click to add description
              </button>
            )}
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
