'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import FigmaThumbnail from './FigmaThumbnail';
import { Grid3x3, List } from 'lucide-react';
import { getCategoryColor } from '@/utils/categoryColors';

type DeletedProject = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel: string;
  createdAt: string;
  deletedAt: string;
};

interface DeletedProjectListProps {
  initialDeletedProjects: DeletedProject[];
}

export default function DeletedProjectList({ initialDeletedProjects }: DeletedProjectListProps) {
  const [deletedProjects, setDeletedProjects] = useState(initialDeletedProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = deletedProjects.filter(project =>
    !searchTerm.trim() ||
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectRemoved = (removedId: string) => {
    setDeletedProjects(prevProjects => 
      prevProjects.filter(project => project.id !== removedId)
    );
  };

  const handleRestore = async (projectId: string, projectName: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/restore`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to restore project');
      }

      const result = await response.json();
      handleProjectRemoved(projectId);
      
      // Show success message with link to restored project
      alert(`"${projectName}" has been restored! You can find it in your projects list.`);
    } catch (error) {
      console.error('Error restoring project:', error);
      alert('Failed to restore project. Please try again.');
    }
  };

  const handlePermanentDelete = async (projectId: string, projectName: string) => {
    const confirmMessage = `Are you sure you want to permanently delete "${projectName}"? This action cannot be undone and will free up the project name and URL for future use.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/permanent-delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to permanently delete project');
      }

      const result = await response.json();
      handleProjectRemoved(projectId);
      
      alert(`"${projectName}" has been permanently deleted. The project name and URL are now available for new projects.`);
    } catch (error) {
      console.error('Error permanently deleting project:', error);
      alert('Failed to permanently delete project. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-2 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search deleted projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm bg-background border border-border rounded px-3 py-2 pr-8 w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Grid/List */}
      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
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
          >
            {viewMode === 'list' ? (
              // Compact list view
              <div className="bg-card border border-border rounded-lg px-4 py-3 transition-all hover:shadow-sm hover:border-foreground/20 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground truncate">{project.name}</h3>
                      {(() => {
                        const colors = getCategoryColor(project.clientLabel || 'Uncategorized');
                        return (
                          <span
                            className="text-xs px-2 py-1 rounded whitespace-nowrap"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {project.clientLabel || 'Uncategorized'}
                          </span>
                        );
                      })()}
                      <div className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded whitespace-nowrap">
                        Deleted
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="whitespace-nowrap">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      <span className="whitespace-nowrap">Deleted {new Date(project.deletedAt).toLocaleDateString()}</span>
                      <span className="font-mono truncate">actualsize.digital/{project.slug}</span>
                    </div>
                  </div>
                  <div className="flex sm:items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto min-w-0">
                    <button
                      onClick={() => handleRestore(project.id, project.name)}
                      className="btn btn-primary text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
                    >
                      Restore
                    </button>
                    <a
                      href={project.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
                    >
                      Figma
                    </a>
                    <button
                      onClick={() => handlePermanentDelete(project.id, project.name)}
                      className="btn btn-destructive text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
                    >
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Grid view
              <div className="bg-card border border-border rounded-lg overflow-hidden project-card transition-all hover:shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-4">
                      <h3 className="text-base font-semibold text-foreground">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const colors = getCategoryColor(project.clientLabel || 'Uncategorized');
                        return (
                          <span
                            className="text-xs px-2 py-1 rounded whitespace-nowrap"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {project.clientLabel || 'Uncategorized'}
                          </span>
                        );
                      })()}
                      <div className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                        Deleted
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Deleted {new Date(project.deletedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-2 py-1 rounded inline-block">
                    actualsize.digital/{project.slug}
                  </p>

                  <div className="mb-6">
                    <FigmaThumbnail
                      figmaUrl={project.figmaUrl}
                      alt={`${project.name} Figma design preview`}
                      className="w-full h-48 border border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleRestore(project.id, project.name)}
                      className="btn btn-primary w-full text-sm"
                    >
                      Restore Project
                    </button>
                    <a
                      href={project.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline w-full text-sm"
                    >
                      View in Figma
                    </a>
                    <button
                      onClick={() => handlePermanentDelete(project.id, project.name)}
                      className="btn btn-destructive w-full text-sm"
                    >
                      Permanently Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

      {filteredProjects.length === 0 && deletedProjects.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No deleted projects match your search.</p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn btn-primary"
          >
            Clear Search
          </button>
        </div>
      )}

      {deletedProjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">All deleted projects have been restored!</p>
          <Link
            href="/projects"
            className="btn btn-subtle"
          >
            Back to Projects
          </Link>
        </div>
      )}
    </div>
  );
}