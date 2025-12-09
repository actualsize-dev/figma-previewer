'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type DeletedProject = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  deletedAt: string;
};

interface SelectiveRestoreModalProps {
  clientLabel: string;
  onClose: () => void;
  onRestoreComplete: () => void;
}

export default function SelectiveRestoreModal({ clientLabel, onClose, onRestoreComplete }: SelectiveRestoreModalProps) {
  const [projects, setProjects] = useState<DeletedProject[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [clientLabel]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(clientLabel)}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      setProjects(data);
      // Select all by default
      setSelectedProjects(new Set(data.map((p: DeletedProject) => p.id)));
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects. Please try again.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    }
  };

  const handleRestore = async () => {
    if (selectedProjects.size === 0) {
      alert('Please select at least one project to restore.');
      return;
    }

    setRestoring(true);

    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(clientLabel)}/restore-selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectIds: Array.from(selectedProjects)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to restore projects');
      }

      const result = await response.json();
      alert(`Successfully restored ${result.restoredCount} project${result.restoredCount !== 1 ? 's' : ''}!`);
      onRestoreComplete();
    } catch (error) {
      console.error('Error restoring projects:', error);
      alert('Failed to restore projects. Please try again.');
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Restore Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select projects from "{clientLabel}" to restore
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No deleted projects found for this client.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All */}
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedProjects.size === projects.length}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">
                    Select All ({projects.length} project{projects.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </label>

              {/* Project List */}
              {projects.map((project) => (
                <label
                  key={project.id}
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-pointer hover:border-foreground/20 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.has(project.id)}
                    onChange={() => toggleProject(project.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      <span>Deleted {new Date(project.deletedAt).toLocaleDateString()}</span>
                      <span className="font-mono truncate">actualsize.digital/{project.slug}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {selectedProjects.size} of {projects.length} selected
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={restoring}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleRestore}
              disabled={restoring || selectedProjects.size === 0}
              className="btn btn-primary"
            >
              {restoring ? 'Restoring...' : `Restore ${selectedProjects.size} Project${selectedProjects.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
