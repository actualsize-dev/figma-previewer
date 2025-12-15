'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { useToast } from '@/contexts/ToastContext';
import { Checkbox } from '@/components/ui/checkbox';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectListProps {
  initialProjects: Project[];
  viewMode?: 'grid' | 'list';
}

export default function ProjectList({ initialProjects, viewMode = 'grid' }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  // Update projects when initialProjects changes
  useEffect(() => {
    setProjects(initialProjects);
    // Clear selection when projects change
    setSelectedProjects(new Set());
  }, [initialProjects]);

  const handleProjectDeleted = (deletedId: string) => {
    setProjects(prevProjects =>
      prevProjects.filter(project => project.id !== deletedId)
    );
    // Remove from selection
    setSelectedProjects(prev => {
      const newSet = new Set(prev);
      newSet.delete(deletedId);
      return newSet;
    });
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const toggleProjectSelection = (projectId: string) => {
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

  const toggleSelectAll = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;

    const count = selectedProjects.size;
    const confirmMessage = `Are you sure you want to delete ${count} project${count !== 1 ? 's' : ''}? ${count === 1 ? 'This project' : 'These projects'} will be moved to the deleted section.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      const deletePromises = Array.from(selectedProjects).map(projectId =>
        fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(r => !r.ok);

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} project(s)`);
      }

      // Remove deleted projects from state
      setProjects(prevProjects =>
        prevProjects.filter(project => !selectedProjects.has(project.id))
      );

      setSelectedProjects(new Set());

      showToast({
        message: `${count} project${count !== 1 ? 's have' : ' has'} been deleted.`,
        linkText: 'View deleted projects',
        linkHref: '/projects/deleted'
      });
    } catch (error) {
      console.error('Error deleting projects:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete projects. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const showBulkActions = viewMode === 'list' && selectedProjects.size > 0;

  return (
    <div className="space-y-4">
      {/* Bulk actions bar */}
      {showBulkActions && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">
            {selectedProjects.size} project{selectedProjects.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProjects(new Set())}
              className="btn btn-outline text-xs px-3 py-1"
            >
              Clear Selection
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="btn btn-destructive text-xs px-3 py-1"
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedProjects.size} Project${selectedProjects.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* Select all checkbox (list view only) */}
      {viewMode === 'list' && projects.length > 0 && (
        <div className="bg-muted/30 rounded-lg px-4 py-2 flex items-center gap-3">
          <Checkbox
            checked={selectedProjects.size === projects.length && projects.length > 0}
            onCheckedChange={toggleSelectAll}
          />
          <label className="text-sm text-muted-foreground cursor-pointer" onClick={toggleSelectAll}>
            Select all projects
          </label>
        </div>
      )}

      {/* Projects list */}
      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                layout: { duration: 0.4 }
              }}
              className={viewMode === 'list' ? 'flex items-start gap-3' : ''}
            >
              {viewMode === 'list' && (
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onCheckedChange={() => toggleProjectSelection(project.id)}
                  className="mt-3"
                />
              )}
              <div className="flex-1">
                <ProjectCard
                  project={project}
                  onProjectDeleted={handleProjectDeleted}
                  onProjectUpdated={handleProjectUpdated}
                  compact={viewMode === 'list'}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}